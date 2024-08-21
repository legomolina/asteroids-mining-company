import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            globals: globals.browser,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/arrow-spacing': 'error',
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/no-non-null-assertion': 'off',
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
        },
    },
];