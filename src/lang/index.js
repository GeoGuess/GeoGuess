import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './TranslationsEN';
import ja from './TranslationsJA';
import fr from './TranslationsFR';
import cs from './TranslationsCS';
import de from './TranslationsDE';
import ru from './TranslationsRU';

Vue.use(VueI18n);

const translations = Object.assign(en, ja, fr, cs, de, ru);

export const languages = [
    {
        text: 'English',
        value: 'en',
    },
    {
        text: 'Français',
        value: 'fr',
    },
    {
        text: 'Deutsch',
        value: 'de',
    },
    {
        text: 'čeština',
        value: 'cs',
    },
    {
        text: 'русский',
        value: 'ru',
    },
    {
        text: '日本語',
        value: 'ja',
    },
];

export function checkLanguage(language) {
    return navigator.language.split('-')[0] == language;
}

export default new VueI18n({
    locale:
        localStorage.getItem('language') != null
            ? localStorage.getItem('language')
            : languages.some(checkLanguage)
            ? navigator.language.split('-')[0]
            : 'en',
    fallbackLocale: 'en',
    messages: translations,
});
