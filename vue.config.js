process.env.VUE_APP_VERSION = process.env.COMMIT_REF;

module.exports = {
    transpileDependencies: ['vuetify'],
    pwa: {
        workboxOptions: {
            skipWaiting: true,
        },
    },
};
