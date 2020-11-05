import MapDialog from '@/components/home/maps/MapDialog.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../../../utils/appInit';
import Vuex from 'vuex';
import homeStore from '../../../../../src/store/homeStore';

const args = appInit(createLocalVue());

describe('MapDialog.vue', () => {
    let store, actions;
    beforeEach(() => {
        actions = {
            playMultiPlayer: jest.fn(),
            playSinglePlayer: jest.fn(),
            loadGeoJsonFromUrl: jest.fn(),
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
    it('methods', () => {
        const wrapper = shallowMount(MapDialog, {
            ...args,
            store,
            propsData: {
                mapLocate: {
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
                    imageUrl:
                        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=140',
                    url: 'https://mapurl.geojson',
                },
            },
        });
        wrapper.setData({ visible: true });
        wrapper.vm.onClickSinglePlayer();

        expect(wrapper.vm.visible).toEqual(false);
        expect(actions.playSinglePlayer).toBeCalled();
        expect(actions.loadGeoJsonFromUrl).toBeCalledWith(
            expect.anything(),
            'https://mapurl.geojson'
        );

        wrapper.setData({ visible: true });
        wrapper.vm.onClickMultiPlayer();

        expect(wrapper.vm.visible).toEqual(false);

        expect(actions.playMultiPlayer).toBeCalled();

        expect(actions.loadGeoJsonFromUrl).toBeCalledTimes(2);

        expect(wrapper).toMatchSnapshot();
    });
});
