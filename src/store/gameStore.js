import axios from '@/plugins/axios';
import * as MutationTypes from './mutation-types';

export default {
    state: () => ({
        countries: null,
        loadingCountries: false,
    }),
    mutations: {
        [MutationTypes.GAME_SET_COUNTRIES](state, geojson) {
            state.countries = geojson;
        },
        [MutationTypes.GAME_SET_LOADING_COUNTRIES](state, status) {
            state.loadingCountries = status;
        },
    },

    getters: {
        countriesJson(state) {
            return state.countries;
        },
    },

    actions: {
        async loadCountries({ commit, state }) {
            if (
                state.countries &&
                Array.isArray(state.countries.features) &&
                state.loadingCountries
            ) {
                return;
            }

            commit(MutationTypes.GAME_SET_LOADING_COUNTRIES, true);
            const geojson = await axios
                .get(process.env.BASE_URL + 'resources/countries.geo.json')
                .then((res) => {
                    if (res.status === 200 && res.data) {
                        return res.data;
                    }
                })
                .finally(() => {
                    commit(MutationTypes.GAME_SET_LOADING_COUNTRIES, false);
                });

            commit(MutationTypes.GAME_SET_COUNTRIES, geojson);
        },
    },
};
