import looksSame from 'looks-same';
// @ts-expect-error FIXME
import * as osnapAndroid from '@ferocia-oss/osnap/src/android.js';
// @ts-expect-error FIXME
import * as osnapIos from '@ferocia-oss/osnap/src/ios.js';
import { die, info } from './console';
import type { Platforms, ScreenShotType } from './types';
import { getEmojiForPlatform } from './utils';
import { getScreenshotPath } from './fs';

type TakeScreenShotOptions = {
  // Name of the story
  name: string;
  // Destination of the screenshot
  dest: ScreenShotType;
  // Platform to take screenshot
  platform: Platforms;
};

export const takeScreenshot = async ({
  name,
  platform,
  dest,
}: TakeScreenShotOptions) => {
  const osnap = platform === 'android' ? osnapAndroid : osnapIos;

  info(`📸${getEmojiForPlatform(platform)} Taking screenshot\t\t\t${name}`);

  try {
    await osnap.saveToFile({
      platform,
      filename: getScreenshotPath({
        name,
        platform,
        type: dest,
      }),
    });
  } catch (error: any) {
    die(
      `🔴${getEmojiForPlatform(
        platform,
      )} Failed to take screenshot => "${name}"`,
      error?.message ?? 'Unknown error',
    );

    process.exit(1);
  }
};

type CompareScreenShotsOptions = {
  storyId: string;
  platform: Platforms;
};

export const compareScreenshots = async ({
  storyId,
  platform,
}: CompareScreenShotsOptions) => {
  const reference = getScreenshotPath({
    name: storyId,
    platform,
    type: 'base',
  });
  const current = getScreenshotPath({
    name: storyId,
    platform,
    type: 'current',
  });
  const diff = getScreenshotPath({
    name: storyId,
    platform,
    type: 'diff',
  });

  info(
    `🔍${getEmojiForPlatform(platform)} Comparing screenshots\t\t${storyId}`,
  );
  const { equal } = await looksSame(current, reference);
  const isFailed = !equal;

  if (isFailed) {
    await looksSame.createDiff({
      reference,
      current,
      diff,
      highlightColor: '#ff00ff', // color to highlight the differences
      strict: false, // strict comparison
      tolerance: 2.5,
      antialiasingTolerance: 0,
      ignoreAntialiasing: true, // ignore anti aliasing by default
      ignoreCaret: true, // ignore caret by default
    });
  }

  return {
    isFailed,
    diff,
  };
};
