/**
 * @file Utility functions
 */
import chokidar from 'chokidar';
import fs from 'fs-extra';
import { join, parse, relative } from 'path';
import yaml from 'yaml-front-matter';

// Default values for every page
export const pageDefaults = {
  content: '',
  title: '',
  url: '/',
};

/**
 * Return a relative URL from two paths
 *
 * @param {string} basePath
 * @param {string} filePath
 * @return {string}
 */
export function pathToURL(basePath, filePath) {
  const { dir, name } = parse(relative(basePath, filePath));
  return dir ? '/' + join(dir, name === 'index' ? '' : name) + '/' : '/';
}

/**
 * Return a context object for a given page path
 *
 * @param {string} pagePath
 * @return {Object}
 */
export async function getPage(pagePath) {
  const pageContent = await fs.readFile(pagePath);
  const { __content: content, ...context } = yaml.safeLoadFront(pageContent);
  return { ...pageDefaults, content, ...context };
}

/**
 * Start a watcher to get all pages and generate collections
 *
 * @param {string} content
 * @param {Object} options
 * @return {Object}
 */
export function getPages(content, options) {
  const collections = {};
  const pages = {};

  const watcher = chokidar.watch(content, options);

  watcher.on('add', async (pagePath) => {
    if ((await fs.stat(pagePath)).isDirectory()) return;
    const page = await getPage(pagePath);
    page.url = pathToURL(content, pagePath);
    const tags = page.tags ? ['all'].concat(page.tags) : ['all'];
    for (const tag of tags) {
      collections[tag] = collections[tag] || [];
      collections[tag].push(page);
    }
    pages[page.url] = page;
  });

  return { collections, pages, watcher };
}

/**
 * Loop through plugins and apply them to the page being rendered
 *
 * @param {Object} config
 * @param {Object} global
 * @param {Object} page
 * @return {any}
 */
export async function applyPlugins(config, global, page) {
  for (const plugin of config.plugins) {
    if (plugin.render instanceof Function) {
      const rendered = await plugin.render(config, global, page);
      return rendered == null ? page : rendered;
    }
  }
  return page;
}
