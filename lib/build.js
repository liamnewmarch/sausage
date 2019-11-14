import { stdout } from 'process';
import { copyAll, deleteAll, loadAll, write } from './files.js';
import { CLI_MESSAGE_START, CLI_MESSAGE_END } from './constants.js';

export async function build({ input, output, plugins }) {
  stdout.write(`${CLI_MESSAGE_START} `);
  await deleteAll(output);
  if (input.static) {
    await copyAll(input.static, output);
  }
  const pages = await loadAll(input);
  for (const page of pages) {
    for (const plugin of plugins) {
      page.content = await plugin(page.content);
    }
    await write(output, page.path, page.content);
  }
  stdout.write(`${CLI_MESSAGE_END}\n`);
}
