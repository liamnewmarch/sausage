/**
 * @file Read and export package.json
 */
import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));

// Synchronous read until top-level await lands
export default fs.readJSONSync(resolve(dir, '../package.json'));
