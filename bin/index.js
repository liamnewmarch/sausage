#!/usr/bin/env node --experimental-modules --no-warnings

import { exit, stderr } from 'process';
import args from '../lib/args.js';

const commands = ['serve', 'help', 'build'];

async function runCommand(command) {
  const module = await import(`../lib/${command}.js`);
  await module.default();
  exit(0);
}

async function main() {
  try {
    for (const command of commands) {
      if (args[command]) {
        await runCommand(command);
      }
    }
    await runCommand('build');
  } catch ({ message }) {
    stderr.write(`Error: ${message}.\n`);
    exit(1);
  }
}

main();
