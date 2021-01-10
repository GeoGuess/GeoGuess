import axios from '@/plugins/axios';
import { validURL } from '@/utils';
import { isGeoJSONValid } from '../utils';
import * as MutationTypes from './mutation-types';

export default {
    state: () => ({
        geojson: null,
        listMaps: [],
        openDialogSinglePlayer: false,
        openDialogMultiPlayer: false,
    }),
    mutations: {
        [MutationTypes.HOME_SET_GEOJSON](state, geojson) {
            state.geojson = geojson;
        },
        [MutationTypes.HOME_SET_LISTMAPS](state, listMaps) {
            state.listMaps = listMaps;
        },
        [MutationTypes.HOME_SET_SINGLEPLAYER](state, status) {
            state.openDialogSinglePlayer = status;
        },
        [MutationTypes.HOME_SET_MULTIPLAYER](state, status) {
            state.openDialogMultiPlayer = status;
        },
    },

    getters: {
        geoJsonString(state) {
            if (!state.geojson) {
                return '';
            }
            return JSON.stringify(state.geojson, null, 2);
        },
        geoJson(state) {
            return state.geojson;
        },
        isValidGeoJson(state) {
            if (!state.geojson) {
                return null;
            }
            return isGeoJSONValid(state.geojson);
        },
        maps(state) {
            return state.listMaps;
        },
    },

    actions: {
        async loadGeoJsonFromUrl({ commit }, url) {
            if (validURL(url)) {
                // if gist url get raw
                if (RegExp('^(https?://)?gist.github.com/').test(url)) {
                    let urlSplit = url.split('/');
                    if (
                        urlSplit.length > 3 &&
                        urlSplit[urlSplit.length - 1] !== 'raw'
                    ) {
                        urlSplit[urlSplit.length - 3] =
                            'gist.githubusercontent.com';
                        urlSplit.push('raw');
                        url = urlSplit.join('/');
                    }
                }
                const geojson = await axios
                    .get(url)
                    .then((res) => {
                        if (res.status === 200 && res.data) {
                            if (typeof res.data === 'object') {
                                return res.data;
                            } else {
                                return JSON.parse(res.data);
                            }
                        }
                    })
                    .catch((err) => {
                        // eslint-disable-next-line no-console
                        console.log(err);
                    });

                commit(MutationTypes.HOME_SET_GEOJSON, geojson);
            }
        },
        setGeoJson({ commit }, geojson) {
            commit(MutationTypes.HOME_SET_GEOJSON, geojson);
        },
        setGeoJsonString({ commit }, geojson) {
            let obj = null;
            if (geojson !== '') {
                obj = JSON.parse(geojson);
            }
            commit(MutationTypes.HOME_SET_GEOJSON, obj);
        },
        async getListMaps({ commit }) {
            const maps = await axios
                .get(
                    process.env.VUE_APP_LIST_MAPS_JSON_URL ||
                        'https://raw.githubusercontent.com/GeoGuess/GeoGuess-Maps/main/maps.json',
                    {
                        cache: {
                            maxAge: 1000,
                        },
                    }
                )
                .then((res) => res.data.maps);

            commit(MutationTypes.HOME_SET_LISTMAPS, maps);
        },
        playSinglePlayer({ commit }) {
            commit(MutationTypes.HOME_SET_SINGLEPLAYER, true);
        },
        playMultiPlayer({ commit }) {
            commit(MutationTypes.HOME_SET_MULTIPLAYER, true);
        },
        resetSinglePlayer({ commit }) {
            commit(MutationTypes.HOME_SET_SINGLEPLAYER, false);
        },
        resetMultiPlayer({ commit }) {
            commit(MutationTypes.HOME_SET_MULTIPLAYER, false);
        },
    },
};
