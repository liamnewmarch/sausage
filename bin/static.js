#!/usr/bin/env node

/**
 * @file Entrypoint for the CLI
 */
import commander from 'commander';
import { exit } from 'process';
import { build, getConfig, meta, serve } from '../lib/index.js';

const { program } = commander;

program.name(meta.name);
program.description(meta.description);
program.version(meta.version);

program.option(
    '-c, --config <path>',
    'path to static config file',
    'static.config.js');

program
    .command('build')
    // TODO support passing options as flags without a config file
    // .option('-i, --input', 'path to content directory', 'content')
    // .option('-o, --output', 'path to build directory', 'build')
    // .option('-c, --copy', 'files to copy into the build directory', false)
    .description('builds the site to the output directory')
    .action(async () => {
      const config = await getConfig(program.config);
      await build(config);
      exit(0);
    });

program
    .command('serve')
    // TODO support passing options as flags without a config file
    // .option('-i, --input', 'path to content directory', 'content')
    // .option('-o, --output', 'path to build directory', 'build')
    // .option('-c, --copy', 'files to copy into the build directory', false)
    .description('runs a local server and watches for changes')
    .action(async () => {
      const config = await getConfig(program.config);
      await serve(config);
    });

program.parse();
