<template>
    <v-dialog
        persistent
        :fullscreen="$viewport.width < 450"
        v-model="dialogRoom"
        max-width="600"
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
            :errorMessage="errorMessage"
            @searchRoom="searchRoom"
            @setRoomSize="setRoomSize"
            @setTimeLimitation="setTimeLimitation"
            @setPlayerName="setPlayerName"
            @setDifficulty="setDifficulty"
            @cancel="cancel"
        />
    </v-dialog>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import axios from 'axios';

import CardRoomName from '@/components/widgets/card/CardRoomName';
import CardRoomSize from '@/components/widgets/card/CardRoomSize';
import CardRoomTime from '@/components/widgets/card/CardRoomTime';
import CardRoomDifficulty from '@/components/widgets/card/CardRoomDifficulty';
import CardRoomPlayerName from '@/components/widgets/card/CardRoomPlayerName';
import { mapState, mapActions } from 'vuex';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
import bbox from '@turf/bbox';

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
            placeGeoJson: null,
            dialogRoom: false,
            errorMessage: '',
            room: null,
            roomName: '',
            currentComponent: this.singlePlayer ? 'timeLimitation' : 'roomName',
            timeLimitation: null,
            difficulty: null,
            bboxObj: null,
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
    },
    mounted() {
        if (!this.singlePlayer && this.$route.params.roomName) {
            this.dialogRoom = true;
            this.searchRoom(this.$route.params.roomName);
        }
    },
    components: {
        roomName: CardRoomName,
        roomSize: CardRoomSize,
        timeLimitation: CardRoomTime,
        difficulty: CardRoomDifficulty,
        playerName: CardRoomPlayerName,
    },
    methods: {
        ...mapActions(['resetSinglePlayer', 'resetMultiPlayer']),
        getPlaceGeoJSON(place) {
            axios
                .get(
                    `https://nominatim.openstreetmap.org/search/${encodeURIComponent(
                        place
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
                });
            //.catch(() => { this.errorMessage = "No Found Location" })
        },
        searchRoom(roomName) {
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
                                    this.currentComponent = 'roomSize';
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
                });
            }
        },
        setRoomSize(roomSize) {
            this.room.update(
                {
                    size: roomSize,
                },
                (error) => {
                    if (!error) {
                        this.currentComponent = 'timeLimitation';
                    }
                }
            );
        },
        setTimeLimitation(timeLimitation) {
            this.timeLimitation = timeLimitation;
            if (this.place != null && this.place != '' && !this.geoJson) {
                this.getPlaceGeoJSON(this.place);
            } else {
                if (this.geoJson != '') {
                    this.placeGeoJson = this.geoJson;
                    this.setDifficulty();
                }
            }
        },
        setDifficulty() {
            if (this.placeGeoJson) {
                this.bboxObj = bbox(this.placeGeoJson);
                const bboxPlace = Object.values(this.bboxObj);
                const from = point(bboxPlace.slice(0, 2));
                const to = point(bboxPlace.slice(2, 4));

                const distanceMax = distance(from, to);

                this.difficulty = distanceMax / 10;
            } else {
                this.difficulty = 2000;
            }

            if (this.singlePlayer) {
                this.$router.push({
                    name: 'street-view',
                    params: {
                        time: this.timeLimitation,
                        difficulty: this.difficulty,
                        placeGeoJson: this.placeGeoJson,
                        bboxObj: this.bboxObj,
                    },
                });
            } else {
                this.room.update(
                    {
                        timeLimitation: this.timeLimitation,
                        difficulty: this.difficulty,
                        bbox: this.bboxObj,
                    },
                    (error) => {
                        if (!error) {
                            this.currentComponent = 'playerName';
                        }
                    }
                );
            }
        },
        setPlayerName(playerName) {
            this.room
                .child('playerName/player' + this.playerNumber)
                .set(playerName, (error) => {
                    if (!error) {
                        // Start the game
                        this.$router.push({
                            name: 'with-friends',
                            params: {
                                roomName: this.roomName,
                                playerName,
                                playerNumber: this.playerNumber,
                                placeGeoJson: this.placeGeoJson,
                                multiplayer: true,
                                bboxObj: this.bboxObj,
                            },
                        });
                    }
                });
        },
        cancel() {
            // Reset
            (this.currentComponent = this.singlePlayer
                ? 'timeLimitation'
                : 'roomName'),
                (this.roomName = '');
            this.errorMessage = '';

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
