import VueI18n from 'vue-i18n';
import Vuetify from 'vuetify';
import i18n from '@/lang';
import Vue from 'vue';
import Router from 'vue-router';

import en from 'vuetify/es5/locale/en';
import VueRouter from 'vue-router';

export default function appInit(VueInstance) {
    Vue.use(VueI18n);
    Vue.use(Vuetify);

    VueInstance.use(VueRouter);
    VueInstance.use(Vuetify);
    VueInstance.config.productionTip = false;

    return {
        Vue,
        i18n,
        router: new Router(),
        vuetify: new Vuetify({
            lang: {
                locales: { en },
                current: 'en',
            },
        }),
    };
}
