import Header from '@/components/home/Header.vue';
import { mount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import Vuetify from 'vuetify';
import i18n from '@/lang';
import Vue from 'vue';

import en from 'vuetify/es5/locale/en';
Vue.use(VueI18n);
Vue.use(Vuetify);

describe('Header.vue', () => {
    const args = {
        Vue,
        i18n,
        vuetify: new Vuetify({
            lang: {
                locales: { en },
                current: 'en',
            },
        }),
    };

    it('renders props.msg when passed', () => {
        const wrapper = mount(Header, args);

        const buttonHistory = wrapper.find('#historyBtn');
        expect(buttonHistory.exists()).toBe(true);
        expect(wrapper.vm.historyDialog).toEqual(false);
        buttonHistory.trigger('click');
        expect(wrapper.vm.historyDialog).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });
    it('renders props.msg when passed', () => {
        const wrapper = mount(Header, args);

        const aboutBtn = wrapper.find('#aboutBtn');
        expect(wrapper.vm.aboutDialog).toEqual(false);
        aboutBtn.trigger('click');
        expect(wrapper.vm.aboutDialog).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });
});
