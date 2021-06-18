import StreetView from '@/pages/StreetView.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import createGoogleMapsMock from 'jest-google-maps-mock';
import appInit from '../testutils/appInit';

const args = appInit(createLocalVue());
global.google = {
    maps: {
        ...createGoogleMapsMock(),
        StreetViewPanorama: jest.fn().mockImplementation(function () {
            return {
                setOptions: jest.fn(),
                setPov: jest.fn(),
                setPano: jest.fn(),
                setZoom: jest.fn(),
            };
        }),
    },
};
describe('StreetView.vue', () => {
    it('methods startTimer', () => {
        const wrapper = shallowMount(StreetView, args);
        wrapper.vm.startTimer = jest.fn();

        expect(wrapper.vm.isVisibleCountdownAlert).toEqual(false);

        const endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + 15);
        wrapper.vm.initTimer(15, true);

        expect(wrapper.vm.timeCountdown).toEqual(15);
        expect(wrapper.vm.isVisibleCountdownAlert).toEqual(true);
        expect(wrapper.vm.endTime.getTime()).toBeGreaterThanOrEqual(
            endDate.getTime()
        );
        expect(wrapper.vm.startTimer).toBeCalled();

        expect(wrapper).toMatchSnapshot();
    });
    it('methods startTimer hasTimerStarted', () => {
        const wrapper = shallowMount(StreetView, args);
        wrapper.vm.startTimer = jest.fn();

        wrapper.setData({
            hasTimerStarted: true,
            endTime: new Date(new Date().getTime() + 1000000),
        });

        expect(wrapper.vm.isVisibleCountdownAlert).toEqual(false);

        const endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + 15);
        wrapper.vm.initTimer(15, true);

        expect(wrapper.vm.timeCountdown).toEqual(15);
        expect(wrapper.vm.isVisibleCountdownAlert).toEqual(true);
        expect(wrapper.vm.endTime.getTime()).toBeGreaterThanOrEqual(
            endDate.getTime()
        );
        expect(wrapper.vm.startTimer).not.toBeCalled();

        expect(wrapper).toMatchSnapshot();
    });

    it('methods startTimer hasTimerStarted', () => {
        const wrapper = shallowMount(StreetView, {
            ...args,
            propsData: {
                zoomControl: false,
                moveControl: false,
            },
        });

        wrapper.vm.panorama = new google.maps.StreetViewPanorama();
        wrapper.vm.panorama.setOptions = jest.fn();

        wrapper.vm.setPosition({
            location: {
                pano: {},
            },
        });

        expect(wrapper.vm.panorama.setOptions).toBeCalledWith({
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
            panControl: true,
            zoomControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            linksControl: false,
            clickToGo: false,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
