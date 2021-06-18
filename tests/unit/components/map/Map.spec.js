import Map from '@/components/map/Map';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../../testutils/appInit';
import createGoogleMapsMock from 'jest-google-maps-mock';

const args = appInit(createLocalVue());
global.google = {
    maps: {
        ...createGoogleMapsMock(),
        InfoWindow: jest.fn().mockImplementation(function () {
            return {
                open: jest.fn(),
            };
        }),
        Polyline: jest.fn().mockImplementation(function () {
            return {
                setMap: jest.fn(),
            };
        }),
    },
};
describe('Map.vue', () => {
    it('test methods', () => {
        const wrapper = shallowMount(Map, {
            ...args,
            propsData: {
                bbox: [0, 10, 20, 30],
            },
        });
        expect(wrapper.vm.markers).toHaveLength(0);
        wrapper.vm.putMarker({ lat: 0, lng: 1 });
        wrapper.vm.putMarker({ lat: 0, lng: 1 }, true);
        wrapper.vm.putMarker({ lat: 0, lng: 1 }, false, 'l');
        expect(wrapper.vm.markers).toHaveLength(3);

        expect(global.google.maps.Marker).toHaveBeenCalledTimes(3);

        wrapper.vm.setInfoWindow('Mickey', 10, 5000);
        wrapper.vm.setInfoWindow('Mickey', 10000, 5000);
        expect(global.google.maps.InfoWindow).toHaveBeenCalledTimes(2);

        wrapper.vm.removeMarkers();
        expect(wrapper.vm.markers).toHaveLength(0);

        wrapper.vm.drawPolyline({ lat: 0, lng: 1 }, 1, { lat: 1, lng: 1 });
        expect(global.google.maps.Polyline).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.polylines).toHaveLength(1);
    });
});
