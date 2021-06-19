import axios from '@/plugins/axios';
import { validURL } from '@/utils';
import { getLocateString, isGeoJSONValid } from '../utils';
import * as MutationTypes from './mutation-types';
import i18n from '../lang';

export default {
    state: () => ({
        geojson: null,
        listMaps: [],
        openDialogSinglePlayer: false,
        openDialogMultiPlayer: false,
        history: [],
        streamerMode: !!localStorage.getItem('streamerMode'),
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
        [MutationTypes.HOME_SET_HISTORY](state, history) {
            state.history = history;
        },
        [MutationTypes.HOME_SET_STREAMER_MODE](state, streamerMode) {
            state.streamerMode = streamerMode;
            localStorage.setItem('streamerMode', streamerMode);
        },
    },

    getters: {
        modes() {
            return [
                {
                    name: 'France Régions',

                    data: {
                        bbox: [-5.4517733, 41.2611155, 9.8282225, 51.3055721],
                        urlArea:
                            'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson',
                        type: 'nominatim',
                        pathKey: 'nom',
                        nominatimResultPath: 'address.state',
                        nominatimQueryParams: {
                            zoom: '5',
                            addressdetails: '1',
                            'accept-language': 'fr',
                        },
                    },
                },
                {
                    name: 'France Départements',

                    data: {
                        bbox: [-5.4517733, 41.2611155, 9.8282225, 51.3055721],
                        urlArea:
                            'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson',
                        type: 'nominatim',
                        pathKey: 'nom',
                        nominatimResultPath: 'address.county',
                        nominatimQueryParams: {
                            zoom: '8',
                            addressdetails: '1',
                            'accept-language': 'fr',
                        },
                    },
                },
                {
                    name: 'US States',
                    data: {
                        bbox: [
                            -171.79111060289117,
                            18.916190000000142,
                            -66.96466,
                            71.35776357694175,
                        ],
                        urlArea:
                            'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/cultural/ne_110m_admin_1_states_provinces.json',
                        type: 'nominatim',
                        pathKey: 'name',
                        nominatimResultPath: 'address.state',
                        nominatimQueryParams: {
                            zoom: '5',
                            addressdetails: '1',
                            'accept-language': 'en',
                        },
                    },
                },
                {
                    name: 'Continent',
                    data: {
                        urlArea:
                            'https://gist.githubusercontent.com/hrbrmstr/91ea5cc9474286c72838/raw/59421ff9b268ff0929b051ddafafbeb94a4c1910/continents.json',
                        type: 'polygon',
                        pathKey: 'CONTINENT',
                    },
                },
            ].map((map) => ({
                ...map,
                nameLocate: getLocateString(map, 'name', i18n.locale),
                descriptionLocate: getLocateString(
                    map,
                    'description',
                    i18n.locale
                ),
            }));
        },
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
        nbPlaceVisits(state) {
            return state.history.reduce(
                (a, { rounds }) => a + rounds.length,
                0
            );
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
        loadHistory({ commit }) {
            const history = localStorage.getItem('history')
                ? JSON.parse(localStorage.getItem('history'))
                : [];
            commit(MutationTypes.HOME_SET_HISTORY, history);
        },
    },
};
