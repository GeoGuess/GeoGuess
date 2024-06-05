import WorldCountries from '@/components/shared/WorldCountries.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import appInit from '../../testutils/appInit';
import { describe, beforeEach, expect, vi, it } from 'vitest';

const args = appInit(createLocalVue());
const data = {
    countries: { SD: 'SD' },
};
describe('WorldCountries.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(WorldCountries, {
            ...args,
            propsData: {
                ...data,
            },
        });
    });

    it('render', () => {
        expect(wrapper.html()).toBeTruthy();
    });

    it('tests getClassCountry', () => {
        const getClassCountrySpy = vi.spyOn(wrapper.vm, 'getClassCountry');
        const result = wrapper.vm.getClassCountry('sd');
        expect(getClassCountrySpy).toHaveBeenCalledWith('sd');
        expect(result).toBe('filled filled--SD');
    });

    it('tests onClickCountry', () => {
        const onClickCountrySpy = vi.spyOn(wrapper.vm, 'onClickCountry');
        wrapper.vm.onClickCountry('sd');
        expect(onClickCountrySpy).toHaveBeenCalledWith('sd');
        expect(wrapper.emitted('click-country')).toBeTruthy();
    });
});
