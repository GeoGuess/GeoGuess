<template>
    <v-card id="card-settings" :disabled="loadingAreas" :loading="loadingAreas">
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
                                :text="
                                    gameSettings.modeSelected !==
                                        gameMode.CLASSIC
                                "
                                rounded
                                outlined
                                @click="
                                    () =>
                                        setGameSettings({
                                            modeSelected: gameMode.CLASSIC,
                                        })
                                "
                            >
                                <v-icon large> mdi-map-marker </v-icon>
                                <span>{{ $t('modes.classic') }}</span>
                            </v-btn>
                            <v-btn
                                id="modeCountryBtn"
                                :text="
                                    gameSettings.modeSelected !==
                                        gameMode.COUNTRY
                                "
                                rounded
                                outlined
                                @click="
                                    () =>
                                        setGameSettings({
                                            modeSelected: gameMode.COUNTRY,
                                        })
                                "
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
                        <TimePicker
                            :value="gameSettings.time"
                            @input="(time) => setGameSettings({ time })"
                        />
                    </v-row>

                    <v-row
                        align="center"
                        class="card_settings__allow_btns d-flex justify-space-around flex-row"
                    >
                        <div>
                            <v-checkbox
                                :input-value="gameSettings.zoomControl"
                                @change="
                                    (zoomControl) =>
                                        setGameSettings({ zoomControl })
                                "
                                :label="$t('CardRoomSettings.allowZoom')"
                                hide-details
                            />
                            <v-checkbox
                                :input-value="gameSettings.moveControl"
                                @change="
                                    (moveControl) =>
                                        setGameSettings({ moveControl })
                                "
                                :label="$t('CardRoomSettings.allowMove')"
                                hide-details
                            />
                            <v-checkbox
                                :input-value="gameSettings.panControl"
                                @change="
                                    (panControl) =>
                                        setGameSettings({ panControl })
                                "
                                :label="$t('CardRoomSettings.allowPan')"
                                hide-details
                            />
                            <br />
                            <v-checkbox
                                :input-value="gameSettings.allPanorama"
                                @change="
                                    (allPanorama) =>
                                        setGameSettings({ allPanorama })
                                "
                                :label="
                                    $t('CardRoomSettings.includePhotopheres')
                                "
                                hide-details
                            />
                            <br />
                            <v-list-group prepend-icon="mdi-cog">
                                <template v-slot:activator>
                                    <v-list-item-title>
                                        {{$t('CardRoomSettings.moreSettings')}}
                                    </v-list-item-title>
                                </template>
                                <v-select
                                    v-if="
                                        gameSettings.modeSelected ===
                                            gameMode.CLASSIC
                                    "
                                    :label="
                                        $t('CardRoomSettings.scoreModeLabel')
                                    "
                                    :input-value="gameSettings.scoreMode"
                                    @change="
                                        (scoreMode) =>
                                            setGameSettings({ scoreMode })
                                    "
                                    :items="scoreModes"
                                />

                                <v-autocomplete
                                    :label="$t('CardRoomSettings.selectAreas')"
                                    :value="gameSettings.areaParams"
                                    @input="
                                        (areaParams) =>
                                            setGameSettings({ areaParams })
                                    "
                                    :items="optionsArea"
                                ></v-autocomplete>
                            </v-list-group>
                        </div>
                        <div>
                            <v-text-field
                                v-if="!singlePlayer"
                                :label="$t('CardRoomSettings.countDownLabel')"
                                :value="gameSettings.countdown"
                                @input="
                                    (countdown) =>
                                        setGameSettings({
                                            countdown: +countdown,
                                        })
                                "
                                hide-details
                                type="number"
                            />
                            <div
                                v-if="
                                    gameSettings.modeSelected !==
                                        gameMode.CLASSIC && !singlePlayer
                                "
                            >
                                <v-checkbox
                                    :input-value="
                                        gameSettings.timeAttackSelected
                                    "
                                    @change="
                                        (timeAttackSelected) =>
                                            setGameSettings({
                                                timeAttackSelected,
                                            })
                                    "
                                    hide-details
                                >
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
                @click="onClickNext"
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
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import bbox from '@turf/bbox';
import { SETTINGS_SET_GAME_SETTINGS } from '@/store/mutation-types';

export default {
    components: {
        TimePicker,
    },
    mixins: [CardRoomMixin],
    props: ['singlePlayer'],
    data() {
        return {
            invalidAreas: false,
            loadingAreas: false,
        };
    },
    computed: {
        ...mapGetters(['areasJson', 'areasList']),
        ...mapState({
            loadingGeoJson: (state) => state.homeStore.loadingGeoJson,
            placeGeoJson: (state) => state.homeStore.geojson,
        }),
        ...mapState('settingsStore', ['gameSettings']),
        optionsArea() {
            return this.areasList
                .filter((a) => {
                    if (!a.data.bbox) {
                        return true;
                    }
                    if (this.placeGeoJson) {
                        const bboxPlace = bbox(this.placeGeoJson);
                        return a.data.bbox.every((v, index) =>
                            index < 2
                                ? v <= bboxPlace[index]
                                : v >= bboxPlace[index]
                        );
                    }
                })
                .map((a) => ({ text: a.nameLocate, value: a }));
        },
        scoreModes() {
            return Object.values(SCORE_MODE).map((a) => ({
                value: a,
                text: this.$t('CardRoomSettings.scoreModes.' + a),
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
        ...mapMutations('settingsStore', {
            setGameSettings: SETTINGS_SET_GAME_SETTINGS,
        }),
        ...mapActions('settingsStore', ['setSettings']),
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
        onClickNext() {
            this.setSettings();
        },
    },
};
</script>
<style lang="scss" scoped>
#card-settings {
    &.blur {
        filter: blur(1px);
    }
    .card_settings__readonly {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .settings .row {
        margin-bottom: 1.5rem;
        .v-select {
            width: 15.5rem;
        }
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
}
</style>
