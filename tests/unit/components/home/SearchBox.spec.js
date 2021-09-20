

import SearchBox from '@/components/home/SearchBox.vue';
import axios from '@/plugins/axios';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';
import homeStore from '../../../../src/store/homeStore';
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
        Vue.use(VueAxios, axios);
        const wrapper = shallowMount(SearchBox, { ...args, store });
       

        expect(wrapper).toMatchSnapshot();
    });
});
