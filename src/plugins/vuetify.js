import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import fr from 'vuetify/es5/locale/fr'
import en from 'vuetify/es5/locale/en'
import ja from 'vuetify/es5/locale/ja'
Vue.use(Vuetify);

export default new Vuetify({  
  lang: {
    locales: { en, fr, ja },
    current: localStorage.getItem('language') != null 
    ? localStorage.getItem('language') 
    : (languages.some(checkLanguage) 
      ? navigator.language.split('-')[0] 
      : 'en')
  },
  icons: {
    iconfont: 'mdi',
  },
});
