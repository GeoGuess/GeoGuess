import Vue from 'vue';
import Vuex from 'vuex';
import homeStore from './homeStore';
import gameStore from './gameStore';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        homeStore,
        gameStore,
    },
});
