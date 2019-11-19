import Static from '@liamnewmarch/static';

const body = `
## Hello, world

How are you doing?
`;

export default {
  [Static]: {
    template: 'home',
  },
  body,
  title: 'Hello, world!',
};
