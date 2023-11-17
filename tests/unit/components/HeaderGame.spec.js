import HeaderGame from '@/components/HeaderGame.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../testutils/appInit';
import { describe, it, expect, vi } from 'vitest';

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

    it('methods startTimer startedAt', () => {
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
        expect(wrapper.vm.timerText).toBe('00:00');

        expect(wrapper).toMatchSnapshot();
    });

    it('methods startTimer called', (done) => {
        const spy = vi.fn();
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
