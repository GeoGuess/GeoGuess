
export default {
    install(app) {
        app.config.globalProperties.$countryNameLocale = (isoA2) => {
            return new Intl.DisplayNames([app.config.globalProperties.$i18n.global.locale.value], { type: 'region' }).of(isoA2);
        };
    },
};

