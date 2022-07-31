import HistoryTable from '@/components/history/HistoryTable.vue';
import homeStore from '@/store/modules/home.store';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import * as dependencyUtils from '../../../../src/utils';
import appInit from '../../testutils/appInit';
import { csv, item } from './mock/example.js';

const args = appInit(createLocalVue());
Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat(
                Array.isArray(toFlatten) && depth > 1
                    ? toFlatten.flat(depth - 1)
                    : toFlatten
            );
        }, []);
    },
});

describe('HistoryTable.vue', () => {
    let store;
    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                homeStore: {
                    state: {
                        ...homeStore.state,
                        history: JSON.parse(
                            '[{"mode":"classic","multiplayer":false,"date":"2020-06-14T15:10:14.579Z","timeLimitation":0,"rounds":[{"guess":{"lat":49.35629642234583,"lng":-73.3876235},"position":{"lat":46.32492404792541,"lng":-74.2128121666204},"distance":343031},{"guess":{"lat":20.966226136901,"lng":105.91472350868774},"position":{"lat":16.45610423382063,"lng":107.5978548200058},"distance":532484},{"guess":{"lat":-1.9789104624962186,"lng":-64.70788738160854},"position":{"lat":-8.47747465683049,"lng":-70.14934638834765},"distance":941702},{"guess":{"lat":55.48785435635061,"lng":-1.5939715638887852},"position":{"lat":58.51518485516467,"lng":-6.260475420814613},"distance":439803},{"guess":{"lat":39.96452059424641,"lng":-100.91667319052173},"position":{"lat":42.04582308041186,"lng":-101.0496153025084},"distance":231958}],"score":2488978}]'
                        ),
                    },
                    mutations: {
                        HOME_SET_HISTORY: jest.fn(),
                    },
                    getters: homeStore.getters,
                    actions: homeStore.actions,
                },
            },
        });
    });
    it('test customSort method', () => {
        const wrapper = shallowMount(HistoryTable, { ...args, store });
        const items = [
            {
                id: '1',
                multiplayer: true,
                date: '2021-02-12T23:49:24.060Z',
                timeLimitation: 1,
                difficulty: 2000,
                mode: 'classic',
                timeAttack: false,
                score: 38061046,
                points: 1715,
                rank: 1,
            },
            {
                id: '2',
                multiplayer: true,
                date: '2021-02-12T23:49:24.010Z',
                timeLimitation: 2,
                difficulty: 2000,
                mode: 'classic',
                timeAttack: false,
                score: 38061046,
                points: 1711,
                rank: 1,
            },
            {
                id: '3',
                multiplayer: true,
                date: '2021-02-12T23:49:24.061Z',
                timeLimitation: 0,
                difficulty: 2000,
                mode: 'classic',
                timeAttack: false,
                score: 38061046,
                points: 1715,
                rank: 1,
            },
        ];
        expect(wrapper.vm.customSort([], ['dateString'], [true])).toEqual([]);
        const filter1 = wrapper.vm.customSort(items, ['dateString'], [true]);
        expect(filter1[0].id).toEqual('3');
        expect(filter1[2].id).toEqual('2');
        const filter2 = wrapper.vm.customSort(items, ['dateString'], [false]);
        expect(filter2[0].id).toEqual('2');
        expect(filter1[2].id).toEqual('3');

        const filter3 = wrapper.vm.customSort(items, ['timeString'], [true]);
        expect(filter3[0].id).toEqual('2');

        const filter4 = wrapper.vm.customSort(items, ['timeString'], [false]);
        expect(filter4[0].id).toEqual('3');
    });

    it('test share method', () => {
        const wrapper = shallowMount(HistoryTable, { ...args, store });

        wrapper.vm.share(item);

        expect(wrapper.vm.url).toEqual(
            'http://localhost/game/LDAsNDYuMzI0OTI0MDQ3OTI1NDEsLTc0LjIxMjgxMjE2NjYyMDQsMTYuNDU2MTA0MjMzODIwNjMsMTA3LjU5Nzg1NDgyMDAwNTgsLTguNDc3NDc0NjU2ODMwNDksLTcwLjE0OTM0NjM4ODM0NzY1LDU4LjUxNTE4NDg1NTE2NDY3LC02LjI2MDQ3NTQyMDgxNDYxMyw0Mi4wNDU4MjMwODA0MTE4NiwtMTAxLjA0OTYxNTMwMjUwODQ='
        );

        expect(wrapper.vm.dialog).toEqual(true);
    });

    it('test exportCsv method', () => {
        const wrapper = shallowMount(HistoryTable, { ...args, store });
        // eslint-disable-next-line no-import-assign
        dependencyUtils.download = jest.fn();
        wrapper.setData({ history: [item] });

        wrapper.vm.exportCsv();

        expect(dependencyUtils.download).toBeCalledWith(
            csv,
            expect.any(String),
            'text/csv'
        );
    });
});
