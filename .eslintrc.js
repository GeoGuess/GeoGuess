module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        ...(process.env.NODE_ENV === 'production'
            ? ['eslint:recommended']
            : []),
        'plugin:vue/essential',
    ],
    globals: {
        launchQueue: 'readonly',
        google: 'readonly',
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['vue', 'prettier'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        semi: ['error', 'always'],
        'vue/html-indent': ['warn', 4],        
        "vue/multi-word-component-names": 'off',
        'vue/valid-v-slot': 'off',
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
