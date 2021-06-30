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
import { mapState, mapActions } from 'vuex';

export default {
    components: {
        roomName: CardRoomName,
        settings: CardRoomSettings,
        playerName: CardRoomPlayerName,
    },
    computed: {
        ...mapState('settingsStore', [
            'isOpenDialogRoom',
            'currentComponent',
            'singlePlayer',
            'loadingGeoJson',
            'placeGeoJson',
            'room',
            'roomName',
        ]),
    },
    mounted() {
        if (this.$route.params.roomName) {
            this.searchRoom(this.$route.params.roomName);
        }
    },
    methods: {
        ...mapActions('settingsStore', ['closeDialogRoom', 'searchRoom']),

        ...mapActions(['loadPlaceGeoJSON']),
        cancel() {
            this.closeDialogRoom();
        },
    },
};
</script>
