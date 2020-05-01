/**
 * @file Static build task
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import { dirname, join } from 'path';
import { applyPlugins, getPages } from './utils.js';

/**
 * Builds a static version of the site
 *
 * @param {object} config
 * @param {object} config.dirs
 * @param {object} config.options
 * @param {function[]} config.plugins
 */
export default async function(config) {
  // Fetch page and collection maps
  const global = getPages(config.dirs.input, {
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
  for (const [url, page] of Object.entries(global.pages)) {
    const output = await applyPlugins(config, global, page);
    const path = join(config.dirs.output, url, 'index.html');
    console.log(chalk.green('Writing'), path);
    await fs.mkdirp(dirname(path));
    await fs.writeFile(path, output);
  }

  await global.watcher.close();
  console.log('Done!');
}
