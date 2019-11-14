import { promises } from 'fs';

export const {
  copyFile,
  mkdir,
  readdir,
  rmdir,
  stat,
  unlink,
  writeFile,
} = promises;
