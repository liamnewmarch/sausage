import minimist from 'minimist';
import { argv } from 'process';

export default minimist(argv.slice(2));
