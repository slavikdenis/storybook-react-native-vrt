// Learn more https://docs.expo.io/guides/customizing-metro
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
// const workspaceRoot = path.resolve(projectRoot, '../..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    unstable_enableSymlinks: true,
  },
  watchFolders: [path.resolve(__dirname, '../../node_modules')],
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
