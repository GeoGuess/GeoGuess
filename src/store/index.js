import Vue from 'vue';
import Vuex from 'vuex';
import alertModule from './modules/alert.store';
import areaModule from './modules/area.store';
import homeModule from './modules/home.store';
import settingsModule from './modules/settings.store';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        alertStore: alertModule,
        area: areaModule,
        homeStore: homeModule,
        settingsStore: settingsModule,
    },
});

export default store;
