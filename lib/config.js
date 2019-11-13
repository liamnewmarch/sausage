import { join, resolve } from 'path';
import { cwd } from 'process';

export async function getConfig(filename = 'sausage.config.js') {
  try {
    const path = resolve(join(cwd(), filename));
    const { default: config } = await import(path);
    return config;
  } catch ({ message }) {
    console.log(message);
  }
}
