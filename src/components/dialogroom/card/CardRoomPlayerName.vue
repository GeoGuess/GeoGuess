<template>
    <v-card id="card-playername">
        <v-card-title>
            <span id="card-title">Room: {{ roomName }}</span>
        </v-card-title>

        <v-card-subtitle class="pb-0">
            {{ roomUrl }}
            <v-icon small @click="copy">mdi-content-copy</v-icon>
        </v-card-subtitle>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            id="inputPlayerName"
                            maxlength="10"
                            v-model="playerName"
                            autofocus
                            @keyup.enter="searchRoom"
                            :label="$t('CardRoomPlayerName.title')"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <ol>
                        <li v-for="(name, i) in players" :key="'player' + i">
                            {{ name }}
                        </li>
                    </ol>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn dark depressed color="#FF5252" @click="cancel">
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                v-if="firstPlayer"
                id="btnStart"
                dark
                depressed
                color="#43B581"
                :disabled="players.length < 2"
                @click="start"
            >
                {{ $t('next') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import CardRoomMixin from './mixins/CardRoomMixin';
export default {
    mixins: [CardRoomMixin],
    props: ['room', 'roomName', 'firstPlayer'],
    data() {
        return {
            players: [],
            playerName: '',
        };
    },
    computed: {
        roomUrl() {
            return window.origin + '/room/' + this.roomName;
        },
    },
    watch: {
        playerName(val) {
            this.$emit('setPlayerName', val);
        },
    },
    mounted() {
        this.room.child('playerName').on('value', (snapshot) => {
            this.players = Object.values(snapshot.val());
        });
        this.room.on('value', (snapshot) => {
            if (snapshot.hasChild('size') && snapshot.hasChild('streetView')) {
                this.$emit('start');
            }
        });
    },
    methods: {
        start() {
            this.room.update({
                size: this.players.length,
            });
            this.$emit('start');
        },
        copy() {
            this.$copyText(this.roomUrl);
        },
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
