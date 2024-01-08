import { readdir } from "node:fs/promises";
import { move, remove } from "fs-extra";
import { SCREENSHOTS_DIRS, SCREENSHOT_FORMAT } from "../config";
import { die, info, success } from "../console";
import { Platforms } from "../types";
import { getEmojiForPlatform } from "../utils";

const filterScreenshotFile = (file: string, platform: Platforms) =>
  file.startsWith(`${platform}-`) && file.endsWith(`.${SCREENSHOT_FORMAT}`);

export const update = async (platforms: Platforms[]) => {
  for (const platform of platforms) {
    info(
      `🔁${getEmojiForPlatform(
        platform,
      )} Updating base screenshots for ${platform}`,
    );

    try {
      const files = await readdir(SCREENSHOTS_DIRS.base);
      // Filter out
      const filteredFiles = files.filter((file) =>
        filterScreenshotFile(file, platform),
      );
      // Remove content of base directory
      for (const file of filteredFiles) {
        await remove(`${SCREENSHOTS_DIRS.base}/${file}`);
      }
    } catch (error: any) {
      die(
        `🔴${getEmojiForPlatform(
          platform,
        )} Failed to remove old base screenshots for ${platform}`,
        "message" in error ? error.message : JSON.stringify(error),
      );

      process.exit(1);
    }

    try {
      const files = await readdir(SCREENSHOTS_DIRS.current);
      // Filter out
      const filteredFiles = files.filter((file) =>
        filterScreenshotFile(file, platform),
      );
      // Move files
      for (const file of filteredFiles) {
        await move(
          `${SCREENSHOTS_DIRS.current}/${file}`,
          `${SCREENSHOTS_DIRS.base}/${file}`,
          { overwrite: true },
        );
      }
    } catch (error: any) {
      die(
        `🔴${getEmojiForPlatform(
          platform,
        )} Failed to move base screenshots for ${platform}`,
        "message" in error ? error.message : JSON.stringify(error),
      );

      process.exit(1);
    }
  }

  success(`🟢 Base screenshots updated`);

  process.exit(0);
};
