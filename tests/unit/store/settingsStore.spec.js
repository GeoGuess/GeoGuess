import { GAME_MODE } from '../../../src/constants';
import * as MutationTypes from '../../../src/store/mutation-types';
const { default: settingsStore, GameSettings } = require('../../../src/store/settingsStore');

describe('settingsStore.js', () => {
    it('SETTINGS_SET_GAME_SETTINGS', ()=>{
        let state = {gameSettings: new GameSettings()};
        expect(
            state.gameSettings.allPanorama).toBeFalsy();
        settingsStore.mutations[MutationTypes.SETTINGS_SET_GAME_SETTINGS](state, {allPanorama: true});
        expect(
            state.gameSettings.allPanorama).toBeTruthy();
        expect(state.gameSettings.modeSelected).toEqual('classic');

        settingsStore.mutations[MutationTypes.SETTINGS_SET_GAME_SETTINGS](state, {areaParams: {title: '111'}});
        expect(state.gameSettings.areaParams.title).toEqual('111');
        expect(state.gameSettings.modeSelected).toEqual(GAME_MODE.CUSTOM_AREA);

        settingsStore.mutations[MutationTypes.SETTINGS_SET_GAME_SETTINGS](state, {modeSelected: 'country'});
        expect(state.gameSettings.areaParams).toBeNull();
        expect(state.gameSettings.modeSelected).toEqual('country');

    });

});