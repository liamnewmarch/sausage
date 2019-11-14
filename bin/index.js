#!/usr/bin/env node --experimental-modules --no-warnings

import { exit } from 'process';
import meta from '../package.json';

const helpText = `${meta.name} v${meta.version}
Usage:
  ${meta.name} [options]
`;

async function main() {
  try {
    const { flags } = await import('../lib/args.js');

    if (flags.help) {
      console.log(helpText);
      exit(0);
    }

    const { getConfig } = await import('../lib/config.js');
    const { build } = await import('../lib/build.js');

    const config = await getConfig(flags);
    await build(config);
    exit(0);
  } catch (error) {
    console.log(error);
  }
}

main();
