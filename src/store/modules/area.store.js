import axios from '@/plugins/axios';
import * as MutationTypes from '../mutation-types';

export default {
    state: () => ({
        urlAreas: null,
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
        [MutationTypes.GAME_SET_URL_AREAS](state, urlAreas) {
            state.urlAreas = urlAreas;
            state.areas = null;
        },
    },

    getters: {
        areasJson(state) {
            return state.areas;
        },
    },

    actions: {
        async loadAreas({ commit, state }, url) {
            const urlAreas =
                url || process.env.BASE_URL + 'resources/countries.geo.json';
            if (
                state.urlAreas === urlAreas &&
                state.areas &&
                Array.isArray(state.areas.features) &&
                state.loadingAreas
            ) {
                return;
            }

            commit(MutationTypes.GAME_SET_LOADING_AREAS, true);
            commit(MutationTypes.GAME_SET_URL_AREAS, urlAreas);
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
