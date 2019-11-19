import args from './args.js';
import { join, resolve } from 'path';
import { cwd } from 'process';
import { DEFAULT_CONFIG_FILENAME } from './constants.js';

const defaults = {
  input: {
    content: 'content',
    static: false,
    templates: 'templates',
  },
  output: 'build',
  plugins: [],
};

export default async function() {
  const filename = args.config || DEFAULT_CONFIG_FILENAME;
  const user = await getUserConfig(filename);
  return {
    input: {
      content: getValue('content', args, user.input, defaults.input),
      static: getValue('static', args, user.input, defaults.input),
      templates: getValue('templates', args, user.input, defaults.input),
    },
    output: getValue('output', args, user, defaults),
  };
}

async function getUserConfig(filename) {
  const path = resolve(join(cwd(), filename));
  const module = await import(path);
  return module.default;
}

function getValue(key, ...sources) {
  for (const source of sources) {
    if (key in source) {
      return source[key];
    }
  }
}
