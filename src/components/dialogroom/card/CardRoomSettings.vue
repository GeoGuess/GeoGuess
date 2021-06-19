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
                                :text="this.mode !== gameMode.CLASSIC"
                                rounded
                                outlined
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
                            <v-btn
                                id="modeCountryBtn"
                                :text="mode !== gameMode.CUSTOM_AREA"
                                rounded
                                outlined
                                @click="() => (mode = gameMode.CUSTOM_AREA)"
                            >
                                <v-icon large> mdi-shape-polygon-plus </v-icon>
                                <span>Area </span>
                                <!--  TODO: Custom Area Label  -->
                            </v-btn>
                        </v-flex>
                    </v-row>

                    <v-row v-if="mode === gameMode.CUSTOM_AREA"> </v-row>

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
                            <br />
                            <v-list-group prepend-icon="mdi-cog">
                                <template v-slot:activator>
                                    <v-list-item-title>
                                        More settings
                                    </v-list-item-title>
                                </template>
                                <v-select
                                    v-if="this.mode === gameMode.CLASSIC"
                                    :label="
                                        $t('CardRoomSettings.scoreModeLabel')
                                    "
                                    v-model="scoreMode"
                                    :items="scoreModes"
                                />

                                <v-autocomplete
                                    label="Select Areas"
                                    v-model="areaParams"
                                    :items="optionsArea"
                                ></v-autocomplete>
                            </v-list-group>
                        </div>
                        <div>
                            <v-text-field
                                v-if="!singlePlayer"
                                :label="$t('CardRoomSettings.countDownLabel')"
                                v-model="countdown"
                                hide-details
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
import { mapActions, mapGetters } from 'vuex';
import bbox from '@turf/bbox';

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
            areaParams: null,
            invalidAreas: false,
            loadingAreas: false,
            areas: [
                {
                    text: 'France Régions',

                    value: {
                        bbox: [-5.4517733, 41.2611155, 9.8282225, 51.3055721],
                        urlArea:
                            'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson',
                        type: 'nominatim',
                        pathKey: 'nom',
                        nominatimResultPath: 'address.state',
                        nominatimQueryParams: {
                            zoom: '5',
                            addressdetails: '1',
                            'accept-language': 'fr',
                        },
                    },
                },
                {
                    text: 'France Départements',

                    value: {
                        bbox: [-5.4517733, 41.2611155, 9.8282225, 51.3055721],
                        urlArea:
                            'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson',
                        type: 'nominatim',
                        pathKey: 'nom',
                        nominatimResultPath: 'address.county',
                        nominatimQueryParams: {
                            zoom: '8',
                            addressdetails: '1',
                            'accept-language': 'fr',
                        },
                    },
                },
                {
                    text: 'US States',
                    value: {
                        bbox: [
                            -171.79111060289117,
                            18.916190000000142,
                            -66.96466,
                            71.35776357694175,
                        ],
                        urlArea:
                            'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/cultural/ne_110m_admin_1_states_provinces.json',
                        type: 'nominatim',
                        pathKey: 'name',
                        nominatimResultPath: 'address.state',
                        nominatimQueryParams: {
                            zoom: '5',
                            addressdetails: '1',
                            'accept-language': 'en',
                        },
                    },
                },
                {
                    text: 'Continent',
                    value: {
                        urlArea:
                            'https://gist.githubusercontent.com/hrbrmstr/91ea5cc9474286c72838/raw/59421ff9b268ff0929b051ddafafbeb94a4c1910/continents.json',
                        type: 'polygon',
                        pathKey: 'CONTINENT',
                    },
                },
            ],
        };
    },
    computed: {
        ...mapGetters(['areasJson']),
        optionsArea() {
            return this.areas.filter((a) => {
                if (!a.value.bbox) {
                    return true;
                }
                const bboxPlace = bbox(this.placeGeoJson);
                return !a.value.bbox.some((v, index) => v > bboxPlace[index]);
            });
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
        ...mapActions(['loadAreas']),
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
        async setSettings() {
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
                this.scoreMode,
                this.areaParams
            );
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
