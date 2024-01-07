import { getStorybookUI } from "@storybook/react-native";
import "./doctools";
import "./storybook.requires";

const StorybookUIRoot = getStorybookUI({
  enableWebsockets: true,
  onDeviceUI: false,
  port: 7007,
});

export default StorybookUIRoot;
