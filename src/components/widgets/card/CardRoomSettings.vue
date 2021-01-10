<template>
    <v-card>
        <v-card-title>
            <p>{{ $t('CardRoomSettings.title') }}</p>
        </v-card-title>
        <v-card-text class="settings">
            <v-row>
                <v-col>
                    <v-row>
                        <label class="card_settings__mode__label">{{
                            $t('CardRoomSettings.modeLabel')
                        }}</label>
                        <v-flex class="d-flex justify-space-around w-100">
                            <v-btn
                                :text="this.mode !== gameMode.CLASSIC"
                                rounded
                                outlined
                                id="modeClassicBtn"
                                v-on:click="
                                    () => (this.mode = gameMode.CLASSIC)
                                "
                                class="mr-5"
                            >
                                <v-icon large>mdi-map-marker</v-icon>
                                <span>{{ $t('modes.classic') }}</span>
                            </v-btn>
                            <v-btn
                                :text="this.mode !== gameMode.COUNTRY"
                                rounded
                                outlined
                                id="modeCountryBtn"
                                v-on:click="
                                    () => (this.mode = gameMode.COUNTRY)
                                "
                            >
                                <v-icon large>mdi-flag</v-icon>
                                <span>{{ $t('modes.country') }}</span>
                            </v-btn>
                        </v-flex>
                    </v-row>
                    <v-row v-if="!singlePlayer">
                        <v-combobox
                            :label="$t('CardRoomSize.title')"
                            v-model="roomSize"
                            :items="roomSizeItems"
                            :rules="[(v) => +v > 1]"
                            :filter="(item, queryText) => item == queryText"
                            autofocus
                        ></v-combobox>
                    </v-row>
                    <v-row>
                        <label class="card_settings__time__label">{{
                            $t('CardRoomTime.title')
                        }}</label>
                        <TimePicker v-model="timeLimitation" />
                    </v-row>
                    <v-row
                        v-if="this.mode === gameMode.COUNTRY && !singlePlayer"
                    >
                        <v-checkbox
                            v-model="timeAttack"
                            label="TimeAttack"
                        ></v-checkbox>
                    </v-row>
                </v-col>
                <v-col
                    v-bind:class="{
                        'd-none': !loadingGeoJson && !placeGeoJson,
                    }"
                >
                    <GmapMap
                        v-bind:class="{ 'd-none': loadingGeoJson }"
                        :center="{ lat: 10, lng: 10 }"
                        :zoom="1"
                        ref="mapRef"
                        map-type-id="roadmap"
                        style="width: 350px; height: 250px"
                        :options="{
                            gestureHandling: 'greedy',
                        }"
                    >
                    </GmapMap>

                    <v-skeleton-loader
                        v-if="loadingGeoJson"
                        class="mx-auto"
                        style="width: 100%; height: 250px"
                        type="image"
                    ></v-skeleton-loader>
                </v-col>
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
            timeAttack: false,
            timeLimitation: 0,
            roomSize: 2,
            roomSizeItems: [...Array(98)].map((item, index) => index + 2),
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
                    this.timeAttack
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
</style>
