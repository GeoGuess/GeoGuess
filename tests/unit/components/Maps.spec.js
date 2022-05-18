import Maps from '@/components/Maps';
import { createLocalVue, mount } from '@vue/test-utils';
import appInit from '../testutils/appInit';

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
            const stub = jest.fn();
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
            wrapper.vm.$refs.map.removeMarkers = jest.fn();
            wrapper.vm.$refs.map.removePolylines = jest.fn();

            wrapper.vm.goToNextRound(value);

            if (value) {
                expect(wrapper.vm.dialogSummary).toEqual(false);
                expect(wrapper.vm.isSummaryButtonVisible).toEqual(false);
            }

            expect(wrapper.vm.selectedPos).toBeNull();
            expect(wrapper.vm.isGuessButtonClicked).toEqual(false);
            expect(wrapper.vm.isSelected).toEqual(false);
            expect(wrapper.vm.countdownStarted).toEqual(false);
            expect(wrapper.vm.isNextButtonVisible).toEqual(false);
            expect(wrapper.vm.printMapFull).toEqual(false);

            expect(wrapper.vm.$refs.map.removeMarkers).toBeCalled();
            expect(wrapper.vm.$refs.map.removePolylines).toBeCalled();

            expect(stub).toBeCalledWith(value);
        });
    });
});
