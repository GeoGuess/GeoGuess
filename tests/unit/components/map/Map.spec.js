import Map from '@/components/map/Map';
import { createLocalVue, mount } from '@vue/test-utils';
import appInit from '../../utils/appInit';

const args = appInit(createLocalVue());

describe('Map.vue', () => {


    it('test methods', () => {

        const wrapper= mount(Map, {
            ...args,
            google: {
                
            },
            propsData: {
                bbox: [0,10,20,30],
            },
        });
        expect(wrapper.vm.markers).toHaveLength(0);
        wrapper.vm.putMarker({lat: 0, lng: 1});
        wrapper.vm.putMarker({lat: 0, lng: 1}, true);
        wrapper.vm.putMarker({lat: 0, lng: 1}, false, 'l');

        expect(wrapper.vm.markers).toHaveLength(3);

    })
})