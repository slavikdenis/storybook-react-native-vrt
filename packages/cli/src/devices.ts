import { die } from "./console";

export const reverseAdbPort = async (port: number) => {
  try {
    const { execaCommand } = await import("execa");

    const { stderr } = await execaCommand(
      `adb reverse tcp:${port} tcp:${port}`,
    );

    if (stderr) {
      die("🔴 ADB reverse failed", stderr);
      process.exit(1);
    }

    return;
  } catch (error: any) {
    die(
      "🔴 ADB reverse failed",
      "message" in error ? error.message : JSON.stringify(error),
    );
    process.exit(1);
  }
};

export const shutdownAndroidEmulator = async () => {
  try {
    const { execaCommand } = await import("execa");

    const { stderr } = await execaCommand(`adb emu kill`);

    if (stderr) {
      die("🔴 ADB emulator kill failed", stderr);
    }

    return;
  } catch (error: any) {
    die(
      "🔴 ADB emulator kill failed",
      "message" in error ? error.message : JSON.stringify(error),
    );
  }
};

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
