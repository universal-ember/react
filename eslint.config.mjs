import { configs } from '@nullvoxpopuli/eslint-configs';

export default [
  ...configs.ember(import.meta.dirname),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
];
