<template>
    <v-card id="card-room-waiting">
        <v-card-title>
            <p>{{ roomUrl }}</p>
        </v-card-title>
        <v-card-text>
            <ol>
                <li v-for="(name, i) in players" :key="'player' + i">
                    {{ name }}
                </li>
            </ol>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn dark depressed color="#FF5252" @click="cancel">
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                v-if="firstPlayer"
                id="btnStart"
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
import CardRoomMixin from './mixins/CardRoomMixin.js';
export default {
    mixins: [CardRoomMixin],
    props: ['room', 'roomName', 'firstPlayer'],
    data() {
        return {
            players: [],
        };
    },
    computed: {
        roomUrl() {
            return window.origin + '/room/' + this.roomName;
        },
    },
    mounted() {
        this.room.child('playerName').on('value', (snapshot) => {
            this.players = Object.values(snapshot.val()).filter(
                (p) => p !== true
            );
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
    },
};
</script>
