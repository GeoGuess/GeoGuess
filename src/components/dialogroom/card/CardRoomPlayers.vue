<template>
    <v-card id="card-settings">
        <v-card-title>
            <p>{{ $t('CardRoomSettings.title') }}</p>
        </v-card-title>
        <v-card-text class="settings"> </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn
                id="btnNextSettings"
                depressed
                color="#43B581"
                @click="setSettings"
                :disabled="loadingGeoJson"
            >
                {{ $t('next') }}
            </v-btn>
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
            timeAttack: false,
            timeLimitation: 0,
            roomSize: 2,
            roomSizeItems: [...Array(98)].map((item, index) => index + 2),
            zoomControl: true,
            moveControl: true,
            panControl: true,
            countdown: 0,
        };
    },
    computed: {
        gameMode() {
            return GAME_MODE;
        },
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        if (this.placeGeoJson) {
            this.setGeoJson(this.placeGeoJson);
        }
    },
    watch: {
        placeGeoJson(val) {
            this.setGeoJson(val);
        },
    },
    methods: {
        setGeoJson(val) {
            this.$refs.mapRef.$mapPromise.then((map) => {
                map.data.setMap(null);
                let data = new google.maps.Data({
                    map: map,
                });
                if (val) data.addGeoJson(val);
                map.data = data;
                if (val && val.bbox) {
                    map.fitBounds({
                        east: val.bbox[2],
                        north: val.bbox[3],
                        south: val.bbox[1],
                        west: val.bbox[0],
                    });
                }
            });
        },
        setSettings() {
            if (+this.roomSize > 1) {
                this.$emit(
                    'setSettings',
                    this.timeLimitation,
                    this.mode,
                    +this.roomSize,
                    this.timeAttack,
                    this.zoomControl,
                    this.moveControl,
                    this.panControl,
                    +this.countdown
                );
            }
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

.v-card__actions .v-btn {
    color: white;
}
.card_settings__allow_btns {
    display: flex;
    flex-direction: column;
    .v-input {
        align-self: start;
        margin: 0;
        .v-messages {
            display: contents;
        }
    }
}
@media (max-width: 360px) {
    .card_settings__mode__btns {
        flex-direction: column;
        margin-top: 2rem;
        .v-btn {
            margin: 5px 0;
            width: 100%;
        }
    }
}
</style>
