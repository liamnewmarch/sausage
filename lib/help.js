import meta from '../package.json';

const help = `${meta.name} v${meta.version}
Usage:
  ${meta.name} [options]
`;

export default function() {
  console.log(help);
}
