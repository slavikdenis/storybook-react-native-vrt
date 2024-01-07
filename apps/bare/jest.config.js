module.exports = {
  preset: "react-native",
  setupFiles: ["./jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native(-.*)?|@storybook(-.*)?|@react-native(-community)?)/)",
  ],
};
