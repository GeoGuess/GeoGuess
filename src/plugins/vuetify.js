import Vue from 'vue';
import cs from 'vuetify/es5/locale/cs';
import de from 'vuetify/es5/locale/de';
import en from 'vuetify/es5/locale/en';
import fr from 'vuetify/es5/locale/fr';
import ja from 'vuetify/es5/locale/ja';
import ru from 'vuetify/es5/locale/ru';
import Vuetify from 'vuetify/lib';
import { checkLanguage, languages } from '../lang';
import '../scss/variables.scss';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#468F69',
                secondary: '#808F87',
                accent: '#D0CABC',
                beige: '#ded3af',
                darkGreen: '#4F665A',
            },
        },
    },
    lang: {
        locales: { en, fr, ja, cs, de, ru },
        current:
            localStorage.getItem('language') != null
                ? localStorage.getItem('language')
                : languages.map((l) => l.value).some(checkLanguage)
                ? navigator.language.split('-')[0]
                : 'en',
    },
    options: {
        customProperties: true,
    },
    icons: {
        iconfont: 'mdi',
    },
});
