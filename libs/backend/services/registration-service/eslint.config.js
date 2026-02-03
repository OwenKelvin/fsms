const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const baseConfig = require('../../../../eslint.config.mjs');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,
  ...compat
    .config({
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['libs/backend/services/registration-service/tsconfig.*?.json'],
      },
      rules: {},
    })
    .map((config) => ({
      ...config,
      files: ['libs/backend/services/registration-service/**/*.ts'],
      ignores: ['libs/backend/services/registration-service/**/*.spec.ts'],
    })),
];