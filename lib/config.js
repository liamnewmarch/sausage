import args from './args.js';
import { join, resolve } from 'path';
import { cwd } from 'process';
import { DEFAULT_CONFIG_FILENAME } from './constants.js';

export default async function() {
  const filename = args.config || DEFAULT_CONFIG_FILENAME;
  const userConfig = await getUserConfig(filename);
  const config = getConfigDefaults();
  return deepMerge(config, userConfig);
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
  const path = resolve(join(cwd(), filename));
  const module = await import(path);
  return module.default;
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
