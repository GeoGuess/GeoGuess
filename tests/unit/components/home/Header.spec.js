import Header from '@/components/home/Header.vue';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import appInit from '../../utils/appInit';

const args = appInit(createLocalVue());

describe('Header.vue', () => {
    it('open dialog hist', () => {
        const wrapper = mount(Header, args);
        const buttonHistory = wrapper.find('#historyBtn');
        expect(buttonHistory.exists()).toBe(true);
        expect(wrapper.vm.historyDialog).toEqual(false);
        buttonHistory.trigger('click');
        expect(wrapper.vm.historyDialog).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });
    it('open dialog about', () => {
        const wrapper = mount(Header, args);

        const aboutBtn = wrapper.find('#aboutBtn');
        expect(wrapper.vm.aboutDialog).toEqual(false);
        aboutBtn.trigger('click');
        expect(wrapper.vm.aboutDialog).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });

    it('switchLanguage method', () => {
        const wrapper = shallowMount(Header, args);
        expect(localStorage.getItem('language')).toEqual('en');
        wrapper.vm.switchLanguage('fr');
        expect(localStorage.getItem('language')).toEqual('fr');
    });

    it('test localSotrage history method', () => {
        localStorage.setItem(
            'history',
            '[{"multiplayer":false,"date":"2020-06-14T15:10:14.579Z","timeLimitation":0,"rounds":[{"guess":{"lat":49.35629642234583,"lng":-73.3876235},"position":{"lat":46.32492404792541,"lng":-74.2128121666204},"distance":343031},{"guess":{"lat":20.966226136901,"lng":105.91472350868774},"position":{"lat":16.45610423382063,"lng":107.5978548200058},"distance":532484},{"guess":{"lat":-1.9789104624962186,"lng":-64.70788738160854},"position":{"lat":-8.47747465683049,"lng":-70.14934638834765},"distance":941702},{"guess":{"lat":55.48785435635061,"lng":-1.5939715638887852},"position":{"lat":58.51518485516467,"lng":-6.260475420814613},"distance":439803},{"guess":{"lat":39.96452059424641,"lng":-100.91667319052173},"position":{"lat":42.04582308041186,"lng":-101.0496153025084},"distance":231958}],"score":2488978}]'
        );
        const wrapper = shallowMount(Header, args);
        expect(wrapper.vm.history).toHaveLength(1);
        expect(wrapper.vm.history[0].score).toEqual(2488978);
    });
});
