/**
 * @file Development server
 */
import chalk from 'chalk';
import { staticServer } from '@liamnewmarch/static-server';
import { getGlobal } from './utils.js';
import { applyPlugins } from './plugins.js';

/**
 * Page handler
 *
 * @param {static.config} config
 * @return {function}
 */
function handler(config) {
  const global = getGlobal(config.dirs.input, {
    persistent: true,
    recursive: true,
  });

  return async ({ url }, response, next) => {
    if (global.pages.has(url)) {
      const page = global.pages.get(url);
      try {
        const rendered = await applyPlugins('render', config, { global, ...page });
        const output = await applyPlugins('transform', config, rendered);
        console.log(chalk.green(200), url);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(output.toString(), 'utf-8');
      } catch (error) {
        console.error(error);
        console.log(chalk.red(500), url);
      }
    } else {
      next();
    }
  };
}

/**
 * Serves a dynamic version of the site for local development
 *
 * @param {static.config} config
 */
export default async function(config) {
  staticServer({
    directory: config.dirs.copy || false,
    handlers: [
      handler(config),
    ],
    host: config.options.host,
    port: config.options.port,
  });
}
