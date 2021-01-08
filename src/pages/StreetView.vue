<template>
    <div id="game-page">
        <div id="street-view-container">
            <HeaderGame
                ref="header"
                :score="scoreHeader"
                :points="pointsHeader"
                :round="round"
                :roomName="roomName"
                :nbRound="nbRound"
                :remainingTime="remainingTime"
            />

            <div id="game-interface">
                <v-overlay :value="!isReady && multiplayer" opacity="1" />
                <div id="street-view"></div>

                <div id="game-interface--overlay">
                    <Maps
                        ref="mapContainer"
                        :randomLatLng="randomLatLng"
                        :randomFeatureProperties="randomFeatureProperties"
                        :roomName="roomName"
                        :playerNumber="playerNumber"
                        :playerName="playerName"
                        :isReady="isReady"
                        :round="round"
                        :score="score"
                        :points="points"
                        :difficulty="difficultyData"
                        :timeLimitation="timeLimitation"
                        :bbox="bbox"
                        :mode="mode"
                        :country="country"
                        :timeAttack="timeAttack"
                        :nbRound="nbRound"
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
            :dialogMessage="dialogMessage"
            :dialogTitle="dialogTitle"
            :dialogText="dialogText"
        />
        <v-alert
            type="warning"
            dismissible
            class="warning-alert"
            v-if="isVisibleDialog"
            tile
        >
            <b>{{ $t('StreetView.nearby.title') }}</b> :
            {{ $t('StreetView.nearby.message') }}
        </v-alert>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

import HeaderGame from '@/components/HeaderGame';
import Maps from '@/components/Maps';
import DialogMessage from '@/components/DialogMessage';

import randomPositionInPolygon from 'random-position-in-polygon';
import * as turfModel from '@turf/helpers';
import bbox from '@turf/bbox';
import {
    isInGeoJSON,
    getCountryCodeNameFromLatLng,
    getRandomCountry,
    getMaxDistanceBbox,
} from '../utils';
import { GAME_MODE } from '../constants';

export default {
    props: {
        roomName: {
            default: null,
            type: String,
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
        timeAttackSelected: {
            default: false,
            type: Boolean,
        },
    },
    components: {
        HeaderGame,
        Maps,
        DialogMessage,
    },
    data() {
        return {
            country: null,
            randomLatLng: null,
            randomLat: null,
            randomLng: null,
            randomFeatureProperties: null,
            score: 0,
            scoreHeader: 0,
            points: 0,
            pointsHeader: 0,
            round: 1,
            timeLimitation: this.time,
            mode: this.modeSelected,
            timeAttack: this.timeAttackSelected,
            nbRound: this.timeAttackSelected ? 10 : 5,
            remainingTime: 0,
            endTime: null,
            hasTimerStarted: false,
            hasLocationSelected: false,
            overlay: false,
            room: null,
            isReady: false,
            dialogMessage: this.multiplayer,
            dialogTitle: this.$t('StreetView.waitForOtherPlayers'),
            dialogText: window.origin + '/room/' + this.roomName,
            cptNotFoundLocation: 0,
            isVisibleDialog: false,
            panorama: null,

            difficultyData: this.difficulty,
            bbox: this.bboxObj,
        };
    },
    methods: {
        loadStreetView() {
            const service = new google.maps.StreetViewService();
            let radius, position;
            if (this.roundsPredefined) {
                radius = 50;
                const positions = this.roundsPredefined[this.round - 1];
                position = new google.maps.LatLng(positions[0], positions[1]);
            } else {
                const randomPos = this.getRandomLatLng();
                radius = randomPos.radius;
                position = randomPos.position;
                this.randomFeatureProperties = randomPos.properties;
            }

            service.getPanorama(
                {
                    location: position,
                    preference: 'nearest',
                    radius,
                    source: 'outdoor',
                },
                this.checkStreetView
            );
        },
        getRandomLatLng() {
            if (this.placeGeoJson != null) {
                let position,
                    radius = 100000,
                    properties = null;
                if (this.placeGeoJson.type === 'FeatureCollection') {
                    let randInt = Math.floor(
                        Math.random() * this.placeGeoJson.features.length
                    );

                    const feature = this.placeGeoJson.features[randInt];
                    properties = feature.properties;
                    if (feature.geometry.type === 'Point') {
                        position = feature.geometry.coordinates;
                        radius = 50;
                    } else {
                        radius = getMaxDistanceBbox(bbox(feature)) * 100;
                        position = randomPositionInPolygon(feature);
                    }
                } else {
                    radius = getMaxDistanceBbox(bbox(this.placeGeoJson)) * 100;
                    position = randomPositionInPolygon(this.placeGeoJson);
                }

                return {
                    radius,
                    position: new google.maps.LatLng(position[1], position[0]),
                    properties,
                };
            }

            // Generate a random latitude and longitude
            let lat = Math.random() * 170 - 85;
            let lng = Math.random() * 360 - 180;

            return {
                radius: 100000,
                position: new google.maps.LatLng(lat, lng),
                properties: null,
            };
        },
        checkStreetView(data, status) {
            // Generate random streetview until the valid one is generated
            if (status === 'OK' && data.location) {
                let isInGeoJSONResult;
                if (this.placeGeoJson != null) {
                    isInGeoJSONResult = isInGeoJSON(
                        turfModel.point([
                            data.location.latLng.lng(),
                            data.location.latLng.lat(),
                        ]),
                        this.placeGeoJson
                    );
                }
                if (
                    this.placeGeoJson != null &&
                    this.cptNotFoundLocation < 3 &&
                    !isInGeoJSONResult
                ) {
                    this.loadStreetView();
                    this.cptNotFoundLocation++;
                } else {
                    // If 3 times Street View does not find location in the polygon placeGeoJson print warning message
                    if (this.placeGeoJson != null && !isInGeoJSONResult) {
                        this.isVisibleDialog = true;
                    }
                    // Save the location's latitude and longitude
                    this.randomLatLng = data.location.latLng;
                    this.cptNotFoundLocation = 0;
                    this.setPosition(data);

                    if (this.mode === GAME_MODE.COUNTRY) {
                        getCountryCodeNameFromLatLng(
                            this.randomLatLng,
                            this.loadStreetView
                        ).then((c) => {
                            this.country = c;

                            if (this.multiplayer) {
                                // Put the streetview's location into firebase
                                this.room
                                    .child('streetView/round' + this.round)
                                    .set({
                                        latitude: this.randomLatLng.lat(),
                                        longitude: this.randomLatLng.lng(),
                                        roundInfo:
                                            this.randomFeatureProperties ||
                                            null,
                                        country: c,
                                        warning: this.isVisibleDialog,
                                    });
                            }
                        });
                    } else {
                        if (this.multiplayer) {
                            // Put the streetview's location into firebase
                            this.room
                                .child('streetView/round' + this.round)
                                .set({
                                    latitude: this.randomLatLng.lat(),
                                    longitude: this.randomLatLng.lng(),
                                    roundInfo:
                                        this.randomFeatureProperties || null,
                                    warning: this.isVisibleDialog,
                                });
                        }
                    }
                }
            } else {
                this.loadStreetView();
            }
        },
        resetLocation() {
            const service = new google.maps.StreetViewService();
            service.getPanorama(
                {
                    location: this.randomLatLng,
                    preference: 'nearest',
                    radius: 50,
                    source: 'outdoor',
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
                panControl: true,
            });
            this.panorama.setPano(data.location.pano);
            this.panorama.setPov({
                heading: 270,
                pitch: 0,
            });
            this.panorama.setZoom(0);
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
                        if (this.mode === GAME_MODE.COUNTRY) {
                            this.$refs.mapContainer.selectRandomLocation(
                                getRandomCountry()
                            );
                        } else {
                            // Set a random location if the player didn't select a location in time
                            this.$refs.mapContainer.selectRandomLocation(
                                this.getRandomLatLng().position
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
            this.overlay = true;
        },
        goToNextRound() {
            // Reset
            this.randomLatLng = null;
            this.country = null;
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
                this.loadStreetView();
                if (!this.multiplayer && this.timeLimitation != 0) {
                    this.endTime = new Date();
                    this.endTime.setSeconds(
                        this.endTime.getSeconds() + this.timeLimitation
                    );
                    this.startTimer();
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
            this.room.off();
            this.room.remove();

            this.$router.push('/history');
        },
        finishGame() {
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
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        this.panorama = new google.maps.StreetViewPanorama(
            document.getElementById('street-view')
        );
        if (this.playerNumber == 1 || !this.multiplayer) {
            this.loadStreetView();
        }

        if (!this.multiplayer) {
            this.$refs.mapContainer.startNextRound();

            if (this.timeLimitation != 0) {
                if (!this.hasTimerStarted) {
                    this.endTime = new Date();
                    this.endTime.setSeconds(
                        this.endTime.getSeconds() + this.timeLimitation
                    );
                    this.startTimer();
                    this.hasTimerStarted = true;
                }
            }
        } else {
            // Set a room name if it's null to detect when the user refresh the page
            if (this.roomName == null) {
                this.roomName = 'defaultRoomName';
            }
            this.room = firebase.database().ref(this.roomName);
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
                            this.randomLat = snapshot
                                .child(
                                    'streetView/round' +
                                        this.round +
                                        '/latitude'
                                )
                                .val();
                            this.randomLng = snapshot
                                .child(
                                    'streetView/round' +
                                        this.round +
                                        '/longitude'
                                )
                                .val();
                            this.randomLatLng = new google.maps.LatLng(
                                this.randomLat,
                                this.randomLng
                            );
                            this.country = snapshot
                                .child(
                                    'streetView/round' + this.round + '/country'
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
                                this.randomLat,
                                this.randomLng
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
                                this.endTime = new Date();
                                this.endTime.setSeconds(
                                    this.endTime.getSeconds() +
                                        this.timeLimitation
                                );
                                this.startTimer();
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
                    }
                } else {
                    // Force the players to exit the game when 'Active' is removed
                    this.exitGame();
                }
            });

            window.addEventListener('popstate', () => {
                // Remove the room when the player pressed the back button on browser
                this.room.child('active').remove();
                this.room.off();
            });

            window.addEventListener('beforeunload', () => {
                // Remove the room when the player refreshes the window
                this.room.child('active').remove();
            });

            // Force to exit the game if it's still the name this is set programmatically
            if (this.roomName == 'defaultRoomName') {
                this.room.child('active').remove();
            }
        }
    },
};
</script>

<style scoped lang="scss">
#game-page {
    position: relative;
    height: 100%;
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
    #game-interface--overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
    }
}

#street-view {
    position: relative;
    min-height: 100%;
    width: 100%;
}

.warning-alert {
    z-index: 1;
    margin-top: 56px;
}
@media (max-width: 450px) {
    #street-view {
        position: fixed;
        min-height: 92%;
        height: 92%;
    }

    #reset-button {
        bottom: 120px;
    }
}
</style>
