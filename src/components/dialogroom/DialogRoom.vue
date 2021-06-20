<template>

    <v-dialog
        v-model="isOpenDialogRoom"
        persistent
        :fullscreen="$viewport.width < 450"
        max-width="800"
    >
        <component
            :is="currentComponent"
            :single-player="singlePlayer"
            :current-component="currentComponent"
            :room="room"
            :room-name="roomName"
            @cancel="cancel"
        />
    </v-dialog>
    
</template>

<script>

import CardRoomName from '@/components/dialogroom/card/CardRoomName';
import CardRoomSettings from '@/components/dialogroom/card/CardRoomSettings';
import CardRoomPlayerName from '@/components/dialogroom/card/CardRoomPlayerName';
import { mapState, mapActions, mapMutations } from 'vuex';
import { GAME_MODE } from '../../constants';
import { getMaxDistanceBbox } from '../../utils';
import {SETTINGS_SET_GEOJSON} from '../../store/mutation-types';

export default {
    components: {
        roomName: CardRoomName,
        settings: CardRoomSettings,
        playerName: CardRoomPlayerName,
    },
    data() {
        return {
            name: null,
        };
    },
    computed: {
        ...mapState('settingsStore', ['isOpenDialogRoom', 'currentComponent', 'singlePlayer', 'loadingGeoJson', 'placeGeoJson', "room", "roomName"]),
    },
    mounted() {
        // if (!this.singlePlayer && this.$route.params.roomName) {
        //     this.searchRoom(this.$route.params.roomName);
        //     this.dialogRoom = true;
        // }
    },
    methods: {
        ...mapActions('settingsStore', ['loadPlaceGeoJSON', 'closeDialogRoom']),
        ...mapMutations('settingsStore', [SETTINGS_SET_GEOJSON]),
        // searchRoom(roomName, after) {
        //     if (roomName == '') {
        //         this.errorMessage = this.$t('DialogRoom.invalidRoomName');
        //     } else {
        //         this.room = firebase.database().ref(roomName);

        //         // Save room name so it can be used in setPlayerName()
        //         this.roomName = roomName;

        //         this.room.once('value', (snapshot) => {
        //             if (snapshot.child('started').val()) {
        //                 this.errorMessage = this.$t(
        //                     'DialogRoom.alreadyStarted'
        //                 );
        //                 return;
        //             }
        //             const numberOfPlayers = snapshot
        //                 .child('playerName')
        //                 .numChildren();
        //             this.playerNumber = numberOfPlayers + 1;

        //             if (numberOfPlayers === 0) {
        //                 // Put the tentative player's name into the room node
        //                 // So that other player can't enter as the first player while the player decide the name and room size
        //                 this.room.child('playerName').update(
        //                     {
        //                         player1: this.$t(
        //                             'CardRoomPlayerName.anonymousPlayerName'
        //                         ),
        //                     },
        //                     (error) => {
        //                         if (!error) {
        //                             // Put the timestamp the room is created so the expired rooms can be removed by cloud function
        //                             this.room.update({
        //                                 createdAt:
        //                                     firebase.database.ServerValue
        //                                         .TIMESTAMP,
        //                             });
        //                             this.firstPlayer = true;
        //                             this.currentComponent = 'settings';
        //                         }
        //                     }
        //                 );
        //             } else {
        //                 // Put other player's tentative name
        //                 this.room
        //                     .child('playerName/player' + this.playerNumber)
        //                     .set(
        //                         this.$t(
        //                             'CardRoomPlayerName.anonymousPlayerName'
        //                         ) + this.playerNumber,
        //                         (error) => {
        //                             if (!error) {
        //                                 this.currentComponent = 'playerName';
        //                             }
        //                         }
        //                     );
        //             }
        //             if (after) {
        //                 after();
        //             }
        //         });
        //     }
        // },
        cancel() {
            this.closeDialogRoom();
        
        },
    },
};
</script>