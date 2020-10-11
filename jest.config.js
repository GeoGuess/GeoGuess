module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!**/node_modules/**',
        '!src/plugins/*',
        '!src/lang/*',
        '!src/*.js',
    ],
};
