import { createI18n } from 'vue-i18n';

// Load all modules.
function loadTranslations() {
    if (import.meta.env.MODE === 'test')
        return {};
    
    const modules = import.meta.glob('./locale/*.json', { eager: true });
    
    return Object.keys(modules).reduce((acc, path) => {
        const name = path.match(/\/([a-z_]+)\.json$/i)[1];
        acc[name] = modules[path].default;
        return acc;
    }, {});
}

export const translations = loadTranslations();

export const RTL_LANGUAGES = ['ar', 'he'];

export const languages = Object.keys(translations).map((translation) => ({
    text: (new Intl.DisplayNames([translation], { type: 'language' })).of(translation),
    value: translation,
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

const locale = localStorage.getItem('language') != null
            ? localStorage.getItem('language')
            : languages.some(checkLanguage)
            ? navigator.language.split('-')[0]
            : 'en';


const i18n = createI18n({
    legacy: false,
    locale: locale,
    fallbackLocale: 'en',
    messages: translations,
});

export default i18n;
