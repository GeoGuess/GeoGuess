<template>
    <v-dialog
        v-model="dialogRoom"
        persistent
        :fullscreen="$viewport.width < 450"
        max-width="800"
    >
        <template v-slot:activator="{ on }">
            <v-btn
                class="dialog-room__btn"
                rounded
                :color="singlePlayer ? 'primary' : 'secondary'"
                large
                v-on="on"
            >
                {{
                    singlePlayer
                        ? $t('DialogRoom.singlePlayer')
                        : $t('DialogRoom.withFriends')
                }}
            </v-btn>
        </template>
        <component
            :is="currentComponent"
            :single-player="singlePlayer"
            :error-message="errorMessage"
            :place-geo-json="placeGeoJson"
            :loading-geo-json="loadingGeoJson"
            :current-component="currentComponent"
            :room="room"
            :room-name="roomName"
            :first-player="firstPlayer"
            @searchRoom="searchRoom"
            @setPlayerName="setPlayerName"
            @setSettings="setSettings"
            @start="startGame"
            @cancel="cancel"
        />
    </v-dialog>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

import CardRoomName from '@/components/dialogroom/card/CardRoomName';
import CardRoomSettings from '@/components/dialogroom/card/CardRoomSettings';
import CardRoomPlayerName from '@/components/dialogroom/card/CardRoomPlayerName';
import { mapState, mapActions } from 'vuex';
import bbox from '@turf/bbox';
import { GAME_MODE } from '../../constants';
import { getMaxDistanceBbox } from '../../utils';

export default {
    components: {
        roomName: CardRoomName,
        settings: CardRoomSettings,
        playerName: CardRoomPlayerName,
    },
    props: {
        geoJson: {
            default: null,
            type: Object,
        },
        place: {
            default: '',
            type: String,
        },
        singlePlayer: {
            default: false,
            type: Boolean,
        },
    },
    data() {
        return {
            placeGeoJson: null,
            dialogRoom: false,
            errorMessage: '',
            room: null,
            roomName: '',
            name: null,
            currentComponent: this.singlePlayer ? 'settings' : 'roomName',
            timeLimitation: null,
            difficulty: null,
            bboxObj: null,
            loadingGeoJson: false,
            firstPlayer: false,
            mode: GAME_MODE.CLASSIC,
            timeAttack: false,
            zoomControl: true,
            moveControl: true,
            panControl: true,
            countdown: 0,
            scoreMode: null,
            allPanorama: false,
        };
    },
    computed: {
        ...mapState({
            openDialogSinglePlayer: (state) =>
                state.homeStore.openDialogSinglePlayer,
            openDialogMultiPlayer: (state) =>
                state.homeStore.openDialogMultiPlayer,
        }),
    },
    watch: {
        openDialogSinglePlayer(val) {
            if (this.singlePlayer && val) {
                this.dialogRoom = true;
                this.resetSinglePlayer();
            }
        },
        openDialogMultiPlayer(val) {
            if (!this.singlePlayer && val) {
                this.dialogRoom = true;
                this.resetMultiPlayer();
            }
        },
        dialogRoom(val) {
            if (val && this.currentComponent === 'settings') {
                this.loadGeoJSON();
            }
        },
        currentComponent(val) {
            if (val === 'settings' && this.dialogRoom === true) {
                this.loadGeoJSON();
            }
        },
        geoJson(val) {
            this.placeGeoJson = val;
        },
    },
    mounted() {
        if (!this.singlePlayer && this.$route.params.roomName) {
            this.searchRoom(this.$route.params.roomName, () => {
                this.dialogRoom = true;
            });
        }
    },
    methods: {
        ...mapActions(['resetSinglePlayer', 'resetMultiPlayer']),
        loadGeoJSON() {
            if (this.place != null && this.place != '' && !this.geoJson) {
                this.getPlaceGeoJSON(this.place);
            } else {
                if (this.geoJson != '') {
                    this.placeGeoJson = this.geoJson;
                    this.setDifficulty();
                }
            }
        },
        getPlaceGeoJSON(place) {
            if (this.loadingGeoJson) {
                return;
            }
            this.loadingGeoJson = true;
            this.placeGeoJson = null;
            this.axios
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
                        this.placeGeoJson = res.data.features[0];
                        this.setDifficulty();
                    }
                    this.errorMessage = 'No Found Location';
                })
                .finally(() => {
                    this.loadingGeoJson = false;
                });
        },
        searchRoom(roomName, after) {
            if (roomName == '') {
                this.errorMessage = this.$t('DialogRoom.invalidRoomName');
            } else {
                this.room = firebase.database().ref(roomName);

                // Save room name so it can be used in setPlayerName()
                this.roomName = roomName;

                this.room.once('value', (snapshot) => {
                    if (snapshot.child('started').val()) {
                        this.errorMessage = this.$t(
                            'DialogRoom.alreadyStarted'
                        );
                        return;
                    }
                    const numberOfPlayers = snapshot
                        .child('playerName')
                        .numChildren();
                    this.playerNumber = numberOfPlayers + 1;

                    if (numberOfPlayers === 0) {
                        // Put the tentative player's name into the room node
                        // So that other player can't enter as the first player while the player decide the name and room size
                        this.room.child('playerName').update(
                            {
                                player1: this.$t(
                                    'CardRoomPlayerName.anonymousPlayerName'
                                ),
                            },
                            (error) => {
                                if (!error) {
                                    // Put the timestamp the room is created so the expired rooms can be removed by cloud function
                                    this.room.update({
                                        createdAt:
                                            firebase.database.ServerValue
                                                .TIMESTAMP,
                                    });
                                    this.firstPlayer = true;
                                    this.currentComponent = 'settings';
                                }
                            }
                        );
                    } else {
                        // Put other player's tentative name
                        this.room
                            .child('playerName/player' + this.playerNumber)
                            .set(
                                this.$t(
                                    'CardRoomPlayerName.anonymousPlayerName'
                                ) + this.playerNumber,
                                (error) => {
                                    if (!error) {
                                        this.currentComponent = 'playerName';
                                    }
                                }
                            );
                    }
                    if (after) {
                        after();
                    }
                });
            }
        },
        setSettings(
            allPanorama,
            timeLimitation,
            mode,
            timeAttack,
            zoomControl,
            moveControl,
            panControl,
            countdown,
            scoreMode
        ) {
            this.allPanorama = allPanorama;
            this.timeLimitation = timeLimitation;
            this.mode = mode;
            this.timeAttack = timeAttack;
            this.zoomControl = zoomControl;
            this.moveControl = moveControl;
            this.panControl = panControl;
            this.countdown = countdown;
            this.scoreMode = scoreMode;
            if (this.singlePlayer) {
                this.$router.push({
                    name: 'street-view',
                    params: {
                        allPanorama: this.allPanorama,
                        time: this.timeLimitation,
                        difficulty: this.difficulty,
                        placeGeoJson: this.placeGeoJson,
                        modeSelected: mode,
                        bboxObj: this.bboxObj,
                        zoomControl,
                        moveControl,
                        panControl,
                        scoreMode,
                    },
                });
            } else {
                this.room.update(
                    {
                        allPanorama: this.allPanorama,
                        timeLimitation: this.timeLimitation,
                        difficulty: this.difficulty,
                        bbox: this.bboxObj,
                        mode,
                        timeAttack,
                        zoomControl,
                        moveControl,
                        panControl,
                        countdown,
                        scoreMode,
                    },
                    (error) => {
                        if (!error) {
                            this.currentComponent = 'playerName';
                        }
                    }
                );
            }
        },
        setTimeLimitation(timeLimitation) {
            this.timeLimitation = timeLimitation;
        },
        setDifficulty() {
            if (this.placeGeoJson) {
                this.bboxObj = bbox(this.placeGeoJson);

                this.difficulty = getMaxDistanceBbox(this.bboxObj) / 10;
            } else {
                this.difficulty = 2000;
            }
        },
        setPlayerName(playerName) {
            if (playerName === '') {
                playerName = this.$t('CardRoomPlayerName.anonymousPlayerName');
            }
            this.name = playerName;
            this.room
                .child('playerName/player' + this.playerNumber)
                .set(playerName);
        },
        startGame() {
            let gameParams = {};
            if (this.firstPlayer) {
                gameParams = {
                    difficulty: this.difficulty,
                    bboxObj: this.bboxObj,
                    modeSelected: this.mode,
                    timeAttackSelected: this.timeAttack,
                    zoomControl: this.zoomControl,
                    moveControl: this.moveControl,
                    panControl: this.panControl,
                    countdown: this.countdown,
                    allPanorama: this.allPanorama,
                    scoreMode: this.scoreMode,
                };
                // Set flag started
                this.room.child('started').set(true);
                this.startGameMultiplayer(gameParams);
            } else {
                this.room.once('value', (snapshot) => {
                    gameParams = {
                        difficulty: snapshot.child('difficulty').val(),
                        bboxObj: snapshot.child('bbox').val(),
                        modeSelected: snapshot.child('mode').val(),
                        timeAttackSelected: snapshot.child('timeAttack').val(),
                        zoomControl: snapshot.child('zoomControl').val(),
                        moveControl: snapshot.child('moveControl').val(),
                        panControl: snapshot.child('panControl').val(),
                        countdown: snapshot.child('countdown').val(),
                        allPanorama: snapshot.child('allPanorama').val(),
                        scoreMode: snapshot.child('scoreMode').val(),
                    };
                    this.startGameMultiplayer(gameParams);
                });
            }
        },
        startGameMultiplayer(gameParams) {
            // Start the game
            this.$router.push({
                name: 'with-friends',
                params: {
                    ...gameParams,
                    roomName: this.roomName,
                    playerName: this.name,
                    playerNumber: this.playerNumber,
                    placeGeoJson: this.placeGeoJson,
                    multiplayer: true,
                },
            });
        },
        cancel() {
            // Reset
            (this.currentComponent = this.singlePlayer
                ? 'settings'
                : 'roomName'),
                (this.roomName = '');
            this.errorMessage = '';

            this.firstPlayer = false;

            // Remove the room
            this.dialogRoom = false;
            if (this.room != null) {
                if (this.playerNumber == 1) {
                    // Remove the entire node if the player is the first player
                    this.room.remove();
                } else {
                    // Remove only the player's name node if the player isn't the first player
                    this.room
                        .child('playerName/player' + this.playerNumber)
                        .remove();
                }
            }
        },
    },
};
</script>
<style scoped>
.dialog-room__btn {
    width: 40%;
    padding: 0 5em;
    font-size: 1.1rem;
}
</style>
