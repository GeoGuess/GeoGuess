import HistoryPage from '@/pages/HistoryPage.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../testutils/appInit';

const args = appInit(createLocalVue());
describe('Home.vue', () => {
    it('test mounted', () => {
        const wrapper = shallowMount(HistoryPage, args);

        expect(wrapper).toMatchSnapshot();
    });
});
