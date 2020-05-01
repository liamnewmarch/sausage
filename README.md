# Static

__Note: Static is still experimental! Its API may, and probably will, change.__

Static is a static site generator for Node.js and is designed to be lightweight and configurable. Static doesn’t come with a templating engine out of the box, instead you’re encouraged to bring-your-own via plugins.

## Usage

```
Usage: @liamnewmarch/static [options] [command]

Lightweight static site builder

Options:
  -V, --version        output the version number
  -c, --config <path>  path to static config file (default: "static.config.js")
  -h, --help           display help for command

Commands:
  build                builds the site to the output directory
  serve                runs a local server and watches for changes
  help [command]       display help for command
```

## Project goals

### Lightweight

Dependencies are carefully considered to keep the installed size of the project low.

* [`chalk`](https://www.npmjs.com/package/chalk) for making the output readable.
* [`chokidar`](https://www.npmjs.com/package/chokidar) for watching files.
* [`commander`](https://www.npmjs.com/package/commander) for parsing CLI input.
* [`express`](https://www.npmjs.com/package/express) for the local development server.
* [`fs-extra`](https://www.npmjs.com/package/fs-extra) for reading and writing files.
* [`js-yaml`](https://www.npmjs.com/package/js-yaml) for parsing YAML.
* [`yaml-front-matter`](https://www.npmjs.com/package/yaml-front-matter) for reading file metadata.

## Configurable

Static is designed to be used with plugins. Plugins can add support for parsing different file types and for different rendering engines.

* `@liamnewmarch/static-plugin-nunjucks` experimental support for Nunjucks templates (`.njk`).
