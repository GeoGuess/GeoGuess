import DialogRoom from '@/components/dialogroom/DialogRoom';
import homeStore from '@/store/homeStore';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import appInit from '../../utils/appInit';

const args = appInit(createLocalVue());
const $router = {
    push: jest.fn(),
};
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

    it('test methods setSettings', () => {
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
                $router,
            },
        });

        wrapper.vm.setSettings(true, 1, 'country', false, false, true, false);
        expect(wrapper.vm.allPanorama).toEqual(true);
        expect(wrapper.vm.timeLimitation).toEqual(1);
        expect(wrapper.vm.mode).toEqual('country');
        expect(wrapper.vm.timeAttack).toEqual(false);
        expect(wrapper.vm.zoomControl).toEqual(false);
        expect(wrapper.vm.moveControl).toEqual(true);
        expect(wrapper.vm.panControl).toEqual(false);
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
