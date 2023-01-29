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
                            :loading="loadRoom"
                            :disabled="loadRoom"
                            :type="streamerMode ? 'password' : 'text'"
                            id="inputRoomName"
                            v-model="roomInputValue"
                            maxlength="10"
                            autofocus
                            :error-messages="roomErrorMessage"
                            @keyup.enter="searchRoom(roomNameText)"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn dark depressed color="error" @click="cancel">
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                dark
                depressed
                color="#43B581"
                @click="searchRoom(roomNameText)"
            >
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
            roomNameText: '',
        };
    },
    computed: {
        ...mapState({
            streamerMode: (state) => state.homeStore.streamerMode,
        }),
        ...mapState('settingsStore', [
            'roomErrorMessage',
            'loadRoom',
            'roomName',
        ]),
        roomInputValue: {
            get: function () {
                return this.loadRoom ? this.roomName : this.roomNameText;
            },
            set: function (newValue) {
                this.roomNameText = newValue;
            },
        },
    },
    methods: {
        ...mapActions('settingsStore', ['searchRoom']),
    },
};
</script>

<style lang="scss" scoped>
#card-title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
}
</style>
