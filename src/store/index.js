import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// Load all modules.
function loadTranslations() {
    if (import.meta.env.MODE === 'test') return {};

    const modules = import.meta.glob('./locale/*.json');

    return Object.keys(modules).reduce((translations, key) => {
        const name = key.match(/\/([a-z_]+)\.json$/i)[1];
        translations[name] = modules[key];
        return translations;
    }, {});
}

export const translations = loadTranslations();

export const RTL_LANGUAGES = ['he'];

export const languages = Object.keys(translations).map((translation) => ({
    text: new Intl.DisplayNames([translation], { type: 'language' }).of(
        translation
    ),
    value: translation
}));

export function checkLanguage(language) {
    return navigator.language.split('-')[0] === language.value;
}

if (!localStorage.getItem('language')) {
    localStorage.setItem(
        'language',
        languages.some(checkLanguage) ? navigator.language.split('-')[0] : 'en'
    );
}

const locale =
    localStorage.getItem('language') != null
        ? localStorage.getItem('language')
        : languages.some(checkLanguage)
        ? navigator.language.split('-')[0]
        : 'en';

const store = new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: translations
});

Vue.prototype.store = store;

export default store;
