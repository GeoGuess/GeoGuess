import App from '@/App.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from './testutils/appInit';
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';

const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;

global.document.addEventListener = vi.fn();
global.navigator.serviceWorker = { addEventListener: vi.fn() };
const args = appInit(createLocalVue());

const factory = () => {
    return shallowMount(App, {
        ...args,
    });
};

describe('App.vue', () => {
    it('methods: setUpdate should set update datas', () => {
        const wrapper = factory();
        const event = {
            detail: {
                waiting: {
                    postMessage: vi.fn(),
                },
            },
        };

        wrapper.vm.setUpdate(event);

        expect(wrapper.vm.updateAvailable).toBe(true);
        expect(wrapper.vm.registration).toBe(event.detail);
    });

    it('methods: refreshApp should do nothing', () => {
        const wrapper = factory();
        wrapper.setData({
            registration: {},
        });

        wrapper.vm.refreshApp();

        expect(wrapper.vm.updateAvailable).toBe(false);
    });

    it('methods: refreshApp should postMessage SKIP_WAITING', () => {
        const wrapper = factory();
        wrapper.setData({
            registration: {
                waiting: {
                    postMessage: vi.fn(),
                },
            },
        });

        wrapper.vm.refreshApp();

        expect(wrapper.vm.updateAvailable).toBe(false);
        expect(
            wrapper.vm.registration.waiting.postMessage
        ).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    });
});
