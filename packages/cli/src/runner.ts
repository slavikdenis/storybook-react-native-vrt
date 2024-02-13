import { EventEmitter } from "node:events";
import { addons, Channel } from "@storybook/addons";
import createChannel from "@storybook/channel-websocket";
import Events from "@storybook/core-events";
import { retryAsync } from "ts-retry";
import { die } from "./console";
import { getCFSStories } from "./stories";
import { Platforms } from "./types";
import { compareScreenshots, takeScreenshot } from "./screenshot";
import { COMMANDS } from "./cli";
import { getScreenshotPath, isFileExists } from "./fs";

type Modes = (typeof COMMANDS)[keyof typeof COMMANDS];

type Options = {
  mode: Modes;
  url: string;
  host: string;
  port: number;
  secured: boolean;
  configPath: string;
  absolute: boolean;
  customPaths?: string[];
  platforms: Platforms[];
  exitOnError?: boolean;
};

type StoryState = "IDLE" | "RENDERED" | "SHOTS_CAPTURED";

type CurrentStory = {
  id: string;
  state: StoryState;
};

export const RunnerEvents = {
  CREATING_CHANNEL: "CREATING_CHANNEL",
  CHANNEL_CREATED: "CHANNEL_CREATED",
  RENDERED_STORY: "RENDERED_STORY",
  TAKING_SHOTS: "TAKING_SHOTS",
  STORY_PROCESSED: "STORY_PROCESSED",
  FINISHED: "FINISHED",
} as const;

type TestResult = {
  id: string;
  diff: string;
  platform: Platforms;
  isFailed: boolean;
};

export class TestRunner extends EventEmitter {
  private storyQueue: Array<CurrentStory["id"]> = [];
  private currentStory: CurrentStory | null = null;
  // private eventEmitter = new EventEmitter();
  private channel?: Channel;
  private results: TestResult[] = [];
  private readonly settings: Options = {} as Options;
  private storyChangedTimeoutId: NodeJS.Timeout | undefined;

  constructor(opts: Options) {
    super();
    this.processStory = this.processStory.bind(this);
    this.makeScreenshots = this.makeScreenshots.bind(this);
    this.startProcessing = this.startProcessing.bind(this);
    this.start = this.start.bind(this);

    if (opts.mode === COMMANDS.UPDATE) {
      console.error("Update mode is not supported yet!");
      return;
    }

    this.settings = opts;

    // When stories rendered, make screenshots
    this.on(RunnerEvents.RENDERED_STORY, (_storyId) => {
      this.makeScreenshots();
    });

    // When screenshots taken, process next story
    this.on(RunnerEvents.STORY_PROCESSED, (_storyId) => {
      this.processStory();
    });

    // Emit creating channel
    this.emitChange(RunnerEvents.CREATING_CHANNEL);
  }

  start() {
    // Create channel
    const channel = createChannel({
      url: this.settings.url,
      onError: (error) => {
        if ("message" in error && error.message) {
          // @ts-expect-error FIXME
          die("🔴 WebSocket connection failed", error.message);
        } else {
          die("🔴 Failed creating error", JSON.stringify(error));
        }

        process.exit(1);
      },
    });

    // Set channel
    addons.setChannel(channel);

    // Set up channel event listeners
    channel.addListener(Events.CURRENT_STORY_WAS_SET, (e) => {
      // TODO: Ideally we should check if the story changed separately for every platform and have a dedicated timeout for each one
      if (this.currentStory && this.currentStory.state === "IDLE") {
        if (e.storyId === this.currentStory.id) {
          this.currentStory = {
            ...this.currentStory,
            state: "RENDERED",
          };
          this.emitChange(RunnerEvents.RENDERED_STORY, this.currentStory.id);
          clearTimeout(this.storyChangedTimeoutId);
        }
      }
    });

    // Announce channel created
    channel.emit(Events.CHANNEL_CREATED, {
      host: this.settings.host,
      port: this.settings.port,
      secured: this.settings.secured,
    });

    // Get stories
    const csfStories = getCFSStories({
      configPath: this.settings.configPath,
      isAbsolutePaths: this.settings.absolute,
      customPaths: this.settings.customPaths,
    });

    const storyIds = csfStories
      .map(({ stories }) => stories.map(({ id }) => id))
      .flat();

    this.storyQueue = [...storyIds];

    // Preload all stories
    // channel.emit(Events.PRELOAD_STORIES, storyIds); // TODO: Wasn't working in its previous version, fixed it, but not sure if we need it anymore

    // Save channel
    this.channel = channel;

    // Announce channel created
    this.emitChange(RunnerEvents.CHANNEL_CREATED);
  }

  private async processStory() {
    // Pop story from queue
    const storyId = this.storyQueue.pop();

    // Check if queue ended
    if (!storyId) {
      this.emitChange(RunnerEvents.FINISHED, this.results);
      return;
    }

    // Set current story
    this.currentStory = {
      id: storyId,
      state: "IDLE",
    };

    // Emit story change & set a timeout to stop the script if it doesn't change
    this.channel?.emit(Events.SET_CURRENT_STORY, { storyId });
    this.storyChangedTimeoutId = setTimeout(() => {
      die(
        "🔴 Story not changed after 10s, try reloading the Metro bundle and the Storybook server. (Make sure the Storybook server runs first.)"
      );
      process.exit(1);
    }, 10_000);
  }

  private async makeScreenshots() {
    this.emitChange(RunnerEvents.TAKING_SHOTS);

    const story = this.currentStory;

    if (!story) {
      console.error("[makeScreenshots] No story");
      return;
    }

    // Take screenshots
    for (const platform of this.settings.platforms) {
      const screenshotInfo = {
        name: story.id,
        platform: platform,
        dest: this.settings.mode === COMMANDS.INIT ? "base" : "current",
      } as const;

      // Take screenshots
      await takeScreenshot(screenshotInfo);

      // Make sure the screenshot file is saved
      try {
        await retryAsync(
          async () =>
            await isFileExists(
              getScreenshotPath({
                type: screenshotInfo.dest,
                platform,
                name: story.id,
              })
            ),
          {
            delay: 200,
            maxTry: 5,
            until: (isExists) => isExists,
          }
        );
      } catch (error) {
        die(`🔴 Screenshot not found => "${story.id}" on ${platform}.`);
        process.exit(1);
      }

      // Test (compare) screenshots
      if (this.settings.mode === COMMANDS.TEST) {
        const { isFailed, diff } = await compareScreenshots({
          platform,
          storyId: story.id,
        });

        if (isFailed && this.settings.exitOnError) {
          die(
            `🔴 Failed test => "${story.id}" on ${platform}. See diff at ${diff}`
          );
          process.exit(1);
        }

        this.results.push({
          isFailed,
          id: story.id,
          platform: platform,
          diff,
        });
      }
    }

    this.currentStory = {
      ...story,
      state: "SHOTS_CAPTURED",
    };

    this.emitChange(RunnerEvents.STORY_PROCESSED, story.id);
  }

  startProcessing() {
    this.processStory();
  }

  emitChange(task: keyof typeof RunnerEvents, ...args: any[]): boolean {
    return this.emit(task, ...args);
  }

  removeListeners() {
    this.removeAllListeners();
    if (this.channel) {
      this.channel.removeAllListeners();
    }
  }
}
