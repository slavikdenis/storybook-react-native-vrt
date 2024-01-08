import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import StorybookUIRoot from "./.storybook";

import { StatusBar, Text, LogBox } from "react-native";

// For testing purposes
const IS_STORYBOOK_TESTING = true;

if (IS_STORYBOOK_TESTING) {
  // Hide status bar
  StatusBar.setHidden(true, "none");
  // Disable all warnings
  LogBox.ignoreAllLogs(true);
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={{ flex: 1 }}>
        {IS_STORYBOOK_TESTING ? <StorybookUIRoot /> : <Text>Hello World!</Text>}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
