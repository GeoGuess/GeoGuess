<template>
    <v-card id="card-settings">
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
                        <v-flex
                            class="card_settings__mode__btns d-flex justify-space-around w-100"
                        >
                            <v-btn
                                id="modeClassicBtn"
                                :text="this.mode !== gameMode.CLASSIC"
                                rounded
                                outlined
                                class="mr-5"
                                @click="() => (this.mode = gameMode.CLASSIC)"
                            >
                                <v-icon large> mdi-map-marker </v-icon>
                                <span>{{ $t('modes.classic') }}</span>
                            </v-btn>
                            <v-btn
                                id="modeCountryBtn"
                                :text="this.mode !== gameMode.COUNTRY"
                                rounded
                                outlined
                                @click="() => (this.mode = gameMode.COUNTRY)"
                            >
                                <v-icon large> mdi-flag </v-icon>
                                <span>{{ $t('modes.country') }}</span>
                            </v-btn>
                        </v-flex>
                    </v-row>
                    <v-row>
                        <label class="card_settings__time__label">{{
                            $t('CardRoomTime.title')
                        }}</label>
                        <TimePicker v-model="timeLimitation" />
                    </v-row>

                    <v-row
                        align="center"
                        class="card_settings__allow_btns d-flex justify-space-around flex-row"
                    >
                        <div>
                            <v-checkbox
                                v-model="zoomControl"
                                :label="$t('CardRoomSettings.allowZoom')"
                                hide-details
                            />
                            <v-checkbox
                                v-model="moveControl"
                                :label="$t('CardRoomSettings.allowMove')"
                                hide-details
                            />
                            <v-checkbox
                                v-model="panControl"
                                :label="$t('CardRoomSettings.allowPan')"
                                hide-details
                            />
                            <br />
                            <v-checkbox
                                v-model="allPanorama"
                                :label="
                                    $t('CardRoomSettings.includePhotopheres')
                                "
                                hide-details
                            />
                            <v-select v-model="scoreMode" :items="scoreModes" />
                        </div>
                        <div>
                            <v-text-field
                                v-if="!singlePlayer"
                                v-model="countdown"
                                hide-details
                                label="CountDown (seconds)"
                                type="number"
                            />
                            <div
                                v-if="
                                    this.mode === gameMode.COUNTRY &&
                                        !singlePlayer
                                "
                            >
                                <v-checkbox v-model="timeAttack" hide-details>
                                    <template #label>
                                        {{
                                            $t(
                                                'CardRoomSettings.timeAttackLabel'
                                            )
                                        }}
                                        <v-tooltip
                                            top
                                            max-width="350"
                                            class="tooltip-timeattack"
                                        >
                                            <template
                                                v-slot:activator="{ on, attrs }"
                                            >
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    <v-icon>
                                                        mdi-information
                                                    </v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{
                                                $t(
                                                    'CardRoomSettings.timeattackInfos'
                                                )
                                            }}</span>
                                        </v-tooltip>
                                    </template>
                                </v-checkbox>
                            </div>
                        </div>
                    </v-row>
                    <v-row align="center" />
                </v-col>
                <v-col
                    :class="{
                        'd-none': !loadingGeoJson && !placeGeoJson,
                    }"
                >
                    <GmapMap
                        ref="mapRef"
                        :class="{ 'd-none': loadingGeoJson }"
                        :center="{ lat: 10, lng: 10 }"
                        :zoom="1"
                        map-type-id="roadmap"
                        style="width: 350px; max-width: 100%; height: 250px"
                        :options="{
                            gestureHandling: 'greedy',
                        }"
                    />

                    <v-skeleton-loader
                        v-if="loadingGeoJson"
                        class="mx-auto"
                        style="width: 100%; height: 250px"
                        type="image"
                    />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn dark depressed color="#FF5252" @click="cancel">
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                id="btnNextSettings"
                depressed
                color="#43B581"
                :disabled="loadingGeoJson"
                @click="setSettings"
            >
                {{ $t('next') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import TimePicker from '@/components/shared/TimePicker';
import { GAME_MODE, SCORE_MODE } from '../../../constants';
import CardRoomMixin from './mixins/CardRoomMixin';

export default {
    components: {
        TimePicker,
    },
    mixins: [CardRoomMixin],
    props: ['singlePlayer', 'placeGeoJson', 'loadingGeoJson'],
    data() {
        return {
            mode: GAME_MODE.CLASSIC,
            timeAttack: false,
            timeLimitation: 0,
            zoomControl: true,
            moveControl: true,
            panControl: true,
            countdown: 0,
            allPanorama: false,
            scoreMode: SCORE_MODE.NORMAL,
        };
    },
    computed: {
        scoreModes() {
            return Object.values(SCORE_MODE).map((a) => ({
                value: a,
                text: a,
            }));
        },
        gameMode() {
            return GAME_MODE;
        },
    },
    watch: {
        placeGeoJson(val) {
            this.setGeoJson(val);
        },
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        if (this.placeGeoJson) {
            this.setGeoJson(this.placeGeoJson);
        }
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
            this.$emit(
                'setSettings',
                this.allPanorama,
                this.timeLimitation,
                this.mode,
                this.timeAttack,
                this.zoomControl,
                this.moveControl,
                this.panControl,
                +this.countdown,
                this.scoreMode
            );
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
