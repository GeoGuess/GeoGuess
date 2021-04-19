import HistoryTable from '@/components/history/HistoryTable.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../../utils/appInit';
import { item, csv } from './mock/example.js';
import * as dependencyUtils from '../../../../src/utils';
import Vuex from 'vuex';
import homeStore from '@/store/homeStore';

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
                    state: homeStore.state,
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
            'undefined/game/LDAsNDYuMzI0OTI0MDQ3OTI1NDEsLTc0LjIxMjgxMjE2NjYyMDQsMTYuNDU2MTA0MjMzODIwNjMsMTA3LjU5Nzg1NDgyMDAwNTgsLTguNDc3NDc0NjU2ODMwNDksLTcwLjE0OTM0NjM4ODM0NzY1LDU4LjUxNTE4NDg1NTE2NDY3LC02LjI2MDQ3NTQyMDgxNDYxMyw0Mi4wNDU4MjMwODA0MTE4NiwtMTAxLjA0OTYxNTMwMjUwODQ='
        );

        expect(wrapper.vm.dialog).toEqual(true);
    });

    it('test exportCsv method', () => {
        const wrapper = shallowMount(HistoryTable, { ...args, store });
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
