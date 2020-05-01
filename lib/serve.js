/**
 * @file Development server
 */
import chalk from 'chalk';
import express from 'express';
import { applyPlugins, getPages } from './utils.js';

/**
 * Serves a dynamic version of the site for local development
 *
 * @param {Object} config
 * @param {Object} config.dirs
 * @param {Object} config.options
 * @param {function[]} config.plugins
 */
export default async function(config) {
  // Fetch page and collection maps
  const global = getPages(config.dirs.input, {
    persistent: true,
    recursive: true,
  });

  // Create Express app
  const app = express();

  // Page handler
  app.use(async ({ url }, response, next) => {
    if (url in global.pages) {
      const page = global.pages[url];
      try {
        const output = await applyPlugins(config, global, page);
        console.log(chalk.green(200), url);
        response.send(output);
        response.end();
      } catch ({ message }) {
        console.error(message);
        console.log(chalk.red(500), url);
      }
    } else {
      next();
    }
  });

  // Static file handler
  if (config.dirs.copy) {
    app.use(express.static(config.dirs.copy));
  }

  // Not found handler
  app.use(({ url }, response) => {
    console.log(chalk.yellow(404), url);
    response.status(404);
    response.end();
  });

  // Start server
  const listener = app.listen(config.options.port, config.options.host, () => {
    const { address, port } = listener.address(); // Get actual port used.
    console.log(`Static is serving at http://${address}:${port}`);
  });
}
