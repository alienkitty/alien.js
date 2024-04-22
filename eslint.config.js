import globals from 'globals';
import js from '@eslint/js';
import html from 'eslint-plugin-html';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.html'],
    plugins: {
      html
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'arrow-parens': ['error', 'as-needed'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'comma-dangle': ['warn', 'never'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'curly': ['error', 'multi-line'],
      'eqeqeq': ['error', 'always'],
      'indent': ['error', 4, { 'SwitchCase': 1 }],
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'linebreak-style': ['error', 'unix'],
      'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
      'new-parens': 'error',
      'no-inner-declarations': 'off',
      'no-return-await': 'error',
      'object-curly-spacing': ['error', 'always'],
      'object-shorthand': ['error', 'always'],
      'one-var': ['error', { 'initialized': 'never' }],
      'padded-blocks': ['error', 'never'],
      'prefer-arrow-callback': 'error',
      'prefer-const': ['error', { 'destructuring': 'any' }],
      'quotes': ['error', 'single'],
      'semi-spacing': ['error', { 'before': false, 'after': true }],
      'semi': ['error', 'always'],
      'sort-imports': ['warn', { 'ignoreDeclarationSort': true }],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', { 'words': true, 'nonwords': false }]
    }
  }
];
