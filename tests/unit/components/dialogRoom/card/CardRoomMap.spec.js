import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('@/plugins/axios', () => {
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
        default: {
            get: vi.fn(() =>
                Promise.resolve({
                    status: 200,
                    data: responseTls,
                })
            ),
            post: vi.fn(),
        },
    };
});
import CardRoomMap from '@/components/dialogroom/card/CardRoomMap.vue';
import axios from '@/plugins/axios';
import homeStore from '@/store/modules/home.store';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueAxios from 'vue-axios/dist/vue-axios.common.min';
import Vuex from 'vuex';
import appInit from '../../../testutils/appInit';

const args = appInit(createLocalVue());

describe('CardRoomMap.vue', () => {
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

    it('test search Input', async () => {
        args.localVue.use(VueAxios, axios);
        const wrapper = shallowMount(CardRoomMap, {
            ...args,
            store,
            axios,
            localVue: args.localVue,
        });
        await wrapper.setData({ search: 'Toulouse' });

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.axios.get).toBeCalledWith(
            'https://photon.komoot.io/api/?q=Toulouse'
        );
        await wrapper.vm.$nextTick();
        expect(wrapper.find('#search-input').exists()).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.search).toBe('Toulouse');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.entries).toHaveLength(2);
        expect(wrapper.vm.items).toHaveLength(2);
        expect(wrapper.vm.items[0]).toBe('Toulouse');
    });
});
