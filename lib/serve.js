/**
 * @file Development server
 */
import chalk from 'chalk';
import express from 'express';
import { getGlobal } from './utils.js';
import { applyPlugins } from './plugins.js';

/**
 * Serves a dynamic version of the site for local development
 *
 * @param {static.config} config
 */
export default async function(config) {
  // Fetch page and collection maps
  const global = getGlobal(config.dirs.input, {
    persistent: true,
    recursive: true,
  });

  // Create Express app
  const app = express();

  // Page handler
  app.use(async ({ url }, response, next) => {
    if (global.pages.has(url)) {
      const page = global.pages.get(url);
      try {
        const rendered = await applyPlugins('render', config, { global, ...page });
        const output = await applyPlugins('transform', config, rendered);
        console.log(chalk.green(200), url);
        response.send(output);
        response.end();
      } catch (error) {
        console.error(error);
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
