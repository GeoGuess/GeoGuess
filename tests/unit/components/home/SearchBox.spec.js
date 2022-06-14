

import SearchBox from '@/components/home/SearchBox.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import homeStore from '@/store/modules/home.store';
import appInit from '../../testutils/appInit';

const args = appInit(createLocalVue());
let store;
describe('SearchBox.vue', () => {
    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                homeStore
            },
        });
    });
    it('render', () => {
        const wrapper = shallowMount(SearchBox, { ...args, store });
       

        expect(wrapper).toMatchSnapshot();
    });
});
