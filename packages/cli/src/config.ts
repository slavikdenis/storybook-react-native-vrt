import type { Platforms } from "./types";

/**
 * Configurations
 */
export const TOOL_CONFIG_DIR = "./.storybook-visual";
export const STORYBOOK_CONFIG_PATH = "./.storybook";

/**
 * Platforms
 */
export const SUPPORTED_PLATFORMS: Platforms[] = ["ios", "android"];

/**
 * Screenshot settings
 */
export const SCREENSHOT_FORMAT = "png";
const SCREENSHOTS_CURRENT_DIR = ".current";
const SCREENSHOTS_BASE_DIR = ".base";
const SCREENSHOTS_DIFF_DIR = ".diff";
export const SCREENSHOTS_DIRS = {
  current: `${TOOL_CONFIG_DIR}/${SCREENSHOTS_CURRENT_DIR}`,
  base: `${TOOL_CONFIG_DIR}/${SCREENSHOTS_BASE_DIR}`,
  diff: `${TOOL_CONFIG_DIR}/${SCREENSHOTS_DIFF_DIR}`,
};

/**
 * Websocket server
 */
const serverConfig = {
  secured: false,
  host: "localhost",
  port: 7007,
  absolute: true,
};

const serverVariables = {
  websocketType: serverConfig.secured ? "wss" : "ws",
  domain: `${serverConfig.host}:${serverConfig.port}`,
};

export const SERVER_DEFAULTS = {
  ...serverConfig,
  ...serverVariables,
  url: `${serverVariables.websocketType}://${serverVariables.domain}`,
} as const;
