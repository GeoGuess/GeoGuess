import { GAME_MODE } from '@/constants.js';
import * as MutationTypes from '@/store/mutation-types.js';
import {
    default as settingsStore,
    GameSettings,
} from '@/store/modules/settings.store.js';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/lang', () => {
    return {
        t: (k) => k,
    };
});

describe('settingsStore.js', () => {
    it('SETTINGS_SET_GAME_SETTINGS', () => {
        let state = { gameSettings: new GameSettings() };
        expect(state.gameSettings.allPanorama).toBeFalsy();
        settingsStore.mutations[MutationTypes.SETTINGS_SET_GAME_SETTINGS](
            state,
            { allPanorama: true }
        );
        expect(state.gameSettings.allPanorama).toBeTruthy();
        expect(state.gameSettings.modeSelected).toBe('classic');

        settingsStore.mutations[MutationTypes.SETTINGS_SET_GAME_SETTINGS](
            state,
            { areaParams: { title: '111' } }
        );
        expect(state.gameSettings.areaParams.title).toBe('111');
        expect(state.gameSettings.modeSelected).toBe(GAME_MODE.CUSTOM_AREA);

        settingsStore.mutations[MutationTypes.SETTINGS_SET_GAME_SETTINGS](
            state,
            { modeSelected: 'country' }
        );
        expect(state.gameSettings.areaParams).toBeNull();
        expect(state.gameSettings.modeSelected).toBe('country');
        expect(state.gameSettings.optimiseStreetView).toBeTruthy();
    });

    it('setPlayerName will commit playerName', () => {
        const spy = vi.spyOn(window.localStorage.__proto__, 'setItem');
        const commit = vi.fn();
        settingsStore.actions.setPlayerName({ commit }, 'Toto');

        expect(commit).toBeCalledWith(
            MutationTypes.SETTINGS_SET_PLAYER_NAME,
            'Toto'
        );
        expect(spy).toHaveBeenCalledWith('playerName', 'Toto');
    });
});
