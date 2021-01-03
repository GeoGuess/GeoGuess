jest.mock('@/plugins/axios', () => {
    const responseTls = {
        features: [
            {
                geometry: {
                    coordinates: [1.4442469, 43.6044622],
                    type: 'Point',
                },
                type: 'Feature',
                properties: {
                    osm_id: 35738,
                    osm_type: 'R',
                    extent: [1.3503956, 43.668708, 1.5153795, 43.532654],
                    country: 'France',
                    osm_key: 'place',
                    osm_value: 'city',
                    name: 'Toulouse',
                    state: 'Occitania',
                },
            },
            {
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
            },
            {
                geometry: {
                    coordinates: [5.587384, 46.8232142],
                    type: 'Point',
                },
                type: 'Feature',
                properties: {
                    osm_id: 156434,
                    osm_type: 'Z',
                    extent: [5.5693913, 46.8364042, 5.5996211, 46.8079512],
                    country: 'France',
                    osm_key: 'place',
                    osm_value: 'village',
                    postcode: '39230',
                    name: 'Toulouse-le-Château',
                    state: 'Bourgogne-Franche-Comté',
                },
            },
        ],
    };

    return {
        get: jest.fn(() =>
            Promise.resolve({
                status: 200,
                data: responseTls,
            })
        ),
    };
});

import SearchBox from '@/components/home/SearchBox.vue';
import axios from '@/plugins/axios';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';
import homeStore from '../../../../src/store/homeStore';
import appInit from '../../utils/appInit';

const args = appInit(createLocalVue());
describe('SearchBox.vue', () => {
    let store;
    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                homeStore: {
                    state: homeStore.state,
                    getters: homeStore.getters,
                },
            },
        });
    });
    it('test search Input', () => {
        Vue.use(VueAxios, axios);
        const wrapper = shallowMount(SearchBox, { ...args, store, axios });
        wrapper.setData({ search: 'Toulouse' });

        expect(wrapper.exists('#search-input'));
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.search).toEqual('Toulouse');
            expect(axios.get).toBeCalledWith(
                'https://photon.komoot.io/api/?q=Toulouse'
            );
            wrapper.vm.$nextTick(() => {
                expect(wrapper.vm.entries).toHaveLength(2);
                expect(wrapper.vm.items).toHaveLength(2);
                expect(wrapper.vm.items[0]).toEqual('Toulouse');
            });
        });

        expect(wrapper).toMatchSnapshot();
    });
});
