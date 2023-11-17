import Maps from '@/components/Maps.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import appInit from '../testutils/appInit';
import { describe, it, expect, vi } from 'vitest';

const args = appInit(createLocalVue());

describe('Maps.vue', () => {
    it('test methods goToNextRound (true | false)', () => {
        [true, false].forEach((value) => {
            const wrapper = mount(Maps, {
                ...args,
                propsData: {
                    mode: 'classic',
                },
            });
            const stub = vi.fn();
            wrapper.vm.$on('goToNextRound', stub);
            wrapper.setData({
                dialogSummary: value,
                isSummaryButtonVisible: value,
                selectedPos: {},
                isGuessButtonClicked: true,
                isSelected: true,
                isNextButtonVisible: true,
                countdownStarted: true,
                printMapFull: true,
            });
            wrapper.vm.$refs.map.removeMarkers = vi.fn();
            wrapper.vm.$refs.map.removePolylines = vi.fn();

            wrapper.vm.goToNextRound(value);

            if (value) {
                expect(wrapper.vm.dialogSummary).toBe(false);
                expect(wrapper.vm.isSummaryButtonVisible).toBe(false);
            }

            expect(wrapper.vm.selectedPos).toBeNull();
            expect(wrapper.vm.isGuessButtonClicked).toBe(false);
            expect(wrapper.vm.isSelected).toBe(false);
            expect(wrapper.vm.countdownStarted).toBe(false);
            expect(wrapper.vm.isNextButtonVisible).toBe(false);
            expect(wrapper.vm.printMapFull).toBe(false);

            expect(wrapper.vm.$refs.map.removeMarkers).toBeCalled();
            expect(wrapper.vm.$refs.map.removePolylines).toBeCalled();

            expect(stub).toBeCalledWith(value);
        });
    });
});
