/**
 * @file Utility functions
 */
import chokidar from 'chokidar';
import fs from 'fs-extra';
import { join, parse, relative } from 'path';
import yaml from 'yaml-front-matter';

/**
 * @type {static.page}
 */
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
export function getUrl(basePath, filePath) {
  const { dir, name } = parse(relative(basePath, filePath));
  return dir ? '/' + join(dir, name === 'index' ? '' : name) + '/' : '/';
}

/**
 * Return a context object for a given page path
 *
 * @param {string} pagePath
 * @return {static.page}
 */
export async function getPage(pagePath) {
  const pageContent = await fs.readFile(pagePath);
  const { __content: content, ...context } = yaml.safeLoadFront(pageContent);
  return { ...pageDefaults, content, ...context };
}

/**
 * Get unique tags for a given page
 *
 * @param {string[]} page
 * @return {Set}
 */
function getTags({ tags = [] }) {
  return new Set(['all'].concat(tags).filter(Boolean));
}

/**
 * Start a watcher to get all pages and generate collections
 *
 * @param {string} content
 * @param {chokidar.WatchOptions} options
 * @return {static.global}
 */
export function getGlobal(content, options) {
  const collections = {};
  const pages = new Map();

  const watcher = chokidar.watch(content, options);

  watcher.on('add', async (pagePath) => {
    if ((await fs.stat(pagePath)).isDirectory()) return;
    const page = await getPage(pagePath);
    page.url = getUrl(content, pagePath);
    for (const tag of getTags(page)) {
      collections[tag] = collections[tag] || [];
      collections[tag].push(page);
    }
    pages.set(page.url, page);
  });

  return { collections, pages, watcher };
}
