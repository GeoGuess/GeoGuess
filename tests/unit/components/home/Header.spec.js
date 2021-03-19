import Header from '@/components/page/Header.vue';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import appInit from '../../utils/appInit';

const args = appInit(createLocalVue());

describe('Header.vue', () => {
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
});
