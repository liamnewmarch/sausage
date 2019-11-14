import example from './example.plugin.js';

export default {
  input: {
    content: 'content',
    static: 'static',
    templates: 'templates',
  },
  output: 'build',
  plugins: [
    example(),
  ],
};
