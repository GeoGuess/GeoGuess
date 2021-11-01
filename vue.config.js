module.exports = {
    transpileDependencies: ['vuetify'],
    pwa: {
        workboxOptions: {
            skipWaiting: true,
        },
    },
    publicPath: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PUBLIC_PATH
        ? process.env.VUE_APP_PUBLIC_PATH
        : '/'
};
