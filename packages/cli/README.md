# Visual Regression Testing for React Native/Expo and Storybook

The `react-native-storybook-visual` is a CLI tool for visual regression testing with Storybook in React Native/Expo for local development.

![Showcase GIF](../../demo/showcase.gif)

## Commands

- `init`: Initialize visual regression testing in your app (generates folder structure, _.gitignore_ file and generates base screenshots)
- `test`: Run visual regression tests against base screenshots
- `update`: Update base screenshots with current screenshots

For more information, run `react-native-storybook-visual --help` or `react-native-storybook-visual <command> --help`

## Requirements

- React Native/Expo app with Storybook
- Storybook Server
- `adb` (Android) and/or `xcrun simctl` (iOS) in your PATH

## Setup

1. Setup `@storybook/react-native` in your app
1. Install `@storybook/react-native-server` and create configuration for it. See guide [here](https://storybook.js.org/blog/storybook-for-react-native-6-5/#optional-server-configuration) and [here](https://dev.to/dannyhw/quick-guide-for-storybookreact-native-server-v6-4nl2) or check out the examples apps in the `apps` folder
1. Install `react-native-storybook-visual` in your app
1. Generate stories via `sb-rn-get-stories`
1. Start up your app with Storybook
1. Start up storybook server via `react-native-storybook-server` in your app
1. Run `react-native-storybook-visual init` to initialize visual regression testing in your app

## Roadmap

- Configurable options / Configuration file
  - [ ] Device list
  - [ ] Storybook folder path
  - [ ] Storybook Server configuration (host, port, secure, etc.)
  - [ ] Tests folder path
  - [ ] React Native / Expo packager port
  - [ ] [`looks-same` configuration](https://github.com/gemini-testing/looks-same?tab=readme-ov-file#building-diff-image)
- [ ] Watch mode
- [ ] Disable hot reload on startup
- [ ] Manage Expo/React Native apps (create, run, etc.)
- [ ] Caching tests
- [ ] Support light/dark variants
- [ ] CI support

## Inspiration

- [Creating Design Systems in React Native - Marek Fořt | React Native EU 2023](https://www.youtube.com/watch?v=jKhLWl1MX5s)
- [Daniel Williams' example of VRT on Storybook](https://twitter.com/Danny_H_W/status/1662835533217669121)
