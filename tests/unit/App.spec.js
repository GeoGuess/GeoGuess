

import App from '@/App';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from './testutils/appInit';
import { JSDOM } from "jsdom";
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;

global.document.addEventListener = jest.fn();
global.navigator.serviceWorker = {addEventListener: jest.fn()};
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
			detail: { waiting: {
				postMessage: jest.fn(),
			}}
		};

		wrapper.vm.setUpdate(event);

		expect(wrapper.vm.updateAvailable).toEqual(true);
		expect(wrapper.vm.registration).toEqual(event.detail);
	});

	it('methods: refreshApp should do nothing', () => {
		const wrapper = factory();
		wrapper.setData({
			registration: { }
		});


		wrapper.vm.refreshApp();

		expect(wrapper.vm.updateAvailable).toEqual(false);	
	
	});

	it('methods: refreshApp should postMessage SKIP_WAITING', () => {
		const wrapper = factory();
		wrapper.setData({
			registration: {
				waiting: {
					postMessage: jest.fn(),
				}
			}
		});

		wrapper.vm.refreshApp();

		expect(wrapper.vm.updateAvailable).toEqual(false);
		expect(wrapper.vm.registration.waiting.postMessage).toHaveBeenCalledWith({type:'SKIP_WAITING'});
	});
	
});
