import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './TranslationsEN'
import ja from './TranslationsJA'
import fr from './TranslationsFR'

Vue.use(VueI18n)

const translations = Object.assign(en, ja, fr)

const languages = ['en', 'ja', 'fr']

export function checkLanguage(language) {
  return navigator.language.split('-')[0] == language
}

export default new VueI18n({
  locale: localStorage.getItem('language') != null 
    ? localStorage.getItem('language') 
    : (languages.some(checkLanguage) 
      ? navigator.language.split('-')[0] 
      : 'en'),
  fallbackLocale: 'en',
  messages: translations,
})
