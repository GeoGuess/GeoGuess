<template>
    <v-card>
        <v-card-title>
            <p>{{ $t('CardRoomSettings.title') }}</p>
        </v-card-title>
        <v-card-text class="settings">
            <v-row>
                <label>{{ $t('CardRoomSettings.modeLabel') }}</label>
                <v-flex class="d-flex justify-space-around w-100">
                    <v-btn
                        :text="this.mode !== gameMode.CLASSIC"
                        rounded
                        outlined
                        v-on:click="() => (this.mode = gameMode.CLASSIC)"
                        class="mr-5"
                    >
                        <v-icon large>mdi-map-marker</v-icon>
                        <span>{{ $t('modes.classic') }}</span>
                    </v-btn>
                    <v-btn
                        :text="this.mode !== gameMode.COUNTRY"
                        rounded
                        outlined
                        v-on:click="() => (this.mode = gameMode.COUNTRY)"
                    >
                        <v-icon large>mdi-flag</v-icon>
                        <span>{{ $t('modes.country') }}</span>
                    </v-btn>
                </v-flex>
            </v-row>
            <v-row v-if="!singlePlayer">
                <v-autocomplete
                    :label="$t('CardRoomSize.title')"
                    v-model="roomSize"
                    :items="roomSizeItems"
                    autofocus
                ></v-autocomplete>
            </v-row>
            <v-row>
                <label>{{ $t('CardRoomTime.title') }}</label>
                <TimePicker v-model="timeLimitation" />
            </v-row>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn dark depressed color="#43B581" @click="setSettings">{{
                $t('next')
            }}</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import TimePicker from '@/components/shared/TimePicker';
import { GAME_MODE } from '../../../constants';

export default {
    props: ['singlePlayer', 'placeGeoJson', 'loadingGeoJson'],
    components: {
        TimePicker,
    },
    data() {
        return {
            mode: GAME_MODE.CLASSIC,
            timeLimitation: 0,
            roomSize: 2,
            roomSizeItems: [
                {
                    text: '2',
                    value: 2,
                },
                {
                    text: '3',
                    value: 3,
                },
                {
                    text: '4',
                    value: 4,
                },
                {
                    text: '5',
                    value: 5,
                },
                {
                    text: '5',
                    value: 5,
                },
                {
                    text: '6',
                    value: 6,
                },
                {
                    text: '7',
                    value: 7,
                },
                {
                    text: '8',
                    value: 8,
                },
                {
                    text: '9',
                    value: 9,
                },
                {
                    text: '10',
                    value: 10,
                },
                {
                    text: '11',
                    value: 11,
                },
                {
                    text: '12',
                    value: 12,
                },
            ],
        };
    },
    computed: {
        gameMode() {
            return GAME_MODE;
        },
    },
    methods: {
        setSettings() {
            this.$emit(
                'setSettings',
                this.timeLimitation,
                this.mode,
                this.roomSize
            );
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>
<style lang="scss" scoped>
.settings .row {
    margin-bottom: 2.5rem;
}
</style>
