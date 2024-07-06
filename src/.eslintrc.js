module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: './tsconfig.json',
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  ignorePatterns: [
    "eslintrc.js",
    "rollup.config.js",
    "dist/**",
  ],
  rules: {
    indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'double', { avoidEscape: true }],
    semi: ['error', 'never'],
    eqeqeq: ['error', 'smart'],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/strict-boolean-expressions': ['error'],
    '@typescript-eslint/no-namespace': 'off'
  }
};