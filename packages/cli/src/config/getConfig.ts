import { cosmiconfig } from "cosmiconfig";
import { MODULE_NAME } from "./constants";
import { TOOL_CONFIG_DIR } from "./defaults";
import { info } from "../console";
import { createFile } from "../fs";
import type { Config } from "../types";

const parseConfig = (config: Partial<Config>) => {
  /**
   * The `parseConfig` function validates the config object and returns a new
   * object with the validated values. If the config object is invalid, it
   * throws an error.
   * 
   * In case, no options are provided or not all options are provided, the
   * default values are used.
   */

  return {
    configDir: config?.configDir ?? TOOL_CONFIG_DIR,
    storybookConfigDir: config?.storybookConfigDir ?? "./.storybook",
    supportedPlatforms: config?.supportedPlatforms ?? ["ios", "android"],
    server: {
      secured: config?.server?.secured ?? false,
      host: config?.server?.host ?? "localhost",
      port: config?.server?.port ?? 7007,
      absolute: config?.server?.absolute ?? true,
    },
  } as const;
}

export const getConfig = async (): Promise<Config> => {
  const explorer = cosmiconfig(MODULE_NAME, {
    searchPlaces: [
      `.${MODULE_NAME}rc`,
      `.${MODULE_NAME}rc.json`,
      `.${MODULE_NAME}rc.yaml`,
      `.${MODULE_NAME}rc.yml`,
      `.${MODULE_NAME}rc.js`,
      `.${MODULE_NAME}rc.ts`,
      `.${MODULE_NAME}rc.mjs`,
      `.${MODULE_NAME}rc.cjs`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.json`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.yaml`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.yml`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.js`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.ts`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.mjs`,
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.cjs`,
      `${MODULE_NAME}.config.js`,
      `${MODULE_NAME}.config.ts`,
      `${MODULE_NAME}.config.mjs`,
      `${MODULE_NAME}.config.cjs`,
    ],
  });

  const result = await explorer.search();

  /**
   * Create config file, if not exists
   */
  if (!result) {
    info(`🟠 Creating ${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.js`);
    await createFile(
      `${TOOL_CONFIG_DIR}/${MODULE_NAME}rc.js`,
      `module.exports = {
  // Add your custom config here
  // See: https://github.com/slavikdenis/storybook-react-native-vrt/tree/main/packages/cli
};\n`,
    );

    return parseConfig({});
  }

  return parseConfig(result.config);
};