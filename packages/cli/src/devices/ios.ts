import { die } from "../console";

export const shutdownBootedIosDevices = async () => {
  try {
    const { execaCommand } = await import("execa");

    const { stderr } = await execaCommand(`xcrun simctl shutdown all`);

    if (stderr) {
      die("🔴 iOS simulator shutdown failed", stderr);
    }

    return;
  } catch (error: any) {
    die(
      "🔴 iOS simulator shutdown failed",
      "message" in error ? error.message : JSON.stringify(error),
    );
  }
};
