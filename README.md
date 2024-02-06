# Visual Regression Testing for React Native/Expo and Storybook

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
