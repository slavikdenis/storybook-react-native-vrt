import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import figlet from 'figlet';
import { red } from 'colorette';
import type { Platforms } from './types';
import { getEmojiForPlatform } from './utils';
import { SUPPORTED_PLATFORMS } from './config';
import { warn } from './console';

export const sayHi = async () =>
  new Promise((resolve, reject) => {
    figlet('Storybook\nVisual Testing', (error, data) => {
      if (error) {
        reject(error);
      }
      console.log(red(data ?? ''));
      resolve(data);
    });
  });

export const COMMANDS = {
  INIT: 'init',
  TEST: 'test',
  UPDATE: 'update',
} as const;

type Commands = (typeof COMMANDS)[keyof typeof COMMANDS];

export const getCliOptions = async () => {
  /**
   * CLI arguments
   */
  const argv = await yargs(hideBin(process.argv))
    .version(false)
    .strict(true)
    .scriptName('react-native-storybook-visual')
    .usage('Usage: $0 <command> [options]')
    // Init
    .command({
      command: COMMANDS.INIT,
      describe: 'Initialize visual regression tool',
      builder: (yargs) =>
        yargs
          .usage(`Usage: $0 ${COMMANDS.INIT} [options]`)
          .example(`$0 ${COMMANDS.INIT}`, 'Initialize visual regression tool')
          .option('platform', {
            type: 'array',
            default: SUPPORTED_PLATFORMS,
            description: 'Platforms to test.',
            choices: SUPPORTED_PLATFORMS,
          })
          .option('force', {
            type: 'boolean',
            default: false,
            description: 'Force re-initialization',
          }),
      handler: () => undefined,
    })
    // Test
    .command({
      command: COMMANDS.TEST,
      describe: 'Test visual regression stories',
      builder: (yargs) =>
        yargs
          .usage(`Usage: $0 ${COMMANDS.TEST} [options]`)
          .example(`$0 ${COMMANDS.TEST}`, 'Test visual regression stories')
          .option('platform', {
            type: 'array',
            default: SUPPORTED_PLATFORMS,
            description: 'Platforms to test.',
            choices: SUPPORTED_PLATFORMS,
          })
          // .option('watch', {
          //   type: 'boolean',
          //   default: false,
          //   description: 'Watch mode',
          // })
          .option('exitOnError', {
            type: 'boolean',
            default: false,
            description: 'Exits on first fail',
          })
          .option('files', {
            type: 'array',
            description: 'Specific files to test',
            defaultDescription: '`stories` field in your storybook config',
          }),
      handler: () => undefined,
    })
    // Update
    .command({
      command: COMMANDS.UPDATE,
      describe: 'Update reference visual test screenshots',
      builder: (yargs) =>
        yargs
          .usage(`Usage: $0 ${COMMANDS.UPDATE} [options]`)
          .example(
            `$0 ${COMMANDS.UPDATE}`,
            'Update reference visual test screenshots',
          )
          .option('platform', {
            type: 'array',
            default: SUPPORTED_PLATFORMS,
            description: 'Platforms to test.',
            choices: SUPPORTED_PLATFORMS,
          }),
      handler: () => undefined,
    })
    .demandCommand(1, 1, 'Please specify a valid command')
    .parseAsync();

  /**
   * Platforms
   */
  const platforms = argv.platform as Platforms[];

  // Warn user if only one platform is provided
  if (platforms.length === 1) {
    warn(
      `Running only on ${platforms[0]} ${getEmojiForPlatform(platforms[0])}`,
    );
  }

  const options = {
    platforms,
    files:
      'files' in argv && Array.isArray(argv.files)
        ? (argv.files as string[])
        : undefined,
    exitOnError:
      'exitOnError' in argv && typeof argv.exitOnError === 'boolean'
        ? argv.exitOnError
        : undefined,
    watch:
      'watch' in argv && typeof argv.watch === 'boolean'
        ? argv.watch
        : undefined,
    force:
      'force' in argv && typeof argv.force === 'boolean'
        ? argv.force
        : undefined,
  } as const;

  return {
    command: argv._[0] as Commands,
    options,
  };
};
