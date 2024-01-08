jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("@storybook/react-native", () => {
  const View = require("react-native/Libraries/Components/View/View");

  return {
    getStorybookUI: jest.fn(() => View),
    addDecorator: jest.fn(),
    configure: jest.fn(),
    addArgTypesEnhancer: jest.fn(),
    addParameters: jest.fn(),
    clearDecorators: jest.fn(),
  };
});
