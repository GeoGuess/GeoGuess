import HeaderGame from '@/components/HeaderGame';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../testutils/appInit';

const args = appInit(createLocalVue());

describe('HeaderGame.vue', () => {
    it('mounted', () => {
        const wrapper = shallowMount(HeaderGame, {
            ...args,
            propsData: {
                remainingTime: 60,
            },
        });
        expect(wrapper.vm.startedAt).toBeNull();
        expect(wrapper.vm.intervalFunction).toBeNull();
        expect(wrapper).toMatchSnapshot();
    });

    it('methods', () => {
        window.setInterval = (func) => {
            func();
        };
        const wrapper = shallowMount(HeaderGame, {
            ...args,
            propsData: {
                remainingTime: 0,
            },
        });

        wrapper.vm.startTimer();

        expect(wrapper.vm.startedAt.getTime()).toBeLessThanOrEqual(
            new Date().getTime()
        );
        expect(wrapper.vm.timerText).toEqual('00:00');

        expect(wrapper).toMatchSnapshot();
    });

    it('methods', (done) => {
        const spy = jest.fn();
        const wrapper = shallowMount(HeaderGame, {
            ...args,
            propsData: {
                remainingTime: 0,
            },
        });
        wrapper.vm.startTimer = spy;

        wrapper.setProps({ round: 2 });
        wrapper.vm.$nextTick(() => {
            expect(spy).toBeCalled();

            done();
        });
    });
});
