export type Platforms = "ios" | "android";

export type ScreenShotType = "current" | "base";

export type Config = {
  /**
   * Directory where the config file and the screenshots are located.
   * @default ./.storybook-visual
   */
  configDir: string;
  /**
   * Storybook config directory.
   * @default ./.storybook
   */
  storybookConfigDir: string;
  /**
   * Supported platforms.
   * @default ["ios", "android"]
   */
  supportedPlatforms: Array<Platforms>;
  /**
   * Storybook React Native Server options.
   */
  server: {
    /**
     * Whether to use https or http.
     * @default false
     */
    secured: boolean;
    /**
     * Server host.
     * @default localhost
     */
    host: string;
    /**
     * Server port.
     * @default 7007
     */
    port: number;
    /**
     * Whether to use absolute url or not.
     * @default true
     */
    absolute: boolean;
  };
};
