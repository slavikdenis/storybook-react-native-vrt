import path from 'node:path';
import { readFileSync } from 'node:fs';
import * as glob from 'glob';
// @ts-expect-error FIXME
import { getMain } from '@storybook/react-native/scripts/loader.js';
import { normalizeStories } from '@storybook/core-common';
import * as csfTools from '@storybook/csf-tools';
import { ensureRelativePathHasDot } from './fs';
import { die, info, warn } from './console';

type Config = {
  configPath: string;
  isAbsolutePaths: boolean;
  customPaths?: string[];
};

export const getCFSStories = ({
  configPath,
  customPaths,
  isAbsolutePaths,
}: Config) => {
  /**
   * Imports of stories
   */
  const hasCustomPaths = Array.isArray(customPaths);

  // Check if custom paths are provided
  if (hasCustomPaths && customPaths.length === 0) {
    die(`🔴 No custom paths provided`);
    process.exit(1);
  }

  let stories: string[];

  if (hasCustomPaths) {
    // Warn user when using custom paths
    warn('🟠 Using custom paths:');
    customPaths?.forEach((path) => {
      info(`${path}`);
    });

    // Load stories from custom paths
    stories = customPaths;
  } else {
    // Load stories from storybook config
    const mainImport = getMain({ configPath });
    const main = mainImport.default ?? mainImport;
    stories = main.stories;
  }

  const storiesSpecifiers = normalizeStories(stories, {
    configDir: configPath,
    workingDir: process.cwd(),
  });

  /**
   * Story paths
   */
  const storyPaths = storiesSpecifiers.reduce((acc, specifier) => {
    const paths = glob
      .sync(specifier.files, {
        cwd: path.resolve(process.cwd(), specifier.directory),
        absolute: isAbsolutePaths,
        // default to always ignore (exclude) anything in node_modules
        ignore: ['**/node_modules'],
      })
      .map((storyPath) => {
        const pathWithDirectory = path.join(specifier.directory, storyPath);
        const requirePath = isAbsolutePaths
          ? storyPath
          : ensureRelativePathHasDot(
              path.relative(configPath, pathWithDirectory),
            );

        const normalizePathForWindows = (str: string) =>
          path.sep === '\\' ? str.replace(/\\/g, '/') : str;

        return normalizePathForWindows(requirePath);
      });
    return [...acc, ...paths];
  }, [] as string[]);

  // Warn and exit if no stories found
  if (storyPaths.length === 0) {
    die(`🔴 No stories found`);
    process.exit(1);
  }

  /**
   * CSF Stories
   */
  const csfStories = storyPaths.map((storyPath) => {
    const code = readFileSync(storyPath, { encoding: 'utf-8' }).toString();

    return csfTools
      .loadCsf(code, {
        fileName: storyPath,
        makeTitle: (userTitle) => userTitle,
      })
      .parse();
  });

  return csfStories;
};
