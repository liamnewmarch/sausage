module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'arrow-parens': [
      'error',
      'as-needed',
      { requireForBlockBody: true },
    ],
    'max-len': [
      'error',
      { code: 120 },
    ],
    'object-curly-spacing': [
      'error',
      'always',
      { objectsInObjects: false },
    ],
    'require-jsdoc': 0,
  },
};
