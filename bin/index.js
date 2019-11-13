#!/usr/bin/env node --experimental-modules

async function main() {
  try {
    const { command, flags } = await import('../lib/args.js');
    const { getConfig } = await import('../lib/config.js');
    console.log('command', command, 'flags', flags);
    const config = await getConfig(flags.configPath);
    console.log('index.js', command, config);
  } catch (error) {
    console.log(error);
  }
}

main();
