import Static from '../index.js';
import fs from 'fs-extra';
import { basename, dirname, extname, join, relative, resolve } from 'path';
import { stdout } from 'process';
import { CLI_MESSAGE_START, CLI_MESSAGE_END } from './constants.js';
import getConfig from './config.js';

const { copy, emptyDir, readdir, stat, writeFile } = fs;

async function load(sourcePath, { content, templates }) {
  const fullSourcePath = resolve(sourcePath);
  const { default: module } = await import(fullSourcePath);
  const { template } = module[Static];
  const fullTemplatePath = resolve(join(templates, template)) + '.js';
  const { default: render } = await import(fullTemplatePath);
  const path = relative(content, sourcePath);
  return {
    content: await render(module),
    path: join(dirname(path), basename(path, extname(path)) + '.html'),
  };
}

async function loadAll(dirs, target = dirs.content) {
  const pages = [];
  const stats = await stat(target).catch(() => {});
  if (!stats) return;
  for (const file of await readdir(target)) {
    const path = join(target, file);
    const stats = await stat(path);
    if (stats.isDirectory()) {
      pages.push(...await loadAll(dirs, path));
    } else {
      pages.push(await load(path, dirs));
    }
  }
  return pages;
}

export default async function() {
  const { input, output } = await getConfig();
  stdout.write(`${CLI_MESSAGE_START} `);
  await emptyDir(output);
  if (input.static) {
    await copy(input.static, output);
  }
  const pages = await loadAll(input);
  for (const page of pages) {
    await writeFile(join(output, page.path), page.content, 'utf8');
  }
  stdout.write(`${CLI_MESSAGE_END}\n`);
}
