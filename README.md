# Visual Regression Testing for React Native Storybook

## What's inside?

This Turborepo includes the following:

### Apps and Packages

- `react-native-storybook-visual`: CLI tools for visual regression testing with Storybook in React Native/Expo
- `@tools/tsconfig`: shared `tsconfig.json`s used throughout the monorepo
- `@tools/eslint-config`: ESLint presets
- `ui`: React Native UI components & stories for Storybook

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Useful commands

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

### npm

If you want to publish package to the public npm registry and make them publicly available, this is already setup.

To publish packages to a private npm organization scope, **remove** the following from each of the `package.json`'s

```diff
- "publishConfig": {
-  "access": "public"
- },
```

### GitHub Package Registry

See [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#publishing-a-package-using-publishconfig-in-the-packagejson-file)

### Setup

1. Setup `@storybook/react-native` in your app
2. Install `@storybook/react-native-server` and create configuration for it. See guide [here](https://storybook.js.org/blog/storybook-for-react-native-6-5/#optional-server-configuration) and [here](https://dev.to/dannyhw/quick-guide-for-storybookreact-native-server-v6-4nl2) or check out the examples apps in the `apps` folder
