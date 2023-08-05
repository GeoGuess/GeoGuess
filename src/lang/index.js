import Vue from 'vue';
import VueI18n from 'vue-i18n';
import bgLocale from './locale/bg.json';
import csLocale from './locale/cs.json';
import deLocale from './locale/de.json';
import enLocale from './locale/en.json';
import esLocale from './locale/es.json';
import frLocale from './locale/fr.json';
import heLocale from './locale/he.json';
import itLocale from './locale/it.json';
import jaLocale from './locale/ja.json';
import kaaLocale from './locale/kaa.json';
import plLocale from './locale/pl.json';
import ptLocale from './locale/pt.json';
import ruLocale from './locale/ru.json';
import svLocale from './locale/sv.json';
import trLocale from './locale/tr.json';
import zhLocale from './locale/zh.json';

Vue.use(VueI18n);

const translations = {
    bg: bgLocale,
    cs: csLocale,
    de: deLocale,
    en: enLocale,
    es: esLocale,
    fr: frLocale,
    he: heLocale,
    it: itLocale,
    ja: jaLocale,
    kaa: kaaLocale,
    pl: plLocale,
    pt: ptLocale,
    ru: ruLocale,
    sv: svLocale,
    tr: trLocale,
    zh: zhLocale
};

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
    localStorage.getItem('language') !== null
        ? localStorage.getItem('language')
        : languages.some(checkLanguage)
        ? navigator.language.split('-')[0]
        : 'en';

const i18n = new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: translations
});

Vue.prototype.i18n = i18n;

export default i18n;
