module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        'src/utils/*',
        '!**/node_modules/**',
        '!src/plugins/*',
        '!src/lang/*',
        '!src/router.js',
        '!src/main.js',
        '!src/registerServiceWorker.js',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!gmap-vue|axios-cache-adapter|cache-control-esm)',
    ],
};
