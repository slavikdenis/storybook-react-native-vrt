import { emptyDir } from "fs-extra";
import { die, info, success, warn } from "./console";
import { getEmojiForPlatform } from "./utils";
import {
  TOOL_CONFIG_DIR,
  SCREENSHOTS_DIRS,
  SERVER_DEFAULTS,
  STORYBOOK_CONFIG_PATH,
} from "./config/defaults";
import type { Platforms } from "./types";
import { COMMANDS, getCliOptions, sayHi } from "./cli";
import { reverseAdbPort, shutdownAndroidEmulator } from "./devices/android";
import {
  createDir,
  createFile,
  getScreenshotDir,
  isDirEmpty,
  isFileExists,
} from "./fs";
import { update } from "./commands/update";
import { TestRunner } from "./runner";
import { shutdownBootedIosDevices } from "./devices/ios";

export const main = async () => {
  console.time("Script run time");

  // Say hi
  await sayHi();

  /**
   * CLI arguments
   */
  const { command, options } = await getCliOptions();
  const { exitOnError, files: customPaths, platforms, force } = options;
  // TODO: 'watch'

  /**
   * Create tool config folder
   */
  await createDir(TOOL_CONFIG_DIR);
  const doesGitignoreExits = await isFileExists(
    `${TOOL_CONFIG_DIR}/.gitignore`,
  );

  if (!doesGitignoreExits) {
    info(`🟠 Creating ${TOOL_CONFIG_DIR}/.gitignore`);
    await createFile(`${TOOL_CONFIG_DIR}/.gitignore`, ".diff\n.current\n");
  }

  /**
   * Create screenshots directories
   */
  await createDir(SCREENSHOTS_DIRS.base);
  await createDir(SCREENSHOTS_DIRS.current);
  await createDir(SCREENSHOTS_DIRS.diff);

  // Check if base directory is empty
  const isBaseEmpty = await isDirEmpty(SCREENSHOTS_DIRS.base);
  if (isBaseEmpty && command !== COMMANDS.INIT && command !== COMMANDS.UPDATE) {
    warn(
      `🟠 Base screenshots directory is empty. Run "${COMMANDS.INIT}" command first.`,
    );
    process.exit(1);
  }

  if (!isBaseEmpty && command === COMMANDS.INIT && !force) {
    warn(
      `🟠 Base screenshots directory is not empty. If you want to override the current screenshots, use "${COMMANDS.INIT} --force".`,
    );
    process.exit(1);
  }

  // Check if current directory is empty
  const isCurrentEmpty = await isDirEmpty(SCREENSHOTS_DIRS.current);
  if (isCurrentEmpty && command === COMMANDS.UPDATE) {
    warn(
      `🟠 No generated screenshots to approve. Run "${COMMANDS.TEST}" command first.`,
    );
    process.exit(1);
  }

  // Clean up diff screenshots
  await emptyDir(SCREENSHOTS_DIRS.diff);

  /**
   * UPDATE command
   */
  if (command === COMMANDS.UPDATE) {
    warn(`🪄 Updating base screenshots`);
    await update(platforms);
    return;
  }

  /**
   * INIT command
   */
  if (command === COMMANDS.INIT) {
    warn(`🪄 Generating base screenshots`);
  }

  /**
   * TEST command
   */
  if (command === COMMANDS.TEST) {
    warn(`🧪 Testing stories`);
  }

  /**
   * Side effects
   */
  // Run Android only side effects
  if (platforms.includes("android")) {
    // Check if "adb" is installed
    warn(
      `${getEmojiForPlatform("android")} Reversing adb port ${
        SERVER_DEFAULTS.port
      }`,
    );
    await reverseAdbPort(SERVER_DEFAULTS.port);
  }

  if (platforms.length === 1 && platforms[0] === "android") {
    // Shutdown iOS simulators
    await shutdownBootedIosDevices();
  }

  // Run iOS only side effects
  if (platforms.length === 1 && platforms[0] === "ios") {
    // Shutdown Android emulator
    await shutdownAndroidEmulator();
  }

  type Results = Array<{
    id: string;
    diff: string;
    platform: Platforms;
    isFailed: boolean;
  }>;

  /**
   * Start test runner
   */
  const runner = new TestRunner({
    mode: command,
    platforms,
    url: SERVER_DEFAULTS.url,
    host: SERVER_DEFAULTS.host,
    port: SERVER_DEFAULTS.port,
    secured: SERVER_DEFAULTS.secured,
    absolute: SERVER_DEFAULTS.absolute,
    configPath: STORYBOOK_CONFIG_PATH,
    customPaths,
    exitOnError,
  });

  // Listeners
  runner.on("CHANNEL_CREATED", () => {
    info(`🟢 Storybook channel created`);
    runner.startProcessing();
  });

  runner.on("FINISHED", (results: Results) => {
    if (command === COMMANDS.INIT) {
      success(`🟢 Base screenshots generated`);
      info(`See screenshots at ${getScreenshotDir("base")}`);
      process.exit(0);
    }

    // Print results (TEST)
    results.forEach(({ id, isFailed, platform, diff }) => {
      if (isFailed) {
        die(
          `🔴${getEmojiForPlatform(platform)} Failed test\t${id}`,
          `See diff at ${diff}`,
        );
      } else {
        success(`🟢${getEmojiForPlatform(platform)} Passed test\t${id}`);
      }
    });

    console.timeEnd("Script run time");

    runner.removeListeners();

    process.exit(results.some(({ isFailed }) => isFailed) ? 1 : 0);
  });

  // Start
  runner.start();
};
