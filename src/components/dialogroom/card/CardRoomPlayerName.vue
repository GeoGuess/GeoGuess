<template>
    <v-card id="card-playername">
        <v-card-title>
            <span id="card-title">{{$t('CardRoomPlayerName.title')}} {{ roomName }}</span>
        </v-card-title>

        <v-card-subtitle
            ref="roomUrl"
            class="pb-0"
        >
            {{ roomUrl }}
            <v-icon
                small
                @click="copy"
            >
                mdi-content-copy
            </v-icon>
        </v-card-subtitle>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            id="inputPlayerName"
                            v-model="playerName"
                            maxlength="10"
                            autofocus
                            :label="$t('CardRoomPlayerName.input')"
                            :error="invalidName"
                        />
                    </v-col>
                </v-row>

                <h3>{{ $tc('CardRoomPlayerName.players', players.length) }}</h3>

                <div class="players-list">
                    <v-chip
                        v-for="(name, i) in players"
                        :key="'player' + i"
                        color="#424242"
                        dark
                    >
                        <v-avatar
                            :color="
                                [
                                    '#E91B0C',
                                    '#5ccc00',
                                    '#e0ca00',
                                    '#FF1F69',
                                    '#00b8b8',
                                ][i % 5]
                            "
                            left
                        >
                            {{ name.slice(0, 2).toUpperCase() }}
                        </v-avatar>
                        {{ name }}
                    </v-chip>
                </div>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn
                dark
                depressed
                color="#FF5252"
                @click="cancel"
            >
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
    props: {
        'room': {
            type: Object,
            required: true,
        }, 
        'roomName': {
            type: String,
            required: true,
        },
        'firstPlayer': {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            players: [],
            playerName: '',
            invalidName: false,
        };
    },
    computed: {
        roomUrl() {
            return window.origin + '/room/' + this.roomName;
        },
    },
    watch: {
        playerName(val) {
            if(!this.players.includes(val)){
                this.invalidName = false;
                this.$emit('setPlayerName', val);
            }else{
                this.invalidName = true;
            }
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
            this.$copyText(this.roomUrl, this.$refs.roomUrl);
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
h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 500;
}
.players-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
    -webkit-column-gap: 30px;
    -moz-column-gap: 30px;
    column-gap: 30px;
    row-gap: 1.5rem;
    justify-content: center;
}
</style>
