import DialogRoom from '@/components/widgets/dialog/DialogRoom';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import homeStore from '../../../../../src/store/homeStore';
import appInit from '../../../utils/appInit';

const args = appInit(createLocalVue());

describe('DialogRoom.vue', () => {
    let store;
    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                homeStore: {
                    state: homeStore.state,
                    getters: homeStore.getters,
                    actions: homeStore.actions,
                },
            },
        });
    });

    it('test singlePlayer', () => {
        const wrapper = shallowMount(DialogRoom, {
            ...args,
            store,
            propsData: {
                singlePlayer: true,
            },
            mocks: {
                $route: {
                    params: {
                        id: 123,
                    },
                },
            },
        });

        expect(wrapper.vm.currentComponent).toEqual('settings');
    });
    it('test multiplayer', () => {
        const wrapper = shallowMount(DialogRoom, {
            ...args,
            store,
            mocks: {
                $route: {
                    params: {
                        id: 123,
                    },
                },
            },
        });

        expect(wrapper.vm.currentComponent).toEqual('roomName');
    });
});
