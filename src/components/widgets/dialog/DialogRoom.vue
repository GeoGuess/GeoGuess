<template>
    <v-dialog
        persistent
        :fullscreen="$viewport.width < 450"
        v-model="dialogRoom"
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
            :singlePlayer="singlePlayer"
            :errorMessage="errorMessage"
            :placeGeoJson="placeGeoJson"
            :loadingGeoJson="loadingGeoJson"
            :currentComponent="currentComponent"
            @searchRoom="searchRoom"
            @setPlayerName="setPlayerName"
            @setSettings="setSettings"
            @cancel="cancel"
        />
    </v-dialog>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

import CardRoomName from '@/components/widgets/card/CardRoomName';
import CardRoomSettings from '@/components/widgets/card/CardRoomSettings';
import CardRoomPlayerName from '@/components/widgets/card/CardRoomPlayerName';
import { mapState, mapActions } from 'vuex';
import bbox from '@turf/bbox';
import { GAME_MODE } from '../../../constants';
import { getMaxDistanceBbox } from '../../../utils';

export default {
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
            roomSize: 2,
            placeGeoJson: null,
            dialogRoom: false,
            errorMessage: '',
            room: null,
            roomName: '',
            currentComponent: this.singlePlayer ? 'settings' : 'roomName',
            timeLimitation: null,
            difficulty: null,
            bboxObj: null,
            loadingGeoJson: false,
            firstPlayer: false,
            mode: GAME_MODE.CLASSIC,
            timeAttack: false,
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
    components: {
        roomName: CardRoomName,
        settings: CardRoomSettings,
        playerName: CardRoomPlayerName,
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
                    var numberOfPlayers = snapshot
                        .child('playerName')
                        .numChildren();
                    this.playerNumber = numberOfPlayers + 1;

                    if (numberOfPlayers == 0) {
                        // Put the tentative player's name into the room node
                        // So that other player can't enter as the first player while the player decide the name and room size
                        this.room.child('playerName').update(
                            {
                                player1: 'player1',
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
                    } else if (
                        !snapshot.hasChild('size') ||
                        !snapshot.hasChild('streetView')
                    ) {
                        // Prevent other players from getting into the room earlier than the first player
                        this.errorMessage = this.$t('DialogRoom.inProgress');
                    } else if (
                        numberOfPlayers >= snapshot.child('size').val()
                    ) {
                        this.errorMessage = this.$t('DialogRoom.roomIsFull');
                    } else {
                        // Put other player's tentative name
                        this.room
                            .child('playerName/player' + this.playerNumber)
                            .set('player' + this.playerNumber, (error) => {
                                if (!error) {
                                    this.currentComponent = 'playerName';
                                }
                            });
                    }
                    if (after) {
                        after();
                    }
                });
            }
        },
        setSettings(timeLimitation, mode, roomSize, timeAttack) {
            this.timeLimitation = timeLimitation;
            this.roomSize = roomSize;
            this.mode = mode;
            this.timeAttack = timeAttack;
            if (this.singlePlayer) {
                this.$router.push({
                    name: 'street-view',
                    params: {
                        time: this.timeLimitation,
                        difficulty: this.difficulty,
                        placeGeoJson: this.placeGeoJson,
                        modeSelected: mode,
                        bboxObj: this.bboxObj,
                    },
                });
            } else {
                this.room.update(
                    {
                        timeLimitation: this.timeLimitation,
                        difficulty: this.difficulty,
                        bbox: this.bboxObj,
                        mode,
                        size: this.roomSize,
                        timeAttack,
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
            this.room
                .child('playerName/player' + this.playerNumber)
                .set(playerName, (error) => {
                    if (!error) {
                        let gameParams = {};
                        if (this.firstPlayer) {
                            gameParams = {
                                difficulty: this.difficulty,
                                bboxObj: this.bboxObj,
                                modeSelected: this.mode,
                                timeAttackSelected: this.timeAttack,
                            };
                            this.startGameMultiplayer(playerName, gameParams);
                        } else {
                            this.room.once('value', (snapshot) => {
                                gameParams = {
                                    difficulty: snapshot
                                        .child('difficulty')
                                        .val(),
                                    bboxObj: snapshot.child('bbox').val(),
                                    modeSelected: snapshot.child('mode').val(),
                                    timeAttackSelected: snapshot
                                        .child('timeAttack')
                                        .val(),
                                };
                                this.startGameMultiplayer(
                                    playerName,
                                    gameParams
                                );
                            });
                        }
                    }
                });
        },
        startGameMultiplayer(playerName, gameParams) {
            // Start the game
            this.$router.push({
                name: 'with-friends',
                params: {
                    ...gameParams,
                    roomName: this.roomName,
                    playerName,
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
