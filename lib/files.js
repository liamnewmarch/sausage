import { copyFile, mkdir, readdir, rmdir, stat, unlink, writeFile } from './fs.js';
import { basename, dirname, extname, join, relative, resolve } from 'path';

export async function copyAll(source, destination) {
  const stats = await stat(source).catch(() => {});
  if (stats.isDirectory()) {
    await mkdir(destination, { recursive: true });
    for (const file of await readdir(source)) {
      const pathSource = join(source, file);
      const pathDestination = join(destination, file);
      await copyAll(pathSource, pathDestination);
    }
  } else {
    await copyFile(source, destination);
  }
}

export async function deleteAll(target) {
  const stats = await stat(target).catch(() => {});
  if (!stats) return;
  for (const file of await readdir(target)) {
    const path = join(target, file);
    const stats = await stat(path);
    if (stats.isDirectory()) {
      await deleteAll(path);
    } else {
      await unlink(path);
    }
  }
  await rmdir(target);
}

export async function load(sourcePath, { content, templates }) {
  const fullSourcePath = resolve(sourcePath);
  const module = await import(fullSourcePath);
  const fullTemplatePath = resolve(join(templates, module.template)) + '.js';
  const { default: template } = await import(fullTemplatePath);
  const path = relative(content, sourcePath);
  return {
    content: await template(module),
    path: join(dirname(path), basename(path, extname(path)) + '.html'),
  };
}

export async function loadAll(dirs, target = dirs.content) {
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

export async function write(base, target, data) {
  const path = join(base, target);
  const dir = dirname(path);
  await mkdir(dir, { recursive: true });
  return writeFile(path, data, 'utf8');
}
