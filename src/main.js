import { createApp, reactive } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import axios from '@/plugins/axios';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import App from './App.vue';
import i18n from './lang';
import CountryNamePlugin from './plugins/countryNamePlugin';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';
import router from './router';
import store from './store';

const updateSizes = (obj = {}) => {
    obj.width = window.innerWidth;
    obj.height = window.innerHeight;
    document.documentElement.style.setProperty(
        '--global-height',
        window.innerHeight + 'px'
    );
    return obj;
};

const viewport = reactive(updateSizes());

window.addEventListener('resize', () => {
    updateSizes(viewport);
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
const firebaseApp = initializeApp(firebaseConfig);
if (firebaseConfig.measurementId) {
    getAnalytics(firebaseApp);
}
getDatabase(firebaseApp);

// Load Google Maps
const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_API_KEY,
    version: '3.55',
    language: localStorage.getItem('language'),
});

loader.load().catch(err => {
    console.error('Failed to load Google Maps:', err);
});

const app = createApp(App);

app.config.globalProperties.$viewport = viewport;
app.config.globalProperties.$axios = axios;

app.use(i18n);
app.use(router);
app.use(store);
app.use(vuetify(i18n));
app.use(CountryNamePlugin);

app.mount('#app');
