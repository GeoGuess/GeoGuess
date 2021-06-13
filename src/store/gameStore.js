import axios from '@/plugins/axios';
import * as MutationTypes from './mutation-types';

export default {
    state: () => ({
        areas: null,
        loadingAreas: false,
    }),
    mutations: {
        [MutationTypes.GAME_SET_AREAS](state, geojson) {
            state.areas = geojson;
        },
        [MutationTypes.GAME_SET_LOADING_AREAS](state, status) {
            state.loadingAreas = status;
        },
    },

    getters: {
        areasJson(state) {
            return state.areas;
        },
    },

    actions: {
        async loadAreas({ commit, state }, urlAreas) {
            if (
                state.areas &&
                Array.isArray(state.countries.features) &&
                state.loadingAreas
            ) {
                return;
            }

            commit(MutationTypes.GAME_SET_LOADING_AREAS, true);
            const geojson = await axios
                .get(urlAreas)
                .then((res) => {
                    if (res.status === 200 && res.data) {
                        return res.data;
                    }
                })
                .finally(() => {
                    commit(MutationTypes.GAME_SET_LOADING_AREAS, false);
                });

            commit(MutationTypes.GAME_SET_AREAS, geojson);
        },
    },
};
