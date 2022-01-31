import HomeCard from '@/components/home/card/HomeCard.vue';
import { GeoMapCustom } from '@/models/GeoMap';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../../../testutils/appInit';
import Vuex from 'vuex';

const args = appInit(createLocalVue());
const data = {
    name: {
        en: 'Biggest City',
        fr: 'Grande Villes',
    },
    description: {
        fr:
            'Une liste de plus de 40 villes : PARIS, KOBE OSAKA, SEOUL, HOUSTON, BARCELONA, PHILADELPHIA, SANTIAGO, LAGOS, DALLAS, NEW YORK, ISTANBUL, TOKYO, FUKUOKA, LONDON, KUALA LUMPUR, LIMA, HO CHI MINH CITY, MANILA, GUADALAJARA, MADRID, NAGOYA, SINGAPORE, JOHANNESBURG, BELO HORIZONTE, TORONTO, MEXICO CITY, MIAMI, ATLANTA, RIO DE JANEIRO, BUENOS AIRES, SAO PAULO, CHICAGO,…',
        en:
            'List of 40 biggest cities of the world: PARIS, KOBE OSAKA, SEOUL, HOUSTON, BARCELONA, PHILADELPHIA, SANTIAGO, LAGOS, DALLAS, NEW YORK, ISTANBUL, TOKYO, FUKUOKA, LONDON, KUALA LUMPUR, LIMA, HO CHI MINH CITY, MANILA, GUADALAJARA, MADRID, NAGOYA, SINGAPORE, JOHANNESBURG, BELO HORIZONTE, TORONTO, MEXICO CITY, MIAMI, ATLANTA, RIO DE JANEIRO, BUENOS AIRES, SAO PAULO, CHICAGO,…',
    },
    author: 'BilelJegham',
    imageSrc:
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=140',
    url: 'https://mapurl.geojson',
};
describe('HomeCard.vue', () => {
    let store;

    beforeAll(() => {
        store = new Vuex.Store({
            modules: {
                homeStore:{
                    getters:{
                        getMaxScoreMap: () => () => 0,
                    }
                }
            },
        });
    });

    it('render', () => {

        const wrapper = shallowMount(HomeCard, {
            ...args,
            store,
            propsData: {
                data,
            },
        });

        expect(wrapper).toMatchSnapshot();
    });
    
    
    it('deleteMap', () => {   
        
        const map = new GeoMapCustom();
        const spy= jest.spyOn(map,'delete');
        const wrapper = shallowMount(HomeCard, {
            ...args,
            store,
            propsData: {
                data: map,
                type: 'map'
            },
        });

        wrapper.vm.deleteMap();

        expect(spy).toBeCalled();
    });
});
