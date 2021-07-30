import countries from 'i18n-iso-countries';
countries.registerLocale(require(`i18n-iso-countries/langs/en.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/fr.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/cs.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/ru.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/pt.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/de.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/sv.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/tr.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/ja.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/he.json`));
countries.registerLocale(require(`i18n-iso-countries/langs/it.json`));

export default {
    install(Vue) {
        Vue.prototype.$countryNameLocale = (isoA2) => {
            return countries.getName(isoA2, localStorage.getItem('language'));
        };
    },
};
