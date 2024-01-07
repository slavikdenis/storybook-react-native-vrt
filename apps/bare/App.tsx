/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Text,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

import StorybookUIRoot from "./.storybook";
import { LogBox } from "react-native";

// For testing purposes
const IS_STORYBOOK_TESTING = true;

if (IS_STORYBOOK_TESTING) {
  // Hide status bar
  StatusBar.setHidden(true, "none");
  // Disable all warnings
  LogBox.ignoreAllLogs(true);
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.view]}>
      {IS_STORYBOOK_TESTING ? <StorybookUIRoot /> : <Text>Hello World!</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
  },
});

export default App;
