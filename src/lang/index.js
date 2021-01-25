import Vue from 'vue';
import VueI18n from 'vue-i18n';
import cs from './locale/cs';
import de from './locale/de';
import en from './locale/en';
import fr from './locale/fr';
import ja from './locale/ja';
import ru from './locale/ru';
import pt from './locale/pt';

Vue.use(VueI18n);

const translations = { en, ja, fr, cs, de, ru, pt };

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
        text: 'čeština',
        value: 'cs',
    },
    {
        text: 'русский',
        value: 'ru',
    },
    {
        text: 'Português (Brasil)',
        value: 'pt',
    },
    {
        text: 'Deutsch',
        value: 'de',
    },
    {
        text: '日本語',
        value: 'ja',
    },
];

export function checkLanguage(language) {
    return navigator.language.split('-')[0] == language;
}

if (!localStorage.getItem('language')) {
    localStorage.setItem(
        'language',
        languages.some(checkLanguage) ? navigator.language.split('-')[0] : 'en'
    );
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
