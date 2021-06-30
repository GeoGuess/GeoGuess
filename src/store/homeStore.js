import axios from '@/plugins/axios';
import { validURL } from '@/utils';
import { getLocateString, isGeoJSONValid } from '../utils';
import * as MutationTypes from './mutation-types';
import i18n from '../lang';

export default {
    state: () => ({
        geojson: null,
        loadingGeoJson: false,
        errorMessage: null,
        listMaps: [],
        listAreas: [],
        history: [],
        streamerMode: !!localStorage.getItem('streamerMode'),
    }),
    mutations: {
        [MutationTypes.HOME_SET_GEOJSON](state, geojson) {
            state.geojson = geojson;
        },
        [MutationTypes.HOME_SET_LISTS](state, lists) {
            state.listMaps = lists.maps;
            state.listAreas = lists.areas;
        },
        [MutationTypes.HOME_SET_HISTORY](state, history) {
            state.history = history;
        },
        [MutationTypes.HOME_SET_STREAMER_MODE](state, streamerMode) {
            state.streamerMode = streamerMode;
            localStorage.setItem('streamerMode', streamerMode);
        },

        [MutationTypes.HOME_SET_STATUS_GEOJSON](state, status) {
            state.loadingGeoJson = status;
        },
        [MutationTypes.HOME_SET_GEOJSON_ERROR](state, error) {
            state.errorMessage = error;
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
            return state.listMaps.map((map) => ({
                ...map,
                nameLocate: getLocateString(map, 'name', i18n.locale),
                descriptionLocate: getLocateString(
                    map,
                    'description',
                    i18n.locale
                ),
            }));
        },
        areasList(state) {
            return state.listAreas.map((map) => ({
                ...map,
                nameLocate: getLocateString(map, 'name', i18n.locale),
                descriptionLocate: getLocateString(
                    map,
                    'description',
                    i18n.locale
                ),
            }));
        },
        nbPlaceVisits(state) {
            return state.history.reduce(
                (a, { rounds }) => a + rounds.length,
                0
            );
        },
    },

    actions: {
        loadPlaceGeoJSON({ commit, state }, place) {
            if (place != null && place != '') {
                if (state.loadingGeoJson) {
                    return;
                }
                commit(MutationTypes.HOME_SET_STATUS_GEOJSON, true);

                commit(MutationTypes.HOME_SET_GEOJSON, null);

                axios
                    .get(
                        `https://nominatim.openstreetmap.org/search/${encodeURIComponent(
                            place.toLowerCase()
                        )}?format=geojson&limit=1&polygon_geojson=1`
                    )
                    .then((res) => {
                        if (
                            res &&
                            res.status === 200 &&
                            res.data.features.length > 0
                        ) {
                            commit(
                                MutationTypes.HOME_SET_GEOJSON,
                                res.data.features[0]
                            );
                            return;
                        }
                        commit(
                            MutationTypes.HOME_SET_GEOJSON_ERROR,
                            'No Found Location'
                        );
                    })
                    .finally(() => {
                        commit(MutationTypes.HOME_SET_STATUS_GEOJSON, false);
                    });
            }
        },
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
            const data = await axios
                .get(
                    process.env.VUE_APP_LIST_MAPS_JSON_URL ||
                        'https://raw.githubusercontent.com/GeoGuess/GeoGuess-Maps/main/maps.json',
                    {
                        cache: {
                            maxAge: 1000,
                        },
                    }
                )
                .then((res) => res.data);

            commit(MutationTypes.HOME_SET_LISTS, data);
        },
        loadHistory({ commit }) {
            const history = localStorage.getItem('history')
                ? JSON.parse(localStorage.getItem('history'))
                : [];
            commit(MutationTypes.HOME_SET_HISTORY, history);
        },
    },
};
