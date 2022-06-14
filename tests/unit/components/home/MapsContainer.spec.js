import MapsContainer from "@/components/home/MapsContainer.vue";
import homeStore from '@/store/modules/home.store';
import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import appInit from "../../testutils/appInit";

const args = appInit(createLocalVue(), false);
describe('MapsContainer', ()=>{

    let store, actions;
    beforeEach(() => {
        actions = {
            getListMaps: jest.fn(),
            getListMapsCustoms: jest.fn(),
        };
        store = new Vuex.Store({
            modules: {
                homeStore: {
                    state: homeStore.state,
                    getters: homeStore.getters,
                    actions,
                },
            },
        });
    });
    it('mounted: should render components', ()=>{
        
        shallowMount(MapsContainer, {
            ...args,
            store
        });

        expect(actions.getListMaps).toBeCalled();
        expect(actions.getListMapsCustoms).toBeCalled();

    });

    it('filterMethods: should filter area',async ()=>{
        const wrapper = shallowMount(MapsContainer, {
            ...args,
            store
        });
        
        await wrapper.setData({
            search: 'area2',
        });
        const arrayArea = [{
            nameLocate: 'area1',
            descriptionLocate: 'description1',
            author: 'author1',
        },
        {
            nameLocate: 'area2',
            descriptionLocate: 'description2',
            author: 'author2',
        }];

        
        expect(wrapper.vm.filterMethods(arrayArea[0])).toBeFalsy();
        expect(wrapper.vm.filterMethods(arrayArea[1])).toBeTruthy();
       

    });

});