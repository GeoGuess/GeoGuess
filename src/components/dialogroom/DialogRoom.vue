<template>
    <v-dialog
        v-model="isOpenDialogRoom"
        persistent
        :fullscreen="$viewport.width < 450"
        max-width="800"
        content-class="dialog-room"
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
import CardRoomMap from './card/CardRoomMap.vue';

export default {
    components: {
        roomName: CardRoomName,
        settingsMap: CardRoomMap,
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
<style lang="scss">
.dialog-room {
    .v-card__actions {
        gap: .5rem;
        padding: 1rem;
    }
}
</style>