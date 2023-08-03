import axios from './plugins/axios';
import 'firebase/analytics';
import firebase from 'firebase/app';
import 'firebase/database';
import * as GmapVue from 'gmap-vue';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueClipboard from 'vue-clipboard2';
import App from './App.vue';
import i18n from './lang';
import CountryNamePlugin from './plugins/countryNamePlugin';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.use(VueAxios, axios);

Vue.use(CountryNamePlugin);
Vue.use(VueClipboard);

Vue.use(GmapVue, {
    load: {
        key: import.meta.env.VITE_APP_API_KEY,
        language: localStorage.getItem('language'),
    },
});
Vue.config.productionTip = false;

const updateSizes = (obj = {}) => {
    obj.width = window.innerWidth;
    obj.height = window.innerHeight;
    document.documentElement.style.setProperty(
        '--global-height',
        window.innerHeight + 'px'
    );
    return obj;
};

Object.defineProperty(Vue.prototype, '$viewport', {
    value: Vue.observable(updateSizes()),
});

window.addEventListener('resize', () => {
    updateSizes(Vue.prototype.$viewport);
});

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain:
        import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN ||
        import.meta.env.VITE_APP_FIREBASE_PROJECT_ID + '.firebaseapp.com',
    databaseURL:
        import.meta.env.VITE_APP_FIREBASE_DATABASE_URL ||
        'https://' +
            import.meta.env.VITE_APP_FIREBASE_PROJECT_ID +
            '.firebaseio.com',
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket:
        import.meta.env.VITE_APP_STORAGE_BUCKET ||
        import.meta.env.VITE_APP_FIREBASE_PROJECT_ID + '.appspot.com',
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
if (firebaseConfig.measurementId) firebase.analytics();

new Vue({
    vuetify: vuetify(i18n),
    router,
    i18n,
    store,
    axios,
    render: (h) => h(App),
}).$mount('#app');
