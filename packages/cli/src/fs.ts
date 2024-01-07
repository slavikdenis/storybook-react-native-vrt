import { readdir } from 'node:fs/promises';
import { pathExists, ensureDir, outputFile } from 'fs-extra';
import type { Platforms, ScreenShotType } from './types';
import { SCREENSHOTS_DIRS, SCREENSHOT_FORMAT } from './config';

export const ensureRelativePathHasDot = (relativePath: string) =>
  relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

export const getScreenshotDir = (type: ScreenShotType | 'diff') =>
  SCREENSHOTS_DIRS?.[type] ?? undefined;

type GetScreenShotPathOptions = {
  type: ScreenShotType | 'diff';
  platform: Platforms;
  name: string;
};

export const getScreenshotPath = ({
  type,
  platform,
  name,
}: GetScreenShotPathOptions) => {
  const dir = getScreenshotDir(type);

  return `${dir}/${platform}-${name}.${SCREENSHOT_FORMAT}`;
};

export const isDirEmpty = async (path: string) => {
  try {
    const files = await readdir(path);
    return files.length === 0;
  } catch (err) {
    return false;
  }
};

export const isFileExists = async (path: string) => {
  try {
    const exists = await pathExists(path);
    return exists;
  } catch (err) {
    return false;
  }
};

export const createDir = async (path: string) => {
  try {
    await ensureDir(path);
    return true;
  } catch (error) {
    console.error("Could't create directory: ", path, error);
    return false;
  }
};

export const createFile = async (path: string, content: string) => {
  try {
    await outputFile(path, content, { encoding: 'utf-8' });
    return true;
  } catch (error) {
    console.error("Could't create file: ", path, error);
    return false;
  }
};
