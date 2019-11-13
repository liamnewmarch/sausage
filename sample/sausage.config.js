import example from './example.plugin.js';

export default {
  input: {
    content: 'content',
    templates: 'templates',
  },
  output: 'build',
  plugins: [
    example(),
  ],
};
