/**
 * @file Entrypoint for the npm module
 */
import _getConfig from './config.js';
import _build from './build.js';
import _serve from './serve.js';
import _meta from './meta.js';

export const getConfig = _getConfig;
export const build = _build;
export const serve = _serve;
export const meta = _meta;

export default { getConfig, build, serve, meta };
