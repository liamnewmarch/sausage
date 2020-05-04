/**
 * @file Static build task
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import { dirname, join } from 'path';
import { getGlobal } from './utils.js';
import { applyPlugins } from './plugins.js';

/**
 * Builds a static version of the site
 *
 * @param {static.config} config
 */
export default async function(config) {
  // Fetch page and collection maps
  const global = getGlobal(config.dirs.input, {
    persistent: false,
    recursive: true,
  });

  console.log(`Cleaning ${config.dirs.output} directory`);
  await fs.remove(config.dirs.output);

  // Static files
  if (config.dirs.copy) {
    console.log(`Copying ${config.dirs.copy} files`);
    await fs.copy(config.dirs.copy, config.dirs.output);
  }

  // Write pages
  for (const [url, page] of global.pages) {
    const rendered = await applyPlugins('render', config, { global, ...page });
    const output = await applyPlugins('transform', config, rendered);
    const path = join(config.dirs.output, url, 'index.html');
    console.log(chalk.green('Writing'), path);
    await fs.mkdirp(dirname(path));
    await fs.writeFile(path, output);
  }

  await global.watcher.close();
  console.log('Done!');
}
