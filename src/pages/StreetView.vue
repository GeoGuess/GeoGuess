<template>
    <div id="game-page">
        <div id="street-view-container">
            <HeaderGame
                ref="header"
                :distance="scoreHeader"
                :points="pointsHeader"
                :round="round"
                :room-name="roomName"
                :nb-round="nbRound"
                :remaining-time="remainingTime"
                :mode="mode"
            />

            <div id="game-interface">
                <v-overlay :value="!isReady && multiplayer" opacity="1" />
                <div id="street-view" ref="streetView" />


                <div id="game-interface__overlay">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="resetBtn" rounded dark fab 
                                   v-bind="attrs"
                                   v-on="on"
                                   @click="resetLocation" >
                                <v-icon>mdi-crosshairs-gps</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t('Maps.reset') }}</span>
                    </v-tooltip>
                    <Maps
                        ref="mapContainer"
                        :random-lat-lng="randomLatLng"
                        :random-feature-properties="randomFeatureProperties"
                        :room-name="roomName"
                        :player-number="playerNumber"
                        :player-name="playerName"
                        :is-ready="isReady"
                        :round="round"
                        :score="score"
                        :points="points"
                        :difficulty="difficultyData"
                        :time-limitation="timeLimitation"
                        :bbox="bbox"
                        :mode="mode"
                        :area="area"
                        :time-attack="timeAttack"
                        :nb-round="nbRound"
                        :countdown="countdown"
                        :score-mode="scoreMode"
                        :areasGeoJsonUrl="areaParams && areaParams.data.urlArea"
                        :pathKey="
                            areaParams ? areaParams.data.pathKey : 'iso_a2'
                        "
                        :mapDetails="mapDetails"
                        @resetLocation="resetLocation"
                        @calculateDistance="updateScore"
                        @showResult="showResult"
                        @goToNextRound="goToNextRound"
                        @finishGame="finishGame"
                    />
                </div>
            </div>
        </div>
        <v-overlay :value="overlay" opacity="0.8" z-index="1" />
        <DialogMessage
            :dialog-message="dialogMessage"
            :dialog-title="dialogTitle"
            :dialog-text="dialogText"
        />
        <div class="alert-container">
            <v-alert
                v-if="isVisibleDialog"
                type="warning"
                dismissible
                class="warning-alert"
            >
                <b>{{ $t('StreetView.nearby.title') }}</b> :
                {{ $t('StreetView.nearby.message') }}
            </v-alert>
            <v-alert
                id="warningCountdown"
                v-model="isVisibleCountdownAlert"
                type="info"
                dismissible
                transition="slide-x-transition"
                prominent
                icon="mdi-clock-fast"
            >
                {{ $tc('StreetView.countdownAlert', remainingTime) }}
                <v-progress-linear
                    :active="isVisibleCountdownAlert"
                    color="white"
                    v-model="countdownPercentage"
                    absolute
                    bottom
                ></v-progress-linear>
            </v-alert>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

import HeaderGame from '@/components/HeaderGame';
import Maps from '@/components/Maps';
import DialogMessage from '@/components/DialogMessage';


import StreetViewService from '@/plugins/StreetViewService';

import {
    getRandomArea,
} from '../utils';

import { GAME_MODE, SCORE_MODE } from '../constants';

import { mapActions, mapGetters } from 'vuex';

import ConfirmExitMixin from '@/mixins/ConfirmExitMixin';

export default {
    components: {
        HeaderGame,
        Maps,
        DialogMessage,
    },
    mixins: [ConfirmExitMixin],
    props: {
        roomName: {
            default: null,
            type: String,
        },
        // https://developers.google.com/maps/documentation/javascript/reference/street-view-service#StreetViewSource
        allPanorama: {
            default: false,
            type: Boolean,
        },
        optimiseStreetView: {
            default: true,
            type: Boolean,
        },
        playerNumber: {
            default: null,
            type: Number,
        },
        playerName: {
            default: null,
            type: String,
        },
        placeGeoJson: {
            default: null,
            type: Object,
        },
        multiplayer: {
            default: false,
            type: Boolean,
        },
        time: {
            default: 0,
            type: Number,
        },
        difficulty: {
            default: 2000,
            type: Number,
        },
        bboxObj: {
            default: null,
            type: Array,
        },
        roundsPredefined: {
            default: null,
            type: Array,
        },
        modeSelected: {
            default: GAME_MODE.CLASSIC,
            type: String,
        },
        panControl: {
            default: true,
            type: Boolean,
        },
        zoomControl: {
            default: true,
            type: Boolean,
        },
        moveControl: {
            default: true,
            type: Boolean,
        },
        timeAttackSelected: {
            default: false,
            type: Boolean,
        },
        countdown: {
            default: 0,
            type: Number,
        },
        scoreMode: {
            default: SCORE_MODE.NORMAL,
            type: String,
        },
        areaParams: {
            type: Object,
        },
        mapDetails:{
            type: Object,
            required: false,
            default: undefined
        },
        nbRoundSelected: {
            type: Number,
            required: false,
            default: 5,
        },
    },
    data() {
        return {
            area: null,
            randomLatLng: null,
            randomFeatureProperties: null,
            score: 0,
            scoreHeader: 0,
            points: 0,
            pointsHeader: 0,
            round: 1,
            timeLimitation: this.time,
            mode: this.modeSelected,
            timeAttack: this.timeAttackSelected,
            nbRound: this.timeAttackSelected ? 10 : this.nbRoundSelected,
            remainingTime: 0,
            endTime: null,
            hasTimerStarted: false,
            hasLocationSelected: false,
            overlay: false,
            room: null,
            isReady: false,
            dialogMessage: this.multiplayer,
            dialogTitle: this.$t('StreetView.waitForOtherPlayers'),
            dialogText: '',
            isVisibleDialog: false,
            panorama: null,

            difficultyData: this.difficulty,
            bbox: this.bboxObj,
            isVisibleCountdownAlert: false,
            timeCountdown: 0,

            streetViewService: null,
        };
    },
    computed: {
        ...mapGetters(['areasJson']),
        countdownPercentage() {
            return (this.remainingTime * 100) / this.timeCountdown;
        }
    },
    async mounted() {
        if (
            (this.areaParams && this.areaParams.data.urlArea) ||
            this.mode === GAME_MODE.COUNTRY
        ) {
            await this.loadAreas(
                this.areaParams && this.areaParams.data.urlArea
            );
        }
        await this.$gmapApiPromiseLazy();
        this.panorama = new google.maps.StreetViewPanorama(
            this.$refs.streetView
        );
  
        if (!this.streetViewService) {
            this.streetViewService = new StreetViewService(
                { allPanorama: this.allPanorama, optimiseStreetView: this.optimiseStreetView },
                { mode: this.mode, areaParams: this.areaParams, areasJson: this.areasJson },
                this.placeGeoJson,
                this.roundsPredefined
            );
        }

        if (!this.multiplayer) {
            await this.loadStreetView();
            this.$refs.mapContainer.startNextRound();

            if (this.timeLimitation != 0) {
                if (!this.hasTimerStarted) {
                    this.initTimer(this.timeLimitation);
                    this.hasTimerStarted = true;
                }
            }
        } else {
            // Set a room name if it's null to detect when the user refresh the page
            if (!this.roomName) {
                this.exitGame();
            }

            this.room = firebase.database().ref(this.roomName);

            if (this.playerNumber === 1) {
                await this.loadStreetView();
            }

            this.room.child('active').set(true);
            this.room.on('value', (snapshot) => {
                // Check if the room is already removed
                if (snapshot.hasChild('active')) {
                    // Put the player into the current round node if the player is not put yet
                    if (
                        !snapshot
                            .child('round' + this.round)
                            .hasChild('player' + this.playerNumber)
                    ) {
                        this.room
                            .child('round' + this.round)
                            .child('player' + this.playerNumber)
                            .set(0);

                        // Other players load the streetview the first player loaded earlier
                        if (this.playerNumber != 1) {
                            let randomLat = snapshot
                                .child(
                                    'streetView/round' +
                                        this.round +
                                        '/latitude'
                                )
                                .val();
                            let randomLng = snapshot
                                .child(
                                    'streetView/round' +
                                        this.round +
                                        '/longitude'
                                )
                                .val();
                          
                            this.area = snapshot
                                .child(
                                    'streetView/round' + this.round + '/area'
                                )
                                .val();
                            this.isVisibleDialog = snapshot
                                .child(
                                    'streetView/round' + this.round + '/warning'
                                )
                                .val();
                            this.randomFeatureProperties = snapshot
                                .child(
                                    'streetView/round' +
                                        this.round +
                                        '/roundInfo'
                                )
                                .val();
                            this.randomLatLng = new google.maps.LatLng(
                                randomLat,
                                randomLng
                            );
                            this.resetLocation();
                        }
                    }

                    // Enable guess button when every players are put into the current round's node
                    if (
                        snapshot.child('round' + this.round).numChildren() ===
                            snapshot.child('size').val() &&
                        !this.isReady
                    ) {
                        // Close the dialog when everyone is ready
                        this.dialogMessage = false;
                        this.dialogText = '';

                        this.isReady = true;
                        this.$refs.mapContainer.startNextRound();

                        // Countdown timer starts
                        this.timeLimitation = snapshot
                            .child('timeLimitation')
                            .val();

                        if (this.timeLimitation != 0) {
                            if (!this.hasTimerStarted) {
                                this.initTimer(this.timeLimitation);
                                this.hasTimerStarted = true;
                            }
                        }
                    }

                    // Delete the room when everyone finished the game
                    if (
                        snapshot.child('isGameDone').numChildren() ==
                        snapshot.child('size').val()
                    ) {
                        this.room.child('active').remove();
                        this.room.off();
                        this.room.remove();
                    }
                } else {
                    // Force the players to exit the game when 'Active' is removed
                    this.exitGame();
                }
            });
        }

        this.$refs.header.startTimer();
    },
    beforeDestroy() {
        if (document.querySelector('.widget-scene')) {
            document
                .querySelector('.widget-scene')
                .removeEventListener('keydown', this.onUserEventPanoramaKey);

            document
                .querySelector('.widget-scene')
                .removeEventListener(
                    'mousedown',
                    this.onUserEventPanoramaMouse
                );
        }
        window.removeEventListener('beforeunload', this.beforeUnload);
        if (this.room) {
            // Remove the room when the player refreshes the window
            // Remove the room when the player pressed the back button on browser
            this.room.child('active').remove();
            this.room.off();
        }
    },
    methods: {
        ...mapActions(['loadAreas']),
        async loadStreetView() {
            let {panorama, roundInfo, warning, area} = await this.streetViewService.getStreetView(this.round);
            this.randomLatLng = panorama.location.latLng;
            this.randomFeatureProperties = roundInfo;
            this.area = area;
            this.setPosition(panorama);

            if (this.multiplayer) {
                // Put the streetview's location into firebase
                this.room
                    .child('streetView/round' + this.round)
                    .set({
                        latitude: this.randomLatLng.lat(),
                        longitude: this.randomLatLng.lng(),
                        roundInfo: roundInfo,
                        ...(area && {area}),
                        warning,
                 });
            }
        },
        resetLocation() {
            const service = new google.maps.StreetViewService();
            service.getPanorama(
                {
                    location: this.randomLatLng,
                    preference: 'nearest',
                    radius: 50,
                    source: this.allPanorama ? 'default' : 'outdoor',
                },
                this.setPosition
            );
        },
        setPosition(data) {
            this.panorama.setOptions({
                addressControl: false,
                fullscreenControl: false,
                motionTracking: false,
                motionTrackingControl: false,
                showRoadLabels: false,
                panControl: this.panControl,
                zoomControl: this.zoomControl,
                scrollwheel: this.zoomControl,
                disableDoubleClickZoom: !this.zoomControl,
                linksControl: this.moveControl,
                clickToGo: this.moveControl,
            });
            // Remove google streetview link
            if (document.querySelector('#street-view a[href^="https://maps"]'))
                document
                    .querySelector('#street-view a[href^="https://maps"]')
                    .remove();
            setTimeout(() => {
                if (document.querySelector('.widget-scene')) {
                    document
                        .querySelector('.widget-scene')
                        .addEventListener(
                            'keydown',
                            this.onUserEventPanoramaKey
                        );

                    document
                        .querySelector('.widget-scene')
                        .addEventListener(
                            'mousedown',
                            this.onUserEventPanoramaMouse
                        );
                    document
                        .querySelector('.widget-scene')
                        .addEventListener(
                            'touchstart',
                            this.onUserEventPanoramaMouse
                        );
                    document
                        .querySelector('.widget-scene')
                        .addEventListener(
                            'pointerdown',
                            this.onUserEventPanoramaMouse
                        );
                }
            }, 50);

            if(data && data.location)
                this.panorama.setPano(data.location.pano);
            this.panorama.setPov({
                heading: 270,
                pitch: 0,
            });

            this.panorama.setZoom(0);
        },
        initTimer(time, printAlert) {
            const endDate = new Date();
            endDate.setSeconds(endDate.getSeconds() + time);
            if (printAlert) {
                this.timeCountdown = time;
                this.isVisibleCountdownAlert = true;
            }
            if (this.hasTimerStarted) {
                this.endTime = this.endTime > endDate ? endDate : this.endTime;
            } else {
                this.endTime = endDate;
                this.startTimer();
            }
        },
        startTimer(round = this.round) {
            if (round === this.round) {
                this.remainingTime = Math.max(
                    0,
                    Math.round((this.endTime - Date.now()) / 1000)
                );
                if (this.remainingTime > 0) {
                    setTimeout(() => {
                        this.startTimer(round);
                    }, 1000);
                } else {
                    this.timerInProgress = false;
                    if (!this.hasLocationSelected) {
                        if (
                            [GAME_MODE.COUNTRY, GAME_MODE.CUSTOM_AREA].includes(
                                this.mode
                            )
                        ) {
                            this.$refs.mapContainer.selectRandomLocation(
                                getRandomArea(
                                    this.areasJson,
                                    this.areaParams
                                        ? this.areaParams.data.pathKey
                                        : 'iso_a2'
                                )
                            );
                        } else {
                            // Set a random location if the player didn't select a location in time
                            this.$refs.mapContainer.selectRandomLocation(
                                this.streetViewService.getRandomLatLng().position
                            );
                        }
                    }
                }
            }
        },
        updateScore(distance, points) {
            // Update the score and save it into firebase
            this.hasLocationSelected = true;
            if (!this.multiplayer) {
                this.remainingTime = 0;
            }
            this.score += distance;
            this.points += points;

            if (this.multiplayer) {
                this.room
                    .child('finalScore/player' + this.playerNumber)
                    .set(this.score);
                this.room
                    .child('finalPoints/player' + this.playerNumber)
                    .set(this.points);

                // Wait for other players to guess locations
                this.dialogTitle = this.$t('StreetView.waitForOtherPlayers');
                this.dialogMessage = true;
            }
        },
        showResult() {
            this.scoreHeader = this.score; // Update the score on header after every players guess locations
            this.pointsHeader = this.points;
            this.remainingTime = 0;
            this.dialogMessage = false;
            this.isVisibleCountdownAlert = false;
            this.overlay = true;
            this.$refs.header.stopTimer();
        },
        async goToNextRound(playAgain = false) {
            if (playAgain) {
                this.round = 0;
                this.scoreHeader = 0;
                this.pointsHeader = 0;
                this.score = 0;
                this.points = 0;
            }

            // Reset
            this.randomLatLng = null;
            this.area = null;
            this.overlay = false;
            this.hasTimerStarted = false;
            this.hasLocationSelected = false;
            this.isVisibleDialog = false;
            this.randomFeatureProperties = null;

            if (this.multiplayer) {
                this.dialogMessage = true; // Show the dialog while waiting for other players
                this.isReady = false; // Turn off the flag so the click event can be added in the next round
            }

            // Update the round
            this.round += 1;

            if (this.playerNumber == 1 || !this.multiplayer) {
                await this.loadStreetView();
                if (!this.multiplayer && this.timeLimitation != 0) {
                    this.initTimer(this.timeLimitation);
                }
            } else {
                // Trigger listener and load the next streetview
                this.room
                    .child('trigger/player' + this.playerNumber)
                    .set(this.round);
            }
            this.$refs.mapContainer.startNextRound();
        },
        exitGame() {
            // Disable the listener and force the players to exit the game
            this.dialogTitle = this.$t('StreetView.redirectToHomePage');
            this.dialogText = this.$t('StreetView.exitGame');
            this.dialogMessage = true;
            this.canExit = true;
            if (this.room) {
                this.room.off();
                this.room.remove();
                this.$router.push('/history');
            } else {
                this.$router.push('/');
            }
        },
        finishGame() {
            this.canExit = true;
            if (!this.multiplayer) {
                this.$router.push('/history');
            } else {
                // Open the dialog while waiting for other players to finsih the game
                this.dialogTitle = this.$t(
                    'StreetView.waitForOtherPlayersToFinish'
                );
                this.dialogText = '';
                this.dialogMessage = true;
            }
        },
        onUserEventPanoramaKey(e) {
            if (
                (!this.moveControl &&
                    [38, 40, 87, 83, 90].includes(e.keyCode)) ||
                (!this.zoomControl &&
                    [107, 109, 187, 189].includes(e.keyCode)) ||
                (!this.panControl &&
                    [37, 39, 65, 68, 100, 102].includes(e.keyCode))
            ) {
                e.stopPropagation();
            }
        },
        onUserEventPanoramaMouse(e) {
            if (!this.panControl) e.stopPropagation();
        },
    },
};
</script>

<style scoped lang="scss">
#game-page {
    position: relative;
    height: 100%;
    height: var(--global-height, 100%);
    width: 100%;
    top: 0;
    left: 0;
}

#street-view-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
}
#game-interface {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;

    &__overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        .resetBtn{
            position: absolute;
            bottom: 22px;
            right: 70px;
            z-index: 1;
            @media (max-width: 450px) {
                bottom: 65px;
            }
        }
    }
}

#street-view {
    position: relative;
    min-height: 100%;
    width: 100%;
}
.alert-container {
    margin-top: 65px;
    .v-alert {
        z-index: 2;
    }
    #warningCountdown {
        width: fit-content;
        margin: 10px;
        margin-top: 90px;
        padding: auto 30px;
    }
}

@media (max-width: 450px) {
    #game-interface {
        display: grid;
        grid-template-rows: auto 44px;
        #game-interface--overlay {
            position: initial;
        }
    }

    #reset-button {
        bottom: 120px;
    }
}
</style>
