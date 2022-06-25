import Header from '@/components/page/Header.vue';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import homeStore from '@/store/modules/home.store';
import * as MutationTypes from '@/store/mutation-types';
import appInit from '../../testutils/appInit';
import Vuex from 'vuex';

const args = appInit(createLocalVue());

describe('Header.vue', () => {
    const setStreamerModeStore = jest.fn();
    let store;
    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                homeStore: {
                    state: homeStore.state,
                    getters: homeStore.getters,
                    actions: homeStore.actions,
                    mutations: {
                        [MutationTypes.HOME_SET_STREAMER_MODE]: setStreamerModeStore,
                    },
                },
            },
        });
    });
    it('open dialog about', () => {
        const wrapper = mount(Header, {
            ...args,
            store,
        });

        const aboutBtn = wrapper.find('#aboutBtn');
        expect(wrapper.vm.aboutDialog).toEqual(false);
        aboutBtn.trigger('click');
        expect(wrapper.vm.aboutDialog).toEqual(true);
    });

    it('switchLanguage method', () => {
        const wrapper = shallowMount(Header, {
            ...args,
            store,
        });
        expect(localStorage.getItem('language')).toEqual('en');
        wrapper.vm.switchLanguage('fr');
        expect(localStorage.getItem('language')).toEqual('fr');
    });

});
