#!/usr/bin/env node --experimental-modules --no-warnings

import { exit, stderr } from 'process';
import args from '../lib/args.js';

const commands = ['version', 'help', 'serve', 'build'];

async function runCommand(command) {
  const module = await import(`../lib/${command}.js`);
  return module.default();
}

async function main() {
  try {
    for (const command of commands) {
      if (args[command]) {
        return await runCommand(command);
      }
    }
    return await runCommand('build');
  } catch (error) {
    if (args.verbose) {
      console.error(error);
      exit(1);
    } else {
      stderr.write(`Error: ${error.message}.\n`);
      exit(1);
    }
  }
}

main();
