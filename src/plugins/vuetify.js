import Vue from 'vue';
import cs from 'vuetify/es5/locale/cs';
import de from 'vuetify/es5/locale/de';
import en from 'vuetify/es5/locale/en';
import fr from 'vuetify/es5/locale/fr';
import he from 'vuetify/es5/locale/he';
import ja from 'vuetify/es5/locale/ja';
import pt from 'vuetify/es5/locale/pt';
import ru from 'vuetify/es5/locale/ru';
import sv from 'vuetify/es5/locale/sv';
import tr from 'vuetify/es5/locale/tr';
import it from 'vuetify/es5/locale/it';
import Vuetify from 'vuetify/lib';
import { checkLanguage, languages, RTL_LANGUAGES } from '../lang';
import '../scss/variables.scss';

Vue.use(Vuetify);
const currentLanguage =
    localStorage.getItem('language') != null
        ? localStorage.getItem('language')
        : languages.map((l) => l.value).some(checkLanguage)
        ? navigator.language.split('-')[0]
        : 'en';

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#468F69',
                secondary: '#808F87',
                accent: '#D0CABC',
                beige: '#ded3af',
                darkGreen: '#4F665A',
                streamerMode: '#9146ff',
            },
        },
    },
    rtl: RTL_LANGUAGES.includes(currentLanguage),
    lang: {
        locales: { en, fr, ja, cs, de, ru, pt, sv, tr, he, it },
        current: currentLanguage,
    },
    options: {
        customProperties: true,
    },
    icons: {
        iconfont: 'mdi',
    },
});
