
export default {
    install(Vue) {
        Vue.prototype.$countryNameLocale = (isoA2) => {
            return new Intl.DisplayNames([Vue.prototype.i18n.locale], { type: 'region' }).of(isoA2);
        };
    },
};

