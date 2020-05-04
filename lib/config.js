/**
 * @file Config parsing
 */
import { extname, resolve } from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { addPlugin } from './plugins.js';

/**
 * @type {static.config}
 */
export const DEFAULTS = {
  dirs: {
    input: resolve('content'),
    output: resolve('build'),
  },
  options: {
    host: 'localhost',
    port: 4000,
  },
  plugins: [],
};

/**
 * Load the config file from a path based on its file type
 *
 * @param {string} path
 * @return {any}
 */
export async function readConfigFile(path) {
  switch (extname(path)) {
    case '.js':
      return (await import(resolve(path))).default;
    case '.json':
      return await fs.readJSON(resolve(path));
    case '.yaml':
    case '.yml':
      return yaml.load(fs.readFile(resolve(path)));
    default:
      throw new Error(`Unknown file type for config ${path}`);
  }
}

/**
 * Returns a config file from defaults and user-specified options
 *
 * @param {string} path
 * @return {static.config}
 */
export default async function(path) {
  if (path && await fs.pathExists(path)) {
    try {
      const config = await readConfigFile(path);
      [...DEFAULTS.plugins, ...config.plugins].forEach(addPlugin);
      return {
        dirs: { ...DEFAULTS.dirs, ...config.dirs },
        options: { ...DEFAULTS.options, ...config.options },
      };
    } catch ({ message }) {
      console.warn(`Warning: ${message}`);
    }
  }
  return DEFAULTS;
}
