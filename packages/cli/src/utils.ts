import type { Platforms } from "./types";

export const getEmojiForPlatform = (platform: Platforms | undefined) => {
  switch (platform) {
    case "ios":
      return "🍎";
    case "android":
      return "🤖";
    default:
      return "📱";
  }
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
