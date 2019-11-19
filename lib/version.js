import meta from '../package.json';

const version = `v${meta.version}`;

export default function() {
  console.log(version);
}
