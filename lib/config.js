import { join, resolve } from 'path';
import { cwd } from 'process';
import { DEFAULT_CONFIG_FILENAME } from './constants.js';

export async function getConfig(flags) {
  try {
    const filename = flags.get('config') || DEFAULT_CONFIG_FILENAME;
    const userConfig = await getUserConfig(filename);
    const config = getConfigDefaults();
    return deepMerge(config, userConfig);
  } catch ({ message }) {
    console.log(message);
  }
}

function getConfigDefaults() {
  return Object.seal({
    input: {
      content: 'content',
      static: false,
      templates: 'templates',
    },
    output: 'build',
    plugins: [],
  });
}

function getType(object) {
  return ({}).toString.call(object).replace(/^\[object (.*)\]$/, '$1');
}

async function getUserConfig(filename) {
  try {
    const path = resolve(join(cwd(), filename));
    const module = await import(path);
    return module.default;
  } catch ({ message }) {
    console.log(`Warning: ${message}`);
    return {};
  }
}

function deepMerge(target, ...configs) {
  for (const config of configs) {
    for (const [key, value] of Object.entries(config)) {
      if (key in target) {
        const type = getType(target[key]);
        switch (type) {
          case 'Array':
            target[key] = [...target[key], ...value];
            break;
          case 'Object':
            deepMerge(target[key], value);
            break;
          default:
            target[key] = value;
        }
      }
    }
  }
  return target;
}
