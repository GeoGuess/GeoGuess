import HomeCardDialog from '@/components/home/card/HomeCardDialog.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import settingsStore from '@/store/modules/settings.store';
import appInit from '../../../testutils/appInit';

const args = appInit(createLocalVue());

describe('HomeCardDialog.vue', () => {
    let store, actions, loadMap;
    beforeEach(() => {
        actions = {
            openDialogRoom: jest.fn(),
        };
        loadMap = jest.fn();
        store = new Vuex.Store({
            modules: {
                settingsStore: {
                    namespaced: true,
                    state: settingsStore.state,
                    getters: settingsStore.getters,
                    mutations: settingsStore.mutations,
                    actions,
                },
                homeStore:{
                    actions:{
                        loadMap                        
                    }
                }
            },
        });
    });
    it('methods', () => {
        const map = {
            name: {
                en: 'Biggest City',
                fr: 'Grande Villes',
            },
            nameLocate: 'Grande Villes',
            description: {
                fr:
                    'Une liste de plus de 40 villes : PARIS, KOBE OSAKA, SEOUL, HOUSTON, BARCELONA, PHILADELPHIA, SANTIAGO, LAGOS, DALLAS, NEW YORK, ISTANBUL, TOKYO, FUKUOKA, LONDON, KUALA LUMPUR, LIMA, HO CHI MINH CITY, MANILA, GUADALAJARA, MADRID, NAGOYA, SINGAPORE, JOHANNESBURG, BELO HORIZONTE, TORONTO, MEXICO CITY, MIAMI, ATLANTA, RIO DE JANEIRO, BUENOS AIRES, SAO PAULO, CHICAGO,…',
                en:
                    'List of 40 biggest cities of the world: PARIS, KOBE OSAKA, SEOUL, HOUSTON, BARCELONA, PHILADELPHIA, SANTIAGO, LAGOS, DALLAS, NEW YORK, ISTANBUL, TOKYO, FUKUOKA, LONDON, KUALA LUMPUR, LIMA, HO CHI MINH CITY, MANILA, GUADALAJARA, MADRID, NAGOYA, SINGAPORE, JOHANNESBURG, BELO HORIZONTE, TORONTO, MEXICO CITY, MIAMI, ATLANTA, RIO DE JANEIRO, BUENOS AIRES, SAO PAULO, CHICAGO,…',
            },
            descriptionLocate:
                'Une liste de plus de 40 villes : PARIS, KOBE OSAKA, SEOUL, HOUSTON, BARCELONA, PHILADELPHIA, SANTIAGO, LAGOS, DALLAS, NEW YORK, ISTANBUL, TOKYO, FUKUOKA, LONDON, KUALA LUMPUR, LIMA, HO CHI MINH CITY, MANILA, GUADALAJARA, MADRID, NAGOYA, SINGAPORE, JOHANNESBURG, BELO HORIZONTE, TORONTO, MEXICO CITY, MIAMI, ATLANTA, RIO DE JANEIRO, BUENOS AIRES, SAO PAULO, CHICAGO,…',
            author: 'BilelJegham',
            imageSrc:
                'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=140',
            url: 'https://mapurl.geojson',
        };
        const wrapper = shallowMount(HomeCardDialog, {
            ...args,
            store,
            propsData: {
                data: map,
            },
        });
        wrapper.setData({ visible: true });
        wrapper.vm.onClickSinglePlayer();

        expect(wrapper.vm.visible).toEqual(false);
        expect(actions.openDialogRoom).toBeCalled();
        expect(loadMap).toBeCalledWith(expect.anything(), map);

        wrapper.setData({ visible: true });
        wrapper.vm.onClickMultiPlayer();

        expect(wrapper.vm.visible).toEqual(false);

        expect(actions.openDialogRoom).toBeCalled();

        expect(loadMap).toBeCalledTimes(2);

    });
});
