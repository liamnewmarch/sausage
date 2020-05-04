declare namespace static {
  export type collections = {
    [tag: string]: static.page,
  };

  export type config = {
    dirs?: {
      copy?: string | false,
      input?: string,
      output?: string,
    },
    options?: {
      host?: string,
      port?: number,
    },
    plugins?: plugin[],
  };

  export type global = {
    collections: static.collections,
    pages: Map<string, page>,
    watcher: chokidar.FSWatcher,
  }

  export type page = {
    content: string,
    tags?: string[],
    title: string,
    url: string,
    [context: string]: any,
  };

  export type plugin = {
    load?: (input: string, config: config) => page,
    render?: (input: page, config: config) => string,
    transform?: (input: string, config: config) => string,
  };
}
