module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-console': ['error', { allow: ['warn'] }],
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'global-require': 'off',
  },
};
