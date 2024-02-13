import { getStorybookUI } from "@storybook/react-native";
import "./doctools";
import "./storybook.requires";

const StorybookUIRoot = getStorybookUI({
  enableWebsockets: true,
  onWsConnectionError: (e) => {
    console.error(
      "Error connecting to the Storybook WebSocket server. Restart the Storybook server and try again. Error:",
      e.message
    );
  },
  onDeviceUI: false,
  port: 7007,
});

export default StorybookUIRoot;
