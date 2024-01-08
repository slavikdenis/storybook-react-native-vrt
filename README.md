# Visual Regression Testing for React Native/Expo and Storybook

The `react-native-storybook-visual` is a CLI tool for visual regression testing with Storybook in React Native/Expo for local development.

![Showcase GIF](demo/showcase.gif)

## Commands

- `react-native-storybook-visual init`: Initialize visual regression testing in your app (generates folder structure, _.gitignore_ file and generates base screenshots)
- `react-native-storybook-visual test`: Run visual regression tests against base screenshots
- `react-native-storybook-visual update`: Update base screenshots with current screenshots

For more information, run `react-native-storybook-visual --help`.

## Setup

1. Setup `@storybook/react-native` in your app
1. Install `@storybook/react-native-server` and create configuration for it. See guide [here](https://storybook.js.org/blog/storybook-for-react-native-6-5/#optional-server-configuration) and [here](https://dev.to/dannyhw/quick-guide-for-storybookreact-native-server-v6-4nl2) or check out the examples apps in the `apps` folder
1. Install `react-native-storybook-visual` in your app
1. Generate stories via `sb-rn-get-stories`
1. Start up your app with Storybook
1. Start up storybook server via `react-native-storybook-server` in your app
1. Run `react-native-storybook-visual init` to initialize visual regression testing in your app

## What's inside?

This Turborepo includes the following:

### Packages

- `react-native-storybook-visual`: CLI tools for visual regression testing with Storybook in React Native/Expo
- `@tools/tsconfig`: shared `tsconfig.json`s used throughout the monorepo
- `@tools/eslint-config`: ESLint presets
- `@local/ui`: React Native UI components & stories for Storybook

### Apps

- `@apps/bare`: Bare React Native app with Storybook and visual regression testing setup
- `@apps/expo`: Expo app with Storybook and visual regression testing setup

### Useful commands in the repo root

- `yarn build` - Build all packages
- `yarn dev` - Develop all packages
- `yarn lint` - Lint all packages
- `yarn lint:ts` - Lint all packages with TypeScript
- `yarn test` - Test all packages
- `yarn format` - Format all packages
- `yarn changeset` - Generate a changeset
- `yarn clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Versioning and Publishing packages

Package publishing has been configured using [Changesets](https://github.com/changesets/changesets). Please review their [documentation](https://github.com/changesets/changesets#documentation) to familiarize yourself with the workflow.

This example comes with automated npm releases setup in a [GitHub Action](https://github.com/changesets/action). To get this working, you will need to create an `NPM_TOKEN` and `GITHUB_TOKEN` in your repository settings. You should also install the [Changesets bot](https://github.com/apps/changeset-bot) on your GitHub repository as well.

For more information about this automation, refer to the official [changesets documentation](https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md)

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
