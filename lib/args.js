import { argv } from 'process';

const CLI_ARG_FLAG = /^(?:--)(?<flag>[\w]+)/;
const CLI_ARG_MIXED = /^(?:--)(?:[\w]+)=(?!--)(?<value>.*)$/;
const CLI_ARG_VALUE = /^(?!--).*$/;

function parseArgs(rawArgs = argv) {
  const [,, ...args] = rawArgs;

  const parsed = {
    flags: {},
  };

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

      parsed.flags[flag] = value;
    } else {
      if (parsed.command) {
        throw new Error(`Unexpected argument ${arg}`);
      }

      parsed.command = arg;
    }
  }

  return parsed;
}

export const { command, flags } = parseArgs();
