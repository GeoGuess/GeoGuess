import * as GmapVue from 'gmap-vue';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import VueI18n from 'vue-i18n';
import Router from 'vue-router';
import Vuetify from 'vuetify';
import en from 'vuetify/es5/locale/en';
import enLocale from '@/lang/locale/en.json';
import Vuex from 'vuex';
import countryNamePlugin from '../../../src/plugins/countryNamePlugin';

global.File = class MockFile {
    constructor(parts, filename, properties) {
        this.parts = parts;
        this.filename = filename;
        this.properties = properties;
    }
    text() {
        return new Promise((resolve) => {
            resolve(this.parts.toString());
        });
    }
};


export default function appInit(VueInstance, useRouter = true) {
    const updateSizes = (obj = {}) => {
        obj.width = window.innerWidth;
        obj.height = window.innerHeight;
        return obj;
    };

    Object.defineProperty(Vue.prototype, '$viewport', {
        value: Vue.observable(updateSizes()),
    });
    Vue.use(Vuetify);
    Vue.use(Vuex);
    Vue.use(VueClipboard);
    Vue.use(GmapVue, {
        load: {
            key: 'google-maps-api-key',
        },
        installComponents: true,
    });
    Vue.use(countryNamePlugin);

    if(useRouter)
        VueInstance.use(Router);

    VueInstance.use(VueI18n);
    VueInstance.use(Vuetify);
    VueInstance.config.productionTip = false;

    return {
        Vue,
        localVue: VueInstance,
        i18n:  new VueI18n({
            locale: 'en',
            fallbackLocale: 'en',
            messages: {en: enLocale},
        }),
        ...(useRouter && {router: new Router()}),
        vuetify: new Vuetify({
            lang: {
                locales: { en },
                current: 'en',
            },
        }),
    };
}
