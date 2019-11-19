import meta from '../package.json';

export const helpText = `${meta.name} v${meta.version}
Usage:
  ${meta.name} [options]
`;

export default function() {
  console.log(helpText);
}
