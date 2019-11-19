import Static from '../index.js';
import express from 'express';
import { basename, dirname, join, resolve } from 'path';
import args from './args.js';
import getConfig from './config.js';

async function loadContent({ content }, url) {
  const path = resolve(url.endsWith('/') ? (
    join(content, url, 'index.js')
  ) : (
    join(content, dirname(url), basename(url) + '.js')
  ));
  const module = await import(path);
  return module.default;
}

async function loadTemplate({ templates }, name) {
  console.log(templates, name);
  const path = resolve(join(templates, basename(name) + '.js'));
  const module = await import(path);
  return module.default;
}

async function render(dirs, url) {
  const content = await loadContent(dirs, url);
  const template = await loadTemplate(dirs, content[Static].template);
  return template(content);
}

export default async function() {
  const { input } = await getConfig();

  const hostname = args.hostname || '0.0.0.0';
  const port = args.port || 3000;

  const app = express();

  app.use(express.static(input.static));

  app.get('*', async (request, response) => {
    try {
      const page = await render(input, request.url);
      response.send(page);
    } catch (error) {
      response.status(404).send('404 Not Found');
    }
  });

  app.listen(port, hostname, () => {
    console.log(`Server listening on port ${port}.`);
  });
}
