<template>
    <v-card id="card-roomname">
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomName.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            :type="streamerMode ? 'password' : 'text'"
                            id="inputRoomName"
                            v-model="roomName"
                            maxlength="10"
                            autofocus
                            :error-messages="roomErrorMessage"
                            @keyup.enter="searchRoom"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn dark depressed color="#FF5252" @click="cancel">
                {{ $t('cancel') }}
            </v-btn>
            <v-btn dark depressed color="#43B581" @click="searchRoom(roomName)">
                {{ $t('next') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CardRoomMixin from './mixins/CardRoomMixin';
export default {
    mixins: [CardRoomMixin],
    data() {
        return {
            roomName: '',
        };
    },
    computed: {    
        ...mapState('settingsStore', ['roomErrorMessage']),
  
        ...mapState({
            streamerMode: (state) => state.homeStore.streamerMode,
        }),
    },
    methods: {
        ...mapActions('settingsStore', ['searchRoom']),
    },
};
</script>

<style scoped>
#card-title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
}
</style>
