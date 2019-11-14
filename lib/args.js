import { argv } from 'process';
import { CLI_ARG_FLAG, CLI_ARG_MIXED, CLI_ARG_VALUE } from './constants.js';

export const flags = new Map();

const [,, ...args] = argv;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  const isValidFlag = CLI_ARG_FLAG.exec(arg);

  if (isValidFlag) {
    const { flag } = isValidFlag.groups;
    const isMixed = CLI_ARG_MIXED.exec(arg);
    const value = isMixed ? isMixed.groups.value : args[++i];
    const isValidValue = CLI_ARG_VALUE.test(value);

    if (!isValidValue) {
      throw new Error(`Invalid value for ${flag}: ${value}`);
    }

    flags.set(flag, value);
  } else {
    throw new Error(`Unexpected argument ${arg}`);
  }
}
