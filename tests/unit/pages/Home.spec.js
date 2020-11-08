import Home from '@/pages/Home.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../utils/appInit';
import Vuex from 'vuex';
import homeStore from '../../../src/store/homeStore';

const args = appInit(createLocalVue());
const $router = {
    push: jest.fn(),
};

describe('Home.vue', () => {
    let store, actions;
    beforeEach(() => {
        actions = {
            getListMaps: jest.fn(),
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
    it('test mounted', () => {
        const wrapper = shallowMount(Home, {
            ...args,
            store,
            mocks: {
                $route: {
                    params: {},
                },
                $router,
            },
        });
        expect($router.push).not.toBeCalled();

        expect(actions.getListMaps).toBeCalled();

        expect(wrapper).toMatchSnapshot();
    });
    it('test mounted', () => {
        const partyParams =
            'MjAwMCwzMDAsMzkuOTgyOTgxMzM0MTE0MDIsMjMuNjE4NDQ1MjIxOTg0OTgsNzAuMDAxNDM5OTEwOTEwNDUsMTkuNTYwMjI5NzM3Njk5MTcsNTguNDEyNzQ4MTQ2ODQ3MzIsNi45MTI3OTk3MzYzODg2NjYsNjIuMzQxODY2Njg2NDkxNTQsLTYuMjYxNDk1MTQyNDk0MjI2LDY3LjA5OTY2MzkwODQ4Mzc2LDE5LjUxMjI4NDk3NTUwODY0';
        const wrapper = shallowMount(Home, {
            args,
            store,
            mocks: {
                $route: {
                    params: {
                        partyParams,
                    },
                },
                $router,
            },
        });
        expect($router.push).toHaveBeenCalledWith({
            name: 'street-view',
            params: {
                time: 300,
                difficulty: 2000,
                roundsPredefined: [
                    [39.98298133411402, 23.61844522198498],
                    [70.00143991091045, 19.56022973769917],
                    [58.41274814684732, 6.912799736388666],
                    [62.34186668649154, -6.261495142494226],
                    [67.09966390848376, 19.51228497550864],
                ],
            },
        });

        expect(actions.getListMaps).toBeCalled();

        expect(wrapper).toMatchSnapshot();
    });
});
