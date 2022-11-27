import bbox from '@turf/bbox';
import firebase from 'firebase/app';
import 'firebase/database';
import { GAME_MODE, SCORE_MODE } from '../../constants';
import i18n from '../../lang';
import router from '../../router';
import { getMaxDistanceBbox } from '../../utils';
import * as MutationTypes from '../mutation-types';

export class GameSettings {
    constructor(
        _allPanorama = false,
        _timeLimitation = 0,
        _mode = GAME_MODE.CLASSIC,
        _timeAttack = false,
        _zoomControl = true,
        _moveControl = true,
        _panControl = true,
        _countdown = 0,
        _scoreMode = SCORE_MODE.NORMAL,
        _areaParams = null,
        _optimiseStreetView = true,
        _nbRound = 5,
    ) {
        this.allPanorama = _allPanorama;
        this.time = _timeLimitation;
        this.modeSelected = _mode;
        this.timeAttackSelected = _timeAttack;
        this.zoomControl = _zoomControl;
        this.moveControl = _moveControl;
        this.panControl = _panControl;
        this.countdown = _countdown;
        this.scoreMode = _scoreMode;
        this.areaParams = _areaParams;
        this.optimiseStreetView = _optimiseStreetView;
        this.nbRoundSelected = _nbRound;
    }
}

export default {
    namespaced: true,
    state: () => ({
        //Dialog
        isOpenDialogRoom: false,
        loadRoom: false,
        currentComponent: 'settingsMap',
        singlePlayer: true,

        // ROOM
        room: null,
        roomName: '',
        roomErrorMessage: null,
        playerNumber: 0,
        // SETTINGS
        gameSettings: new GameSettings(),
        players: [],
        name: localStorage.getItem('playerName')?.slice(0, 20) || i18n.t("CardRoomPlayerName.anonymousPlayerName"),
        invalidName: false,
    }),
    mutations: {
        [MutationTypes.SETTINGS_SET_ROOM](state, roomName) {
            state.room = firebase.database().ref(roomName);
            state.roomName = roomName;
            // Open Modal
            if (!state.isOpenDialogRoom) {
                state.loadRoom = true;
                state.isOpenDialogRoom = true;
            }

            state.room.once('value', (snapshot) => {
                if (snapshot.child('started').val()) {
                    state.roomErrorMessage = i18n.t(
                        'DialogRoom.alreadyStarted'
                    );
                    state.room.off();
                    return;
                }

                const numberOfPlayers = snapshot
                    .child('playerName')
                    .numChildren();
                const playerNumber = numberOfPlayers + 1;

                state.playerNumber = playerNumber;
                const name = state.name === '' ? i18n.t(
                                'CardRoomPlayerName.anonymousPlayerName'
                            ) + playerNumber : state.name;

                state.room.child('playerName/player'+playerNumber).onDisconnect().remove();


                if (numberOfPlayers === 0) {
                    // Put the tentative player's name into the room node
                    // So that other player can't enter as the first player while the player decide the name and room size
                    state.room.child('playerName').update(
                        {
                            player1: name,
                        },
                        (error) => {
                            if (!error) {
                                // Put the timestamp the room is created so the expired rooms can be removed by cloud function
                                state.room.update({
                                    createdAt:
                                        firebase.database.ServerValue.TIMESTAMP,
                                });
                                state.loadRoom = false;
                                state.currentComponent = 'settingsMap';
                            }
                        }
                    );
                } else {
                    // Put other player's tentative name
                    state.room
                        .child('playerName/player' + playerNumber)
                        .set(
                            name,
                            (error) => {
                                if (!error) {
                                    state.loadRoom = false;
                                    state.currentComponent = 'playerName';
                                }
                            }
                        );
                }
            });
        },
        [MutationTypes.SETTINGS_SET_ROOM_ERROR](state, error) {
            state.roomErrorMessage = error;
        },
        [MutationTypes.SETTINGS_SET_GAME_SETTINGS](state, settings) {
            if (settings.modeSelected) {
                settings.areaParams = null;
            }
            if (settings.areaParams) {
                settings.modeSelected = GAME_MODE.CUSTOM_AREA;
            }

            state.gameSettings = {
                ...state.gameSettings,
                ...settings,
            };
        },
        [MutationTypes.SETTINGS_SET_DIFFICULTY](state, difficulty){
            state.difficulty = difficulty;
        },
        [MutationTypes.SETTINGS_SET_BBOX](state, bbox){
            state.bboxObj = bbox;
        },
        [MutationTypes.SETTINGS_SET_OPEN_DIALOG_ROOM](state, open) {
            state.isOpenDialogRoom = open;
        },
        [MutationTypes.SETTINGS_SET_MODE_DIALOG_ROOM](state, singlePlayer) {
            state.singlePlayer = singlePlayer;
            state.currentComponent = singlePlayer ? 'settingsMap' : 'roomName';
        },

        [MutationTypes.SETTINGS_SET_STEP_DIALOG_ROOM](state, step) {
            state.currentComponent = step;
        },
        [MutationTypes.SETTINGS_SET_PLAYER_NAME](state, playerName) {
            state.invalidName = state.players.includes(playerName);
            if (!state.invalidName) {
                state.name = playerName;
                state.room
                    .child('playerName/player' + state.playerNumber)
                    .set(playerName);
            }
        },
        [MutationTypes.SETTINGS_SET_PLAYERS](state, players) {
            state.players = players;
        },
        [MutationTypes.SETTINGS_RESET](state) {
            state.room = null;
            state.roomName = '';
            state.playerNumber = 0;
            state.roomErrorMessage = null;
            state.players = [];
            state.gameSettings = new GameSettings();
        },
    },

    getters: {
        areasJson(state) {
            return state.areas;
        },
    },

    actions: {
        closeDialogRoom({ state, commit, dispatch }, cleanRoom = true) {
            commit(MutationTypes.SETTINGS_SET_OPEN_DIALOG_ROOM, false);

            // Remove the room
            if (state.room != null) {
                state.room.off();
                if (cleanRoom) {
                    if (state.playerNumber === 1) {
                        // Remove the entire node if the player is the first player
                        state.room.remove();
                    } else {
                        // Remove only the player's name node if the player isn't the first player
                        state.room
                            .child('playerName/player' + this.playerNumber)
                            .remove();
                    }
                }
            }

            dispatch('setMapLoaded', new Map(), { root: true });
            commit(MutationTypes.SETTINGS_RESET);
        },
        openDialogRoom({ commit }, isSinglePlayer = true) {
            commit(MutationTypes.SETTINGS_SET_MODE_DIALOG_ROOM, isSinglePlayer);
            commit(MutationTypes.SETTINGS_SET_OPEN_DIALOG_ROOM, true);
        },

        searchRoom({ commit, dispatch, state }, roomName) {
            commit(MutationTypes.SETTINGS_SET_MODE_DIALOG_ROOM, false);
            if (roomName == '') {
                commit(
                    MutationTypes.SETTINGS_SET_ROOM_ERROR,
                    i18n.t('DialogRoom.invalidRoomName')
                );
            } else {
                commit(MutationTypes.SETTINGS_SET_ROOM, roomName);
            }

            state.room.on('value', (snapshot) => {
                if (snapshot.child('playerName').exists())
                    state.players = Object.values(
                        snapshot.child('playerName').val()
                    );

                if (
                    state.currentComponent === 'playerName' &&
                    state.playerNumber !== 1 &&
                    snapshot.hasChild('size') &&
                    snapshot.hasChild('streetView')
                ) {
                    dispatch('startGame');
                }
            });
        },
        setSettings({ commit, state, rootState, dispatch }) {
            let difficulty = 2000;
            let bboxObj;
            if (rootState.homeStore.map.geojson) {
                bboxObj = bbox(rootState.homeStore.map.geojson);
                commit(MutationTypes.SETTINGS_SET_BBOX, bboxObj);

                difficulty = getMaxDistanceBbox(bboxObj) / 10;
            }
            commit(MutationTypes.SETTINGS_SET_DIFFICULTY, difficulty);
            if (!state.room) {
                router.push({
                    name: 'street-view',
                    params: {
                        ...state.gameSettings,
                        difficulty,
                        placeGeoJson: rootState.homeStore.map.geojson,
                        bboxObj: bboxObj,
                        ...(rootState.homeStore.map ? {mapDetails: rootState.homeStore.map.details} : undefined)
                    },
                });
                dispatch('closeDialogRoom');
            } else {
                state.room.update(
                    {
                        ...state.gameSettings,
                        timeLimitation: state.gameSettings.time,
                        difficulty,
                        ...(bboxObj && { bboxObj: bboxObj }),
                    },
                    (error) => {
                        if (!error) {
                            commit(
                                MutationTypes.SETTINGS_SET_STEP_DIALOG_ROOM,
                                'playerName'
                            );
                        }
                    }
                );
            }
        },
        setPlayerName({ commit }, playerName) {
            localStorage.setItem('playerName', playerName.slice(0, 20));
            commit(MutationTypes.SETTINGS_SET_PLAYER_NAME, playerName.slice(0, 20));
        },
        startGame({ state, dispatch, rootState }) {
            let gameParams = {};
            if (state.playerNumber === 1) {
                gameParams = {
                    ...state.gameSettings,
                    difficulty: state.difficulty,
                    placeGeoJson: rootState.homeStore.map.geojson,
                    bboxObj: state.bboxObj,
                };
                // Set flag started
                state.room.update({
                    size: state.players.length,
                    started: true,
                });
                dispatch('startGameMultiplayer', gameParams);
            } else {
                state.room.once('value', (snapshot) => {
                    gameParams = {
                        difficulty: snapshot.child('difficulty').val(),
                        bboxObj: snapshot.child('bboxObj').val(),
                        modeSelected: snapshot.child('modeSelected').val(),
                        timeAttackSelected: snapshot
                            .child('timeAttackSelected')
                            .val(),
                        zoomControl: snapshot.child('zoomControl').val(),
                        moveControl: snapshot.child('moveControl').val(),
                        panControl: snapshot.child('panControl').val(),
                        countdown: snapshot.child('countdown').val(),
                        allPanorama: snapshot.child('allPanorama').val(),
                        scoreMode: snapshot.child('scoreMode').val(),
                        areaParams: snapshot.child('areaParams').val(),
                        optimiseStreetView: snapshot.child('optimiseStreetView').val(),
                        nbRoundSelected: snapshot.child('nbRoundSelected').val(),
                    };

                    dispatch('startGameMultiplayer', gameParams);
                });
            }
        },
        startGameMultiplayer({ state, rootState, dispatch }, gameParams) {
            // Start the game
            router.push({
                name: 'with-friends',
                params: {
                    ...gameParams,
                    roomName: state.roomName,
                    playerName: state.name,
                    playerNumber: state.playerNumber,
                    placeGeoJson: rootState.homeStore.map.geojson,
                    multiplayer: true,
                },
            });

            dispatch('closeDialogRoom', false);
        },
    },
};
