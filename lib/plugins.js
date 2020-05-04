/**
 * @file Plugin management
 */

export const plugins = {
  parse: [],
  render: [],
  transform: [],
};

/**
 * Add a plugin.
 *
 * @param {static.plugin} plugin
 */
export function addPlugin(plugin = {}) {
  for (const [key, fn] of Object.entries(plugin)) {
    if (key in plugins) plugins[key].push(fn);
  }
}

/**
 * Apply plugins.
 *
 * @param {string} key
 * @param {static.config} config
 * @param {static.config|string} input
 * @return {static.config|string}
 */
export async function applyPlugins(key, config, input) {
  for (const fn of plugins[key]) {
    const output = await fn(input, config);
    if (output) return output;
  }
  return input;
}
