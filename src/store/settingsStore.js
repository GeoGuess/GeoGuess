import axios from '@/plugins/axios';
import * as MutationTypes from './mutation-types';
import { GAME_MODE, SCORE_MODE } from '../constants';
import Vue from 'vue';
import i18n from '../lang';
import router from '../router';
import { getMaxDistanceBbox } from '../utils';
import bbox from '@turf/bbox';
import firebase from 'firebase/app';
import 'firebase/database';

export class GameSettings {


         constructor(
            _allPanorama = false,
            _timeLimitation = 0,
            _mode =  GAME_MODE.CLASSIC,
            _timeAttack = false,
            _zoomControl = true,
            _moveControl= true,
            _panControl= true,
            _countdown = 0,
            _scoreMode= SCORE_MODE.NORMAL,
            _areaParams= null){                
            this.allPanorama = _allPanorama;
            this.time = _timeLimitation;
            this.modeSelected = _mode;
            this.timeAttack = _timeAttack;
            this.zoomControl = _zoomControl;
            this.moveControl = _moveControl;
            this.panControl = _panControl;
            this.countdown = _countdown;
            this.scoreMode = _scoreMode;
            this.areaParams = _areaParams;
     }
}


export default {
    namespaced: true,
    state: () => ({
        //Dialog
        isOpenDialogRoom: false,
        currentComponent: 'settings',
        singlePlayer: true, 


        // ROOM
        room: null,
        roomName: '',
        roomErrorMessage: null,
        playerNumber: 0,
        // SETTINGS
        difficulty: null,
        bboxObj: null,
        gameSettings: new GameSettings(),
        // GEOJSON
        placeGeoJson: null,
        difficulty: 2000,
        loadingGeoJson: false,
        errorMessage: null,
        players: [],
        name: '',
        invalidName: false,
    }),
    mutations: {
        [MutationTypes.SETTINGS_SET_ROOM](state,roomName) {
            
                state.room = firebase.database().ref(roomName);
            state.roomName =roomName;

    
            
             state.room.once('value', (snapshot) => {
                
             
                    
                            if (snapshot.child('started').val()) {
                                state.roomErrorMessage =  i18n.t('DialogRoom.alreadyStarted');
                                state.room.off();
                                return;
                            }
                            
                            const numberOfPlayers = snapshot
                            .child('playerName')
                            .numChildren();
                            const playerNumber = numberOfPlayers + 1;
                            
                            state.playerNumber = playerNumber;

                            if (numberOfPlayers === 0) {
                                // Put the tentative player's name into the room node
                                // So that other player can't enter as the first player while the player decide the name and room size
                                state.room.child('playerName').update(
                                    {
                                        player1: i18n.t(
                                            'CardRoomPlayerName.anonymousPlayerName'
                                        ),
                                    },
                                    (error) => {
                                        if (!error) {
                                            // Put the timestamp the room is created so the expired rooms can be removed by cloud function
                                            state.room.update({
                                                createdAt:
                                                    firebase.database.ServerValue
                                                        .TIMESTAMP,
                                            });
                                            
                                                    
                                            state.currentComponent = "settings";
                                        }
                                    }
                                );
                            } else {
                                // Put other player's tentative name
                                state.room
                                    .child('playerName/player' + playerNumber)
                                    .set(
                                        i18n.t(
                                            'CardRoomPlayerName.anonymousPlayerName'
                                        ) + playerNumber,
                                        (error) => {
                                            if (!error) {  
                                        
                                                state.currentComponent =  'playerName';
                                            }
                                        }
                                    );
                            }
                     
                        
                });           
                
        
        },
        [MutationTypes.SETTINGS_SET_ROOM_ERROR](state, error) {
            state.roomErrorMessage =error;
        },
        [MutationTypes.SETTINGS_SET_GAME_SETTINGS](state, settings) {
            state.gameSettings = {
                ...state.gameSettings,
                ...settings,
            };
        },
        [MutationTypes.SETTINGS_SET_STATUS_GEOJSON](state, status) {
            state.loadingGeoJson = status;
        },
        [MutationTypes.SETTINGS_SET_GEOJSON](state, geojson) {
            state.placeGeoJson = geojson;
            if(geojson){
                
                state.bboxObj = bbox(geojson);

                state.difficulty = getMaxDistanceBbox(bboxObj) / 10;
            }
        },
        [MutationTypes.SETTINGS_SET_GEOJSON_ERROR](state, error){
            state.errorMessage = error;
        },
        [MutationTypes.SETTINGS_SET_OPEN_DIALOG_ROOM](state, open) {
            state.isOpenDialogRoom = open;
        },
        [MutationTypes.SETTINGS_SET_MODE_DIALOG_ROOM](state, singlePlayer) {
            state.singlePlayer = singlePlayer; 
            state.currentComponent = singlePlayer? 'settings' : 'roomName';
        },
        
        [MutationTypes.SETTINGS_SET_STEP_DIALOG_ROOM](state, step) {
            state.currentComponent = step;
        },
        [MutationTypes.SETTINGS_SET_PLAYER_NAME](state, playerName){ 
            state.invalidName = state.players.includes(playerName);
            if (!state.invalidName) {          
                state.name = playerName;
                state.room
                    .child('playerName/player' + state.playerNumber)
                    .set(playerName);
            }
        },
        [MutationTypes.SETTINGS_SET_PLAYERS](state, players){
            state.players = players;
        }
    },

    getters: {
        areasJson(state) {
            return state.areas;
        },
    },

    actions: {
        closeDialogRoom({commit}){

            commit(MutationTypes.SETTINGS_SET_OPEN_DIALOG_ROOM, false);
            //    // Reset
            // (this.currentComponent = this.singlePlayer
            //     ? 'settings'
            //     : 'roomName'),
            //     (this.roomName = '');
            // this.errorMessage = '';

            // this.firstPlayer = false;

            // // Remove the room
            // this.dialogRoom = false;
            // if (this.room != null) {
            //     if (this.playerNumber == 1) {
            //         // Remove the entire node if the player is the first player
            //         this.room.remove();
            //     } else {
            //         // Remove only the player's name node if the player isn't the first player
            //         this.room
            //             .child('playerName/player' + this.playerNumber)
            //             .remove();
            //     }
            // }
        },
        openDialogRoom({ commit },isSinglePlayer= true){
            commit(MutationTypes.SETTINGS_SET_MODE_DIALOG_ROOM, isSinglePlayer);
            commit(MutationTypes.SETTINGS_SET_OPEN_DIALOG_ROOM, true);
        },
        loadPlaceGeoJSON({ commit, state }, place) {
            if (place != null && place != '') {
                if (state.loadingGeoJson) {
                    return;
                }
                commit(MutationTypes.SETTINGS_SET_STATUS_GEOJSON, true);
                commit(MutationTypes.SETTINGS_SET_GEOJSON, null);
                
                axios
                .get(
                    `https://nominatim.openstreetmap.org/search/${encodeURIComponent(
                        place.toLowerCase()
                    )}?format=geojson&limit=1&polygon_geojson=1`
                )
                .then((res) => {
                    if (
                        res &&
                        res.status === 200 &&
                        res.data.features.length > 0
                    ) {
                        const placeGeoJson = 
                        commit(MutationTypes.SETTINGS_SET_GEOJSON, res.data.features[0]);
                        return;
                    }
                    commit(MutationTypes.SETTINGS_SET_GEOJSON_ERROR,'No Found Location');
                })
                .finally(() => {
                    commit(MutationTypes.SETTINGS_SET_STATUS_GEOJSON, false);
                });
            }
        },
        searchRoom({ commit, dispatch, state }, roomName){
            if (roomName == '') {
                commit(MutationTypes.SETTINGS_SET_ROOM_ERROR, i18n.t('DialogRoom.invalidRoomName'));
            } else {
                commit(MutationTypes.SETTINGS_SET_ROOM,roomName) ;
            }          
           state.room.on('value', (snapshot)=>{
                    if(snapshot.child('playerName').exists())
                        state.players = Object.values(snapshot.child('playerName').val());

                            if (state.currentComponent=== "playerName" && state.playerNumber !== 1 && snapshot.hasChild('size') && snapshot.hasChild('streetView')) {
                            
                                dispatch('startGame');
                                state.room.off();
                            }
                              
            });
        },
        setSettings(
            { commit, state },
        ) {
         if (!state.room) {
                router.push({
                    name: 'street-view',
                    params: {
                        ...state.gameSettings,
                        difficulty: state.difficulty,
                        placeGeoJson: state.placeGeoJson,
                        bboxObj: state.bboxObj,                        
                    },
                });
            } else {  
                                   
                state.room.update(
                    {
                        ...state.gameSettings,
                        timeLimitation: state.gameSettings.time,
                        difficulty: state.difficulty,
                        placeGeoJson: state.placeGeoJson,
                        bboxObj: state.bboxObj,    
                    },
                    (error) => {
                        if (!error) {
                            commit(MutationTypes.SETTINGS_SET_STEP_DIALOG_ROOM, 'playerName');
                        }
                    }
                );
            }
        },

        setPlayerName({commit}, playerName) {
            if (playerName === '') {
                commit(MutationTypes.SETTINGS_SET_PLAYER_NAME,  i18n.t('CardRoomPlayerName.anonymousPlayerName'));
            }
            commit(MutationTypes.SETTINGS_SET_PLAYER_NAME, playerName);
        },
        startGame({state, dispatch}){
            let gameParams = {};
            if (state.playerNumber === 1) {
      
                gameParams = {
                    ...state.gameSettings,
                    difficulty: state.difficulty,
                    placeGeoJson: state.placeGeoJson,
                    bboxObj: state.bboxObj,  
                };          
                // Set flag started
                state.room.update({
                    size: state.players.length,
                    started: true
                });
                dispatch('startGameMultiplayer',gameParams);
            } else {
                state.room.once('value', (snapshot) => {
                    gameParams = {
                        difficulty: snapshot.child('difficulty').val(),
                        bboxObj: snapshot.child('bbox').val(),
                        modeSelected: snapshot.child('modeSelected').val(),
                        timeAttackSelected: snapshot.child('timeAttack').val(),
                        zoomControl: snapshot.child('zoomControl').val(),
                        moveControl: snapshot.child('moveControl').val(),
                        panControl: snapshot.child('panControl').val(),
                        countdown: snapshot.child('countdown').val(),
                        allPanorama: snapshot.child('allPanorama').val(),
                        scoreMode: snapshot.child('scoreMode').val(),
                        areaParams: snapshot.child('areaParams').val(),
                    };
                    dispatch('startGameMultiplayer',gameParams);
                });
            }
      
       
          },
        startGameMultiplayer({state},gameParams) {
            // Start the game
            router.push({
                name: 'with-friends',
                params: {
                    ...gameParams,    
                    roomName: state.roomName,
                    playerName: state.name,
                    playerNumber: state.playerNumber,
                    placeGeoJson: state.placeGeoJson,
                    multiplayer: true,
                },
            });
        },
    },
};
