import MapCard from '@/components/home/maps/MapCard.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../../../utils/appInit';

const args = appInit(createLocalVue());

describe('MapDialog.vue', () => {
    let store;

    it('open dialog hist', () => {
        const map = {
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
            imageUrl:
                'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=140',
            url: 'https://mapurl.geojson',
        };
        const wrapper = shallowMount(MapCard, {
            ...args,
            store,
            propsData: {
                map,
            },
        });

        const mapLocate = wrapper.vm.mapLocate;

        expect(mapLocate.descriptionLocate).toEqual(map.description.en);

        expect(mapLocate.nameLocate).toEqual(map.name.en);

        expect(wrapper).toMatchSnapshot();
    });
});
