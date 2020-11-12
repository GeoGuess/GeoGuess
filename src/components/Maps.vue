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
                v-if="printMapFull && !isExitButtonVisible"
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
        <div id="map"></div>
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
                    !isExitButtonVisible &&
                    ($viewport.width > 450 || isMakeGuessButtonClicked)
                "
                @click="resetLocation"
            >
                {{ $t('Maps.reset') }}
            </button>
            <button
                id="guess-button"
                :disabled="
                    selectedLatLng == null ||
                    isGuessButtonClicked ||
                    (!!this.room && !isReady)
                "
                v-if="
                    !isNextButtonVisible &&
                    !isSummaryButtonVisible &&
                    !isExitButtonVisible &&
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

        <div>
            <button
                id="summary-button"
                v-bind:class="{ 'w-50': !this.room }"
                v-if="isExitButtonVisible"
                @click="finishGame"
            >
                {{ $t('Maps.exit') }}
            </button>

            <button
                v-if="isExitButtonVisible && !this.room"
                id="play-again-button"
                class="w-50"
                @click="playAgain"
            >
                {{ $t('Maps.playAgain') }}
            </button>
        </div>

        <DialogSummary
            :dialogSummary="dialogSummary"
            :summaryTexts="summaryTexts"
            :score="score"
            :playerName="playerName"
            :points="points"
            :game="game"
            :multiplayer="!!this.room"
            @view-details="viewDetails"
            @finishGame="finishGame"
        />
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

import DialogSummary from '@/components/DialogSummary';
import DetailsMap from '@/components/game/DetailsMap';

const google = window.google;

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
    ],
    components: {
        DialogSummary,
        DetailsMap,
    },
    data() {
        return {
            markers: [],
            polylines: [],
            summaryTexts: [],
            strokeColors: [
                '#F44336',
                '#76FF03',
                '#FFEB3B',
                '#FF4081',
                '#18FFFF',
            ],
            map: null,
            room: null,
            selectedLatLng: null,
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
            isExitButtonVisible: false,
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
                this.room.child('guess/player' + this.playerNumber).set({
                    latitude: this.selectedLatLng.lat(),
                    longitude: this.selectedLatLng.lng(),
                });
            } else {
                // Put the marker on the random location
                this.putMarker(this.randomLatLng, {
                    icon:
                        window.location.origin + '/img/icons/favicon-16x16.png',
                });
                // Show the polyline
                this.drawPolyline(this.selectedLatLng, 1);

                this.setInfoWindow();
                this.printMapFull = true;
                if (this.round >= 5) {
                    this.isSummaryButtonVisible = true;
                } else {
                    this.isNextButtonVisible = true;
                }
                this.$emit('showResult');
            }
            // Clear the event
            google.maps.event.clearListeners(this.map, 'click');

            // Diable guess button and opacity of the map
            this.isGuessButtonClicked = true;
            this.isSelected = true;

            // Turn off the flag before the next button appears
            this.isNextStreetViewReady = false;
        },
        selectRandomLocation(randomLatLng) {
            if (this.selectedLatLng == null) {
                // set a random location if the player didn't select in time
                this.selectedLatLng = randomLatLng;
                this.removeMarkers();
                this.putMarker(this.selectedLatLng);
            }
            this.selectLocation();
        },
        resetLocation() {
            this.$emit('resetLocation');
        },
        putMarker(position, info) {
            var marker = new google.maps.Marker({
                ...info,
                position: position,
                map: this.map,
            });
            this.markers.push(marker);
        },
        removeMarkers() {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers = [];
        },
        calculateDistance() {
            this.distance = Math.floor(
                google.maps.geometry.spherical.computeDistanceBetween(
                    this.randomLatLng,
                    this.selectedLatLng
                )
            );
            if (this.distance < 50) {
                this.point = 5000;
            } else {
                this.point = Math.round(
                    5000 * Math.exp(-(this.distance / 1000 / this.difficulty))
                );

                if (this.point > 5000) {
                    this.point = 5000;
                } else if (this.point < 0) {
                    this.point = 0;
                }
            }

            // Save the distance into firebase
            if (this.room) {
                this.room
                    .child('round' + this.round + '/player' + this.playerNumber)
                    .set({
                        latitude: this.selectedLatLng.lat(),
                        longitude: this.selectedLatLng.lng(),
                        distance: this.distance,
                        points: this.point,
                    });
            } else {
                this.game.rounds.push({
                    guess: this.selectedLatLng,
                    position: this.randomLatLng,
                    distance: this.distance,
                    points: this.point,
                });
            }

            this.$emit('calculateDistance', this.distance, this.point);
        },
        setInfoWindow(
            playerName = null,
            distance = this.distance,
            points = this.point,
            endGame = false
        ) {
            let dataToDisplay = '';
            if (playerName !== null)
                dataToDisplay += '<b>' + playerName + '</b>' + ' : <br/>';

            if (distance < 1000) {
                dataToDisplay +=
                    '<b>' +
                    this.$t('Maps.infoWindow.Distance') +
                    ' : </b>' +
                    distance +
                    ' m';
            } else {
                dataToDisplay +=
                    '<b>' +
                    this.$t('Maps.infoWindow.Distance') +
                    ' : </b>' +
                    distance / 1000 +
                    ' km';
            }

            dataToDisplay +=
                '<br/><b>' +
                this.$t('Maps.infoWindow.Points') +
                ' : </b>' +
                points;

            var infoWindow = new google.maps.InfoWindow({
                content: dataToDisplay,
            });
            infoWindow.open(
                this.map,
                this.markers[
                    playerName || endGame ? this.markers.length - 1 : 0
                ]
            );
        },
        drawPolyline(selectedLatLng, i = 0, randomLatLng = this.randomLatLng) {
            var polyline = new google.maps.Polyline({
                path: [selectedLatLng, randomLatLng],
                strokeColor: this.strokeColors[i % this.strokeColors.length],
            });
            polyline.setMap(this.map);
            this.polylines.push(polyline);
        },
        removePolylines() {
            for (var i = 0; i < this.polylines.length; i++) {
                this.polylines[i].setMap(null);
            }
        },
        startNextRound() {
            this.map.addListener('click', (e) => {
                // Clear the previous marker when clicking the map
                this.removeMarkers();

                // Show the new marker
                this.putMarker(e.latLng);

                // Save latLng
                this.selectedLatLng = e.latLng;
            });
        },
        goToNextRound() {
            // Reset
            this.selectedLatLng = null;
            this.isGuessButtonClicked = false;
            this.isSelected = false;
            this.isNextButtonVisible = false;

            if (this.$viewport.width < 450) {
                // Hide the map if the player is on mobile
                this.hideMap();
            }

            this.printMapFull = false;
            this.removeMarkers();
            this.removePolylines();

            // Replace the streetview with the next one
            this.$emit('goToNextRound');
        },
        finishGame() {
            this.isExitButtonVisible = true;
            this.dialogSummary = false;
            if (this.room)
                this.room
                    .child('isGameDone/player' + this.playerNumber)
                    .set(true);
            this.$emit('finishGame');
        },
        viewDetails() {
            this.removeMarkers();
            this.removePolylines();
            this.isSummaryButtonVisible = false;
            this.dialogSummary = false;
            this.isExitButtonVisible = true;
            if (!this.room) {
                this.game.rounds.forEach(
                    ({ guess, position, distance, points }) => {
                        this.putMarker(position, {
                            icon:
                                window.location.origin +
                                '/img/icons/favicon-16x16.png',
                        });
                        this.drawPolyline(guess, 0, position);
                        this.putMarker(guess);
                        this.setInfoWindow(null, distance, points, true);
                    }
                );
            } else {
                this.room.on('value', (snapshot) => {
                    // Check if the room is already removed
                    if (snapshot.hasChild('active')) {
                        snapshot.child('streetView').forEach((round) => {
                            let lat = round.child('latitude').val();
                            let lng = round.child('longitude').val();
                            let latLng = new google.maps.LatLng({
                                lat: lat,
                                lng: lng,
                            });
                            this.putMarker(latLng, {
                                icon:
                                    window.location.origin +
                                    '/img/icons/favicon-16x16.png',
                            });
                            let i = 0;
                            snapshot.child('playerName').forEach((player) => {
                                let playerName = player.val();
                                let latitudeG = snapshot
                                    .child(
                                        round.key +
                                            '/' +
                                            player.key +
                                            '/latitude'
                                    )
                                    .val();
                                let longitudeG = snapshot
                                    .child(
                                        round.key +
                                            '/' +
                                            player.key +
                                            '/longitude'
                                    )
                                    .val();
                                let distance = snapshot
                                    .child(
                                        round.key +
                                            '/' +
                                            player.key +
                                            '/distance'
                                    )
                                    .val();
                                let points = snapshot
                                    .child(
                                        round.key + '/' + player.key + '/points'
                                    )
                                    .val();
                                let latLngG = new google.maps.LatLng({
                                    lat: latitudeG,
                                    lng: longitudeG,
                                });
                                this.drawPolyline(latLngG, i, latLng);
                                this.putMarker(latLngG, {
                                    label:
                                        playerName && playerName.length > 0
                                            ? playerName[0].toUpperCase()
                                            : '',
                                });
                                this.setInfoWindow(
                                    playerName,
                                    distance,
                                    points
                                );

                                i++;
                            });
                        });
                    }
                });
            }
        },
        centerOnBbox() {
            if (this.map && this.bbox) {
                this.map.fitBounds({
                    east: this.bbox[2],
                    north: this.bbox[3],
                    south: this.bbox[1],
                    west: this.bbox[0],
                });
            }
        },
    },
    watch: {
        bbox() {
            this.centerOnBbox();
        },
    },
    mounted() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 37.86926, lng: -122.254811 },
            zoom: 1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        });
        if (this.bbox) {
            this.map.fitBounds({
                east: this.bbox[2],
                north: this.bbox[3],
                south: this.bbox[1],
                west: this.bbox[0],
            });
        }

        this.game.timeLimitation = this.timeLimitation;
        this.game.difficulty = this.difficulty;

        if (this.roomName) {
            this.room = firebase.database().ref(this.roomName);
            this.room.on('value', (snapshot) => {
                // Check if the room is already removed
                if (snapshot.hasChild('active')) {
                    // Allow players to move on to the next round when every players guess locations
                    if (
                        snapshot.child('guess').numChildren() ==
                        snapshot.child('size').val()
                    ) {
                        this.game.timeLimitation = this.timeLimitation;

                        this.$emit('showResult');

                        // Put markers and draw polylines on the map
                        var i = 0;
                        var j = 1;
                        const players = {};
                        snapshot.child('guess').forEach((childSnapshot) => {
                            var lat = childSnapshot.child('latitude').val();
                            var lng = childSnapshot.child('longitude').val();
                            var latLng = new google.maps.LatLng({
                                lat: lat,
                                lng: lng,
                            });

                            var playerName = snapshot
                                .child('playerName')
                                .child(childSnapshot.key)
                                .val();
                            var distance = snapshot
                                .child(
                                    'round' +
                                        this.round +
                                        '/player' +
                                        j +
                                        '/distance'
                                )
                                .val();
                            var points = snapshot
                                .child(
                                    'round' +
                                        this.round +
                                        '/player' +
                                        j +
                                        '/points'
                                )
                                .val();
                            players[playerName] = {
                                guess: latLng,
                                distance,
                                points,
                            };
                            this.drawPolyline(latLng, i);
                            this.putMarker(latLng, {
                                label:
                                    playerName && playerName.length > 0
                                        ? playerName[0].toUpperCase()
                                        : '',
                            });
                            this.setInfoWindow(playerName, distance, points);
                            i++;
                            j++;
                        });

                        this.game.rounds.push({
                            position: this.randomLatLng,
                            players,
                        });
                        this.putMarker(this.randomLatLng, {
                            icon:
                                window.location.origin +
                                '/img/icons/favicon-16x16.png',
                        });

                        this.printMapFull = true;
                        // Remove guess node every time the round is done
                        this.room.child('guess').remove();

                        if (this.round >= 5) {
                            // Show summary button
                            snapshot
                                .child('finalPoints')
                                .forEach((childSnapshot) => {
                                    var playerName = snapshot
                                        .child('playerName')
                                        .child(childSnapshot.key)
                                        .val();
                                    var finalScore = snapshot
                                        .child('finalScore')
                                        .child(childSnapshot.key)
                                        .val();
                                    var finalPoints = childSnapshot.val();
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
