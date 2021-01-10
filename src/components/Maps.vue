<template>
    <div
        id="container-map"
        :class="[
            ($viewport.width >= 450 && (activeMap || pinActive)) ||
            isMakeGuessButtonClicked
                ? 'container-map--active'
                : '',
            printMapFull ? 'container-map--full' : '',
            `container-map--size-${size}`,
        ]"
        @mouseover="activeMap = true"
        @mouseleave="activeMap = false"
    >
        <div class="container-map_details">
            <DetailsMap
                v-if="printMapFull"
                :properties="randomFeatureProperties"
            />
        </div>
        <div class="container-map_controls">
            <div class="container-map_btns">
                <v-btn
                    fab
                    x-small
                    @click="size--"
                    :disabled="size < 2"
                    id="btnDown"
                >
                    <v-icon dark>mdi-arrow-bottom-left</v-icon>
                </v-btn>

                <v-btn
                    fab
                    x-small
                    @click="size++"
                    :disabled="size > 3"
                    id="btnUp"
                >
                    <v-icon dark>mdi-arrow-top-right</v-icon>
                </v-btn>

                <v-btn fab x-small @click="pinActive = !pinActive" id="btnPin">
                    <v-icon dark>mdi-pin{{ pinActive ? '-off' : '' }}</v-icon>
                </v-btn>
            </div>
        </div>
        <v-btn
            id="hide-map-button"
            v-if="
                $viewport.width < 450 &&
                !isGuessButtonClicked &&
                isMakeGuessButtonClicked
            "
            fab
            x-small
            color="red"
            @click="hideMap"
        >
            <v-icon color="white">mdi-close</v-icon>
        </v-btn>
        <Map
            id="map"
            v-if="this.mode === 'classic'"
            :bbox="bbox"
            ref="map"
            @setSeletedPos="setSeletedPos"
        />
        <MapCountries
            id="map"
            v-if="this.mode === 'country'"
            :country="country"
            :bbox="bbox"
            ref="map"
            @setSeletedPos="setSeletedPos"
        />
        <button
            id="make-guess-button"
            v-if="
                $viewport.width < 450 &&
                !isGuessButtonClicked &&
                !isMakeGuessButtonClicked
            "
            @click="showMap"
        >
            {{ $t('Maps.makeGuess') }}
        </button>
        <div>
            <button
                id="reset-button"
                :disabled="isGuessButtonClicked || (!!this.room && !isReady)"
                v-if="
                    !isNextButtonVisible &&
                    !isSummaryButtonVisible &&
                    ($viewport.width > 450 || isMakeGuessButtonClicked)
                "
                @click="resetLocation"
            >
                {{ $t('Maps.reset') }}
            </button>
            <button
                id="guess-button"
                :disabled="
                    selectedPos == null ||
                    isGuessButtonClicked ||
                    (!!this.room && !isReady)
                "
                v-if="
                    !isNextButtonVisible &&
                    !isSummaryButtonVisible &&
                    ($viewport.width > 450 || isMakeGuessButtonClicked)
                "
                @click="selectLocation"
            >
                {{ $t('Maps.guess') }}
            </button>
        </div>
        <button
            id="next-button"
            :disabled="!isNextButtonEnabled"
            :style="{
                backgroundColor: isNextButtonEnabled ? '#F44336' : '#B71C1C',
            }"
            v-if="isNextButtonVisible"
            @click="goToNextRound"
        >
            {{ $t('Maps.nextRound') }}
        </button>
        <button
            id="summary-button"
            v-if="isSummaryButtonVisible"
            @click="dialogSummary = true"
        >
            {{ $t('Maps.viewSummary') }}
        </button>

        <DialogSummary
            :dialogSummary="dialogSummary"
            :summaryTexts="summaryTexts"
            :score="score"
            :playerName="playerName"
            :points="points"
            :game="game"
            :multiplayer="!!this.room"
            @finishGame="finishGame"
            @playAgain="playAgain"
        />
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

import DialogSummary from '@/components/DialogSummary';
import DetailsMap from '@/components/game/DetailsMap';
import Map from '@/components/map/Map';
import MapCountries from '@/components/map/MapCountries';
import { GAME_MODE } from '../constants';
import { getSelectedPos } from '../utils';

export default {
    props: [
        'randomLatLng',
        'randomFeatureProperties',
        'roomName',
        'playerNumber',
        'playerName',
        'isReady',
        'round',
        'score',
        'points',
        'timeLimitation',
        'difficulty',
        'bbox',
        'mode',
        'country',
        'timeAttack',
        'nbRound',
    ],
    components: {
        DialogSummary,
        DetailsMap,
        Map,
        MapCountries,
    },
    data() {
        return {
            summaryTexts: [],
            room: null,
            selectedPos: null,
            distance: null,
            point: null,
            isGuessButtonClicked: false,
            isMakeGuessButtonClicked: false,
            isSelected: false,
            isNextStreetViewReady: false,
            isNextButtonVisible: false,
            isSummaryButtonVisible: false,
            dialogSummary: false,
            activeMap: false,
            size: 2,
            pinActive: false,
            printMapFull: false,
            game: {
                multiplayer: !!this.roomName,
                date: new Date(),
                rounds: [],
            },
        };
    },
    computed: {
        isNextButtonEnabled() {
            if (this.playerNumber == 1 || !this.room) {
                return true;
            } else {
                if (this.isNextStreetViewReady == true) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    },
    methods: {
        setSeletedPos(pos) {
            this.selectedPos = pos;
        },
        playAgain() {
            window.location.reload();
        },
        showMap() {
            this.isMakeGuessButtonClicked = true;
        },
        hideMap() {
            this.isMakeGuessButtonClicked = false;
        },
        selectLocation() {
            this.calculateDistance();

            if (this.room) {
                // Save the selected location into database
                // So that it uses for putting the markers and polylines
                this.room
                    .child('guess/player' + this.playerNumber)
                    .set(getSelectedPos(this.selectedPos, this.mode));
            } else {
                // Put the marker on the random location
                this.$refs.map.putMarker(this.randomLatLng, true);
                // Show the polyline
                this.$refs.map.drawPolyline(
                    this.selectedPos,
                    1,
                    this.randomLatLng
                );

                this.$refs.map.setInfoWindow(
                    null,
                    this.distance,
                    this.point,
                    false,
                    this.setSeletedPos
                );
                this.$refs.map.fitBounds();
                this.printMapFull = true;
                if (this.round >= this.nbRound) {
                    this.isSummaryButtonVisible = true;
                } else {
                    this.isNextButtonVisible = true;
                }
                this.$emit('showResult');
            }
            // Clear the event
            this.$refs.map.removeListener();

            // Diable guess button and opacity of the map
            this.isGuessButtonClicked = true;
            this.isSelected = true;

            // Turn off the flag before the next button appears
            this.isNextStreetViewReady = false;
        },
        selectRandomLocation(randomLatLng) {
            if (this.selectedPos === null) {
                // set a random location if the player didn't select in time
                this.selectedPos = randomLatLng;
                this.$refs.map.removeMarkers();
                this.$refs.map.putMarker(this.selectedPos);
            }
            this.selectLocation();
        },
        resetLocation() {
            this.$emit('resetLocation');
        },
        calculateDistance() {
            if (this.mode === GAME_MODE.COUNTRY) {
                this.point = +(this.country === this.selectedPos);
                this.$emit('calculateDistance', null, this.point);
            } else {
                this.distance = Math.floor(
                    google.maps.geometry.spherical.computeDistanceBetween(
                        this.randomLatLng,
                        this.selectedPos
                    )
                );
                if (this.distance < 50) {
                    this.point = 5000;
                } else {
                    this.point = Math.round(
                        5000 *
                            Math.exp(-(this.distance / 1000 / this.difficulty))
                    );

                    if (this.point > 5000) {
                        this.point = 5000;
                    } else if (this.point < 0) {
                        this.point = 0;
                    }
                }
            }
            // Save the distance into firebase
            if (this.room) {
                this.room
                    .child('round' + this.round + '/player' + this.playerNumber)
                    .set({
                        ...getSelectedPos(this.selectedPos, this.mode),
                        distance: this.distance,
                        points: this.point,
                    });
            } else {
                this.game.rounds.push({
                    guess: this.selectedPos,
                    country: this.country,
                    position: this.randomLatLng,
                    distance: this.distance,
                    points: this.point,
                });
            }

            this.$emit('calculateDistance', this.distance, this.point);
        },
        startNextRound() {
            this.$refs.map.startNextRound();
        },
        goToNextRound() {
            // Reset
            this.selectedPos = null;
            this.isGuessButtonClicked = false;
            this.isSelected = false;
            this.isNextButtonVisible = false;

            if (this.$viewport.width < 450) {
                // Hide the map if the player is on mobile
                this.hideMap();
            }

            this.printMapFull = false;
            this.$refs.map.removeMarkers();
            this.$refs.map.removePolylines();

            // Replace the streetview with the next one
            this.$emit('goToNextRound');
        },
        finishGame() {
            this.dialogSummary = false;
            if (this.room)
                this.room
                    .child('isGameDone/player' + this.playerNumber)
                    .set(true);
            this.$emit('finishGame');
        },
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        this.game.timeLimitation = this.timeLimitation;
        this.game.difficulty = this.difficulty;
        this.game.mode = this.mode;
        this.game.timeAttack = this.timeAttack;

        if (this.roomName) {
            this.room = firebase.database().ref(this.roomName);
            this.room.on('value', (snapshot) => {
                // Check if the room is already removed
                if (snapshot.hasChild('active')) {
                    // Allow players to move on to the next round when every players guess locations
                    if (
                        (this.timeAttack &&
                            snapshot.child('guess').numChildren() >= 1 &&
                            snapshot
                                .child('guess')
                                .forEach(
                                    (guess) =>
                                        guess.child('country').val() ===
                                        this.country
                                )) ||
                        snapshot.child('guess').numChildren() ===
                            snapshot.child('size').val()
                    ) {
                        this.game.timeLimitation = this.timeLimitation;

                        this.$emit('showResult');

                        // Put markers and draw polylines on the map
                        let i = 0;
                        let j = 1;
                        let players = {};
                        snapshot.child('guess').forEach((childSnapshot) => {
                            let posGuess;
                            if (this.mode === GAME_MODE.CLASSIC) {
                                const lat = childSnapshot
                                    .child('latitude')
                                    .val();
                                const lng = childSnapshot
                                    .child('longitude')
                                    .val();
                                posGuess = new google.maps.LatLng({
                                    lat: lat,
                                    lng: lng,
                                });
                            } else {
                                posGuess = childSnapshot.child('country').val();
                            }

                            const playerName = snapshot
                                .child('playerName')
                                .child(childSnapshot.key)
                                .val();
                            const distance = snapshot
                                .child(
                                    'round' +
                                        this.round +
                                        '/player' +
                                        j +
                                        '/distance'
                                )
                                .val();
                            const points = snapshot
                                .child(
                                    'round' +
                                        this.round +
                                        '/player' +
                                        j +
                                        '/points'
                                )
                                .val();
                            players[playerName] = {
                                guess: posGuess,
                                distance,
                                points,
                            };
                            this.$refs.map.drawPolyline(
                                posGuess,
                                i,
                                this.randomLatLng
                            );
                            this.$refs.map.putMarker(
                                posGuess,
                                false,
                                playerName && playerName.length > 0
                                    ? playerName[0].toUpperCase()
                                    : ''
                            );
                            this.$refs.map.setInfoWindow(
                                playerName,
                                distance,
                                points,
                                false,
                                posGuess
                            );
                            i++;
                            j++;
                        });
                        this.$refs.map.fitBounds();
                        this.game.rounds.push({
                            position: {
                                ...this.randomLatLng.toJSON(),
                                country: this.country,
                            },
                            players,
                        });
                        this.$refs.map.putMarker(this.randomLatLng, true);

                        this.printMapFull = true;
                        // Remove guess node every time the round is done
                        this.room.child('guess').remove();

                        if (this.round >= this.nbRound) {
                            // Show summary button
                            snapshot
                                .child('finalPoints')
                                .forEach((childSnapshot) => {
                                    const playerName = snapshot
                                        .child('playerName')
                                        .child(childSnapshot.key)
                                        .val();
                                    const finalScore = snapshot
                                        .child('finalScore')
                                        .child(childSnapshot.key)
                                        .val();
                                    const finalPoints = childSnapshot.val();
                                    this.summaryTexts.push({
                                        playerName: playerName,
                                        finalScore: finalScore,
                                        finalPoints: finalPoints,
                                    });
                                });

                            this.summaryTexts.sort(
                                (a, b) =>
                                    parseInt(b.finalPoints) -
                                    parseInt(a.finalPoints)
                            );

                            this.isSummaryButtonVisible = true;
                        } else {
                            // Show next button
                            this.isNextButtonVisible = true;
                        }
                    }

                    // Allow other players to move on to the next round when the next street view is set
                    if (
                        snapshot.child('streetView').numChildren() ==
                        this.round + 1
                    ) {
                        this.isNextStreetViewReady = true;
                    }
                }
            });
        }
    },
};
</script>

<style scoped lang="scss">
#container-map {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 5px;
    left: 10px;
    z-index: 3;
    opacity: 0.7;
    width: var(--width);
    height: var(--height);
    z-index: 3;
    --aspect-ratio: 1.25;
    --inactive-width: 16vw;
    --active-width: 30vw;
    --active-height: calc(var(--active-width) / var(--aspect-ratio));
    --inactive-height: calc(var(--inactive-width) / var(--aspect-ratio));
    --height: var(--inactive-height);
    --width: var(--inactive-width);
    max-width: 100%;
    max-height: calc(100% - 150px);
    transition: 0.3s;
    #map {
        width: 100%;
        height: 100%;
    }

    &.container-map--size-1 {
        --active-width: 16vw;
    }
    &.container-map--size-3 {
        --active-width: 45vw;
    }
    &.container-map--size-4 {
        --active-width: 65vw;
    }
    &.container-map--active {
        opacity: 1;
        --width: var(--active-width);
        --height: var(--active-height);
        .container-map_controls {
            display: flex;
        }
    }
    &.container-map--full {
        transition: none;
        opacity: 1;
        --active-width: 65vw;
        --inactive-width: 65vw;
        position: relative;
        margin: auto;
        .container-map_controls {
            display: none;
        }
        .container-map_details {
            display: block;
        }
    }

    .container-map_details {
        display: none;
    }
    .container-map_controls {
        .container-map_btns {
            background-color: rgba(33, 33, 33);
            padding: 0.2rem;
            border-top-left-radius: 5%;
            border-top-right-radius: 5%;
        }
        button {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0 0.5rem;
        }
        display: flex;
        flex-direction: row-reverse;
    }
}

#make-guess-button,
#guess-button,
#next-button,
#summary-button,
#reset-button,
#play-again-button {
    border: none;
    border-radius: 5px;
    opacity: 0.8;
    color: white;
    font-size: 16px;
    text-decoration: none;
    text-align: center;
    padding: 10px 0;
}

#make-guess-button,
#guess-button {
    width: 75%;
}

#reset-button {
    width: 25%;
    background-color: #ff5e5e;
}

#next-button,
#summary-button:not(.w-50) {
    width: 100%;
}
button.w-50 {
    width: 50%;
}
#make-guess-button,
#guess-button {
    background-color: #212121;
}

#guess-button:hover,
#reset-button {
    opacity: 1;
}

#play-again-button {
    background-color: #43b581;
}

#next-button,
#summary-button {
    background-color: #f44336;
}

@media (max-width: 750px) {
    #container-map {
        --inactive-width: 25vw;

        &.container-map--size-1 {
            --active-width: 25vw;
        }
    }
}

@media (max-width: 450px) {
    #container-map {
        display: flex;
        flex-direction: column;
        .container-map_controls {
            display: none;
        }
        #map {
            display: none;
        }
        &.container-map--active #map {
            display: block;
        }

        &.container-map--active .container-map_controls {
            display: none;
        }
        bottom: 0;
        width: 95%;
        &.container-map--active {
            height: 30vh;
        }
        &.container-map--full {
            position: absolute;
            --width: 100%;
            height: calc(100% - 64px);
            bottom: 0;
            margin: 0;
            max-height: 100%;
        }
    }
    #make-guess-button,
    #next-button,
    #summary-button {
        bottom: 0;
        width: 100%;
    }
    #guess-button {
        width: 75%;
    }

    #hide-map-button {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 4;
    }
}
</style>
