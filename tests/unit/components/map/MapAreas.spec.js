import MapAreas from '@/components/map/MapAreas.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import appInit from '../../testutils/appInit';
import Vuex from 'vuex';
import createGoogleMapsMock from 'jest-google-maps-mock';
import areaStore from '@/store/modules/area.store';
import { describe, beforeEach, it, vi, expect } from 'vitest';

const args = appInit(createLocalVue());
global.google = {
    maps: {
        ...createGoogleMapsMock(),
        InfoWindow: vi.fn().mockImplementation(function () {
            return {
                open: vi.fn(),
            };
        }),
        Polyline: vi.fn().mockImplementation(function () {
            return {
                setMap: vi.fn(),
            };
        }),
    },
};
describe('MapAreas.vue', () => {
    let store;
    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                areaStore: {
                    getters: areaStore.getters,
                    actions: {
                        loadAreas: vi.fn(),
                    },
                },
            },
        });
    });
    it('test methods', () => {
        const wrapper = mount(MapAreas, {
            ...args,
            store,
            propsData: {
                bbox: [0, 10, 20, 30],
                area: 'FR',
            },
        });
        wrapper.vm.areas.CA = new google.maps.Data({
            style: {
                strokeOpacity: 0,
                fillOpacity: 0,
                strokeWeight: 2,
            },
        });
        wrapper.vm.areas.FR = new google.maps.Data({
            style: {
                strokeOpacity: 0,
                fillOpacity: 0,
                strokeWeight: 2,
            },
        });

        expect(wrapper.vm.markers).toHaveLength(0);
        wrapper.vm.putMarker({ lat: 0, lng: 1 }, true);
        expect(wrapper.vm.markers).toHaveLength(1);
        expect(global.google.maps.Marker).toHaveBeenCalledTimes(1);
        wrapper.vm.putMarker('CA', false);
        expect(global.google.maps.Marker).toHaveBeenCalledTimes(1);

        expect(wrapper.vm.infoWindowDatas).toHaveLength(0);
        wrapper.vm.setInfoWindow('Mickey', 10, 5000, false, 'CA');
        expect(wrapper.vm.infoWindowDatas).toHaveLength(1);
        expect(wrapper.vm.infoWindowDatas[0].playerName).toBe('Mickey');
        expect(wrapper.vm.infoWindowDatas[0].area).toBe('CA');

        wrapper.vm.removeMarkers();
        expect(wrapper.vm.markers).toHaveLength(0);
        expect(wrapper.vm.infoWindowDatas).toHaveLength(0);

        expect(wrapper.vm.allowSelect).toBe(true);
        wrapper.vm.removeListener();
        expect(wrapper.vm.allowSelect).toBe(false);
    });
});
