jest.mock('@/plugins/axios', () => {
    const responseTls = {
        geometry: {
            coordinates: [1.4455249, 43.5271458],
            type: 'Point',
        },
        type: 'Feature',
        properties: {
            osm_id: 158980,
            osm_type: 'R',
            extent: [1.4202811, 43.546134, 1.4534675, 43.5126463],
            country: 'France',
            osm_key: 'place',
            osm_value: 'village',
            postcode: '31320',
            name: 'Vieille-Toulouse',
            state: 'Occitania',
        },
    };
    return {
        get: jest.fn((url) => {
            let data;

            switch (url) {
                case 'https://map.geojson':
                    data = responseTls;
                    break;
                case 'https://listmaps.gejson':
                    data = { maps: [] };
                    break;
            }

            return Promise.resolve({
                status: 200,
                data,
            });
        }),
    };
});

import axios from '@/plugins/axios';
import * as MutationTypes from '../../../src/store/mutation-types';
const { default: homeStore } = require('../../../src/store/homeStore');

describe('homeStore.js', () => {
    //
    // MUTATIONS
    //
    it('mutations', () => {
        const state = homeStore.state();
        expect(state.geojson).toBeNull();
        const geojson = {
            type: 'Point',
        };
        homeStore.mutations[MutationTypes.HOME_SET_GEOJSON](state, geojson);

        expect(state.geojson).toEqual(geojson);

        expect(state.listMaps).toHaveLength(0);
        homeStore.mutations[MutationTypes.HOME_SET_LISTMAPS](state, [
            { name: 'Hello' },
        ]);
        expect(state.listMaps).toHaveLength(1);

        expect(state.openDialogSinglePlayer).toEqual(false);
        homeStore.mutations[MutationTypes.HOME_SET_SINGLEPLAYER](state, true);

        expect(state.openDialogSinglePlayer).toEqual(true);

        expect(state.openDialogMultiPlayer).toEqual(false);
        homeStore.mutations[MutationTypes.HOME_SET_MULTIPLAYER](state, true);
        expect(state.openDialogMultiPlayer).toEqual(true);

        expect(state).toMatchSnapshot();
    });

    //
    // GETTERS
    //
    it('isValidGeoJson expect FeatureCollection', () => {
        const state = {
            geojson: {
                geometry: {
                    coordinates: [1.4442469, 43.6044622],
                    type: 'Point',
                },
                type: 'Feature',
            },
        };
        expect(homeStore.getters.isValidGeoJson(state)).toEqual(false);
    });
    it('isValidGeoJson expect features', () => {
        const state = {
            geojson: {
                type: 'FeatureCollection',
            },
        };
        expect(homeStore.getters.isValidGeoJson(state)).toEqual(false);
    });
    it('isValidGeoJson expect not Circle', () => {
        const state = {
            geojson: {
                type: 'FeatureCollection',
                features: [
                    {
                        geometry: {
                            coordinates: [1.4442469, 43.6044622],
                            type: 'Circle',
                        },
                        type: 'Feature',
                    },
                ],
            },
        };
        expect(homeStore.getters.isValidGeoJson(state)).toEqual(false);
    });
    it('isValidGeoJson true', () => {
        const state = {
            geojson: {
                type: 'FeatureCollection',
                features: [
                    {
                        geometry: {
                            coordinates: [1.4442469, 43.6044622],
                            type: 'Point',
                        },
                        type: 'Feature',
                    },
                ],
            },
        };
        expect(homeStore.getters.isValidGeoJson(state)).toEqual(true);
        const obj = homeStore.getters.geoJson(state);
        expect(obj.type).toEqual('FeatureCollection');
        expect(obj.features).toHaveLength(1);
        expect(obj).toMatchSnapshot();
        const objString = homeStore.getters.geoJsonString(state);
        expect(objString).toContain('FeatureCollection');
        expect(objString).toMatchSnapshot();

        expect(homeStore.getters.geoJsonString({})).toEqual('');
    });

    //
    // ACTIONS
    //

    it('loadGeoJsonFromUrl', async () => {
        const commit = jest.fn();
        await homeStore.actions.loadGeoJsonFromUrl(
            { commit },
            'https://map.geojson'
        );
        expect(axios.get).toBeCalledWith('https://map.geojson');

        await homeStore.actions.loadGeoJsonFromUrl(
            { commit },
            'https://gist.github.com/BilelJegham/7f855024440c67d65f24536c9215719e'
        );

        expect(axios.get).toBeCalledWith(
            'https://gist.githubusercontent.com/BilelJegham/7f855024440c67d65f24536c9215719e/raw'
        );

        expect(commit).toBeCalledWith(
            MutationTypes.HOME_SET_GEOJSON,
            expect.anything()
        );
    });

    it('setGeoJsonString', () => {
        const commit = jest.fn();
        homeStore.actions.setGeoJsonString({ commit }, '');
        expect(commit).toBeCalledWith(MutationTypes.HOME_SET_GEOJSON, null);

        const obj = '{"type": "Feature"}';
        homeStore.actions.setGeoJsonString({ commit }, obj);

        expect(commit).toBeCalledWith(
            MutationTypes.HOME_SET_GEOJSON,
            JSON.parse(obj)
        );
    });

    it('setGeoJson', () => {
        const commit = jest.fn();
        const obj = { type: 'Feature' };
        homeStore.actions.setGeoJson({ commit }, obj);

        expect(commit).toBeCalledWith(MutationTypes.HOME_SET_GEOJSON, obj);
    });

    it('getListMaps', async () => {
        const commit = jest.fn();

        process.env.VUE_APP_LIST_MAPS_JSON_URL = 'https://listmaps.gejson';

        await homeStore.actions.getListMaps({ commit });
        expect(axios.get).toBeCalledWith(
            'https://listmaps.gejson',
            expect.any(Object)
        );

        expect(commit).toBeCalledWith(
            MutationTypes.HOME_SET_LISTMAPS,
            expect.any(Array)
        );
    });

    it('playSinglePlayer', () => {
        const commit = jest.fn();
        homeStore.actions.playSinglePlayer({ commit });

        expect(commit).toBeCalledWith(
            MutationTypes.HOME_SET_SINGLEPLAYER,
            true
        );
    });
    it('playMultiPlayer', () => {
        const commit = jest.fn();
        homeStore.actions.playMultiPlayer({ commit });

        expect(commit).toBeCalledWith(MutationTypes.HOME_SET_MULTIPLAYER, true);
    });
    it('resetSinglePlayer', () => {
        const commit = jest.fn();
        homeStore.actions.resetSinglePlayer({ commit });

        expect(commit).toBeCalledWith(
            MutationTypes.HOME_SET_SINGLEPLAYER,
            false
        );
    });
    it('resetMultiPlayer', () => {
        const commit = jest.fn();
        homeStore.actions.resetMultiPlayer({ commit });

        expect(commit).toBeCalledWith(
            MutationTypes.HOME_SET_MULTIPLAYER,
            false
        );
    });
});
