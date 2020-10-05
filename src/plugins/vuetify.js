import Vue from 'vue';

import '../scss/variables.scss';
import Vuetify from 'vuetify/lib';

import fr from 'vuetify/es5/locale/fr';
import en from 'vuetify/es5/locale/en';
import ja from 'vuetify/es5/locale/ja';
import cs from 'vuetify/es5/locale/cs';
import de from 'vuetify/es5/locale/de';
import es from 'vuetify/es5/locale/es';

import { checkLanguage } from '../lang';
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#468F69',
                secondary: '#808F87',
                accent: '#D0CABC',
            },
        },
    },
    lang: {
        locales: { en, fr, ja, cs, de, es },
        current:
            localStorage.getItem('language') != null
                ? localStorage.getItem('language')
                : ['en', 'ja', 'fr', 'cs', 'de', 'es'].some(checkLanguage)
                ? navigator.language.split('-')[0]
                : 'en',
    },
    icons: {
        iconfont: 'mdi',
    },
});
