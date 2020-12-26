import { languages } from '../lang';
export default {
    install(Vue) {
        const countries = require('i18n-iso-countries');
        languages.forEach(({ value }) => {
            countries.registerLocale(
                require(`i18n-iso-countries/langs/${value}.json`)
            );
        });

        Vue.prototype.$countryNameLocale = (isoA2) => {
            return countries.getName(isoA2, localStorage.getItem('language'));
        };
    },
};
