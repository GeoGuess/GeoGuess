import Vue from 'vue';
import Vuex from 'vuex';
import homeStore from './homeStore';
import areaStore from './areaStore';
import settingsStore from './settingsStore';


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        homeStore,
        areaStore,
        settingsStore,
    },
});
