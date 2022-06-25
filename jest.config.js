module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        'src/utils/*',
        '!**/node_modules/**',
        '!src/plugins/vuetify.js',
        '!src/lang/*',
        '!src/router.js',
        '!src/store/index.js',
        '!src/main.js',
        '!src/registerServiceWorker.js',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!gmap-vue|axios-cache-adapter|cache-control-esm|vuetify)',
    ],
};
