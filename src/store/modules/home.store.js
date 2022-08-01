import axios from '@/plugins/axios';
import { getGeoJsonFromUrl, getLocateString, isGeoJSONValid } from '@/utils';
import i18n from '../../lang';
import { GeoMap, GeoMapCustom, GeoMapOSM, GeoMapType } from '../../models/GeoMap';
import IndexedDBService from '../../plugins/IndexedDBService';
import * as MutationTypes from '../mutation-types';

export default {
    state: () => ({
        map: new GeoMapCustom(),
        loadingGeoJson: false,
        errorMessage: null,
        listMaps: [],
        listAreas: [],
        customsMaps: [],
        history: [],
        streamerMode: localStorage.getItem('streamerMode') === 'true',
    }),
    mutations: {
        [MutationTypes.HOME_SET_GEOJSON](state, geojson) {
            const map = new GeoMapCustom();
            map.name = state.map.name;
            map.geojson = geojson;
            state.map = map;
        },
        [MutationTypes.HOME_SET_NAME_GEOJSON](state, name) {
            state.map.name = name;
        },
        [MutationTypes.HOME_SET_MAP](state, map) {
            state.map = map;
        },
        [MutationTypes.HOME_SET_LISTS](state, lists) {
            state.listMaps = lists.maps;
            state.listAreas = lists.areas;
        },
        [MutationTypes.HOME_SET_LISTS_CUSTOMMAPS](state, customsMaps) {
            state.customsMaps = customsMaps;
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
           if (!state.map || !state.map.geojson) {
                return '';
            }
            return JSON.stringify(state.map.geojson, null, 2);
        },
        geoJson(state) {
            return state.map.geojson;
        },
        isValidGeoJson(state) {
           if (!state.map || !state.map.geojson) {
                return null;
            }
            return isGeoJSONValid(state.map.geojson);
        },
        maps(state) {
            return state.customsMaps
                .map((map) => Object.assign(new GeoMapCustom(), map))
                .concat(
                    state.listMaps.map((map) =>
                        Object.assign(new GeoMap(),map)
                    )
                );
        },
        areasList(state) {
            return state.listAreas.map((map) => ({
                ...map,
                imageSrc: map.imageUrl ||
                        `https://source.unsplash.com/500x230/weekly?${encodeURI(getLocateString(map, 'name', 'en'))}`,
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

        getMaxScoreMap: (state) => (map) =>{
            return state.history.reduce((acc, {points, mapDetails})=>{
                if(mapDetails && mapDetails.id && mapDetails.id === map.id && mapDetails.type === map.type && acc < points){
                    return points;
                }
                return acc;
            }, 0);
        },

        getMaxScoreOsm: (state) => ({osmId, osmType}) =>{
            return state.history.reduce((acc, {points, mapDetails, nbRound})=>{
                if(!nbRound || nbRound === 5 && mapDetails && mapDetails.type === GeoMapType.OSM && mapDetails.osmId === osmId && mapDetails.osmType === osmType && acc < points){
                    return points;
                }
                return acc;
            }, 0);
        }
    },

    actions: {
        setStreamerMode({ dispatch, commit }, value) {
            commit(MutationTypes.HOME_SET_STREAMER_MODE, value);
            dispatch(
                'alertStore/setAlert',
                value && {
                    title: 'Home.streamerModeActivate',
                    subtitle: 'Home.streamerModeDetails',
                    color: 'streamerMode',
                    icon: 'mdi-twitch',
                },
                { root: true }
            );
        },
        async loadPlaceGeoJSON({ commit, state }, payload) {
            let place, osmId;
            if(typeof payload === 'string'){
                place = payload;
            }else{
                place = payload.place;
                osmId = payload.osmId;
            }

            if ((place != null && place != '') || osmId) {
                if (state.loadingGeoJson) {
                    return;
                }
                commit(MutationTypes.HOME_SET_STATUS_GEOJSON, true);

                commit(MutationTypes.HOME_SET_GEOJSON, null);
                const url =
                    osmId ?
                        `https://nominatim.openstreetmap.org/lookup?osm_ids=R${osmId}&format=geojson&polygon_geojson=1&accept-language=en`
                    : `https://nominatim.openstreetmap.org/search/${encodeURIComponent(place.toLowerCase())}?format=geojson&limit=1&polygon_geojson=1`;
                    // TODO : add &accept-language=en 
                return axios
                    .get(url)
                    .then((res) => {
                        if (
                            res &&
                            res.status === 200 &&
                            res.data.features.length > 0
                        ) {
                            let feature = res.data.features[0];
                            const map = new GeoMapOSM(
                                feature.properties.display_name, 
                                feature.properties.osm_id,
                                feature.properties.osm_type,
                                feature
                            );
                            commit(MutationTypes.HOME_SET_MAP, map);

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
        async loadMap({ commit }, map) {
            const geojson = await getGeoJsonFromUrl(map.url);
            if (geojson) {
                map.geojson = geojson;
                commit(MutationTypes.HOME_SET_MAP, map);
            }
        },
        async loadGeoJsonFromUrl({ commit }, url) {
            const geojson = await getGeoJsonFromUrl(url);
            if (geojson) {
                commit(MutationTypes.HOME_SET_GEOJSON, geojson);
            }
        },
        setMapLoaded({ commit }, map) {
            commit(MutationTypes.HOME_SET_MAP, map);
        },
        setGeoJson({ commit }, geojson) {
            commit(MutationTypes.HOME_SET_GEOJSON, geojson);
        },
        async saveGeoJson({ state, dispatch }) {
            await state.map.save();
            dispatch('getListMapsCustoms');
            dispatch(
                'alertStore/setAlert',
                {
                    title: 'Home.mapSavedAlert.title',
                    subtitle: 'Home.mapSavedAlert.subtitle',
                },
                { root: true }
            );
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
                        'https://maps.geoguess.games/maps.json',
                    {
                        cache: {
                            maxAge: 1000,
                        },
                    }
                )
                .then((res) => res.data);

            commit(MutationTypes.HOME_SET_LISTS, data);
        },
        async getListMapsCustoms({ commit }) {
            const customsMap = await Promise.resolve(
                IndexedDBService.loadDb().then(async () => {
                    return IndexedDBService.getAllMaps();
                })
            );
            commit(MutationTypes.HOME_SET_LISTS_CUSTOMMAPS, customsMap);
        },
        loadHistory({ commit }) {
            const history = localStorage.getItem('history')
                ? JSON.parse(localStorage.getItem('history'))
                : [];
            commit(MutationTypes.HOME_SET_HISTORY, history);
        },
    },
};
