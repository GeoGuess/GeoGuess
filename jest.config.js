module.exports = {

  testEnvironment: 'jsdom',
    "moduleFileExtensions": ["js", "json", "vue"],
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
    snapshotSerializers: [
        'jest-serializer-vue'
      ],
    testMatch: [
        '**/tests/unit/**/*.spec.[jt]s?(x)',
        '**/__tests__/*.[jt]s?(x)'
      ],
    "transform": {
        "^.+\\.js$": "babel-jest",
        "^.+\\.vue$": "@vue/vue2-jest",

    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|avif)$':
    require.resolve('jest-transform-stub'),
    '^.+\\.jsx?$': require.resolve('babel-jest')
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
      },
};
