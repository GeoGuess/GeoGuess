<template>
    <div id="map" class="map-areas">
        <div class="map-content">
            <div
                v-if="polygonSelect || areaName"
                class="map-label"
                :title="areaName"
            >
                <FlagIcon
                    v-if="showFlag"
                    size="big"
                    rounded
                    :iso-name="areaRandom || areaNameSelect"
                />
                <span
                    class="map-label__country-name"
                    :class="{
                        beige: !areaRandom,
                        green: !!areaRandom,
                        'white--text': !!areaRandom,
                        large: !showFlag,
                    }"
                >
                    {{ areaName }}
                </span>
            </div>
            <GmapMap
                id="mapAreas"
                ref="mapRef"
                :center="{ lat: 37.86926, lng: -122.254811 }"
                :zoom="1"
                map-type-id="roadmap"
                :options="{
                    fullscreenControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    draggableCursor: 'crosshair',
                    clickableIcons: false,
                    styles: $vuetify.theme.dark ? $vuetify.theme.themes.dark.gmap : $vuetify.theme.themes.light.gmap,
                }"
            />
        </div>
        <div v-if="infoWindowDatas.length > 0" class="result-panel">
            <div
                v-for="info in infoWindowDatas"
                :key="info.playerName"
                class="result-panel__item"
                :class="{ flag: showFlag }"
            >
                <FlagIcon v-if="showFlag" :iso-name="info.area" />
                <b>{{ info.playerName }}</b>
                <span v-if="!showFlag">{{ info.area }}</span>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import FlagIcon from '@/components/shared/FlagIcon';
import { mapActions, mapGetters } from 'vuex';
import MapMixin from './mixins/MapMixin';

export default {
    mixins: [MapMixin],
    components: {
        FlagIcon,
    },
    props: {
        area: {
            type: String,
        },
        areasGeoJsonUrl: String,
        pathKey: {
            type: String,
            default: 'iso_a2',
        },
        showFlag: Boolean,
    },
    data() {
        return {
            map: null,
            polygonSelect: null,
            areas: {},
            markers: [],
            allowSelect: true,
            areaRandom: null,
            randomPos: null,
            infoWindowDatas: [],
        };
    },
    computed: {
        ...mapGetters(['areasJson']),
        areaName() {
            if (this.showFlag && (this.areaRandom || this.polygonSelect)) {
                return this.$countryNameLocale(
                    this.areaRandom || this.areaNameSelect
                );
            } else {
                return this.areaRandom || this.areaNameSelect;
            }
        },
        areaNameSelect() {
            return this.polygonSelect
                ? this.polygonSelect
                      .getFeatureById('feature')
                      .getProperty(this.pathKey)
                : undefined;
        },
    },
    async mounted() {
        await this.loadAreas(this.areasGeoJsonUrl);
        await this.$gmapApiPromiseLazy();
        this.$refs.mapRef.$mapPromise.then((map) => {
            this.map = map;
            this.areasJson.features.forEach((c) => {
                if (Array.isArray(c.geometry.coordinates)) {
                    const p = new google.maps.Data({
                        style: {
                            strokeOpacity: 0,
                            fillOpacity: 0,
                            strokeWeight: 2,
                        },
                    });
                    c.id = 'feature';
                    p.addGeoJson(c);

                    p.setMap(this.map);
                    p.addListener('click', () => {
                        if (!this.allowSelect) {
                            return;
                        }
                        if (this.polygonSelect) {
                            this.polygonSelect.setStyle({
                                strokeOpacity: 0,
                                fillOpacity: 0,
                            });
                        }
                        if (Object.is(p, this.polygonSelect)) {
                            this.polygonSelect = null;
                            this.$emit('setSeletedPos', null);
                        } else {
                            p.setStyle({
                                strokeOpacity: 0.8,
                                fillOpacity: 0.3,
                                strokeColor: '#1E3A8A',
                                fillColor: '#1D4ED8',
                            });

                            this.polygonSelect = p;
                            this.$emit(
                                'setSeletedPos',
                                p
                                    .getFeatureById('feature')
                                    .getProperty(this.pathKey)
                            );
                        }
                    });
                    this.areas[c.properties[this.pathKey]] = p;
                }
            });
            this.centerOnBbox();
        });
    },
    methods: {
        ...mapActions(['loadAreas']),
        putMarker(pos, isRandomLocation, area) {
            const areaName = isRandomLocation ? area || this.area : pos;
            if (isRandomLocation) {
                this.areaRandom = this.area;
                this.randomPos = new google.maps.Marker({
                    position: pos,
                    map: this.map,
                });
            }
            if (this.areas[areaName]) {
                this.areas[areaName].setStyle({
                    fillOpacity: 0.3,
                    strokeOpacity: 0.8,
                    fillColor: isRandomLocation ? '#52DA42' : '#FF4081',
                    strokeColor: isRandomLocation ? '#16A910' : '#FF4081',
                });
                this.markers.push(areaName);
            }
        },
        removeMarkers() {
            this.markers.forEach((areaName) => {
                this.areas[areaName].setStyle({
                    strokeOpacity: 0,
                    fillOpacity: 0,
                });
            });
            if (this.polygonSelect) {
                this.polygonSelect.setStyle({
                    strokeOpacity: 0,
                    fillOpacity: 0,
                });
            }
            if (this.randomPos) {
                this.randomPos.setMap(null);
                this.randomPos = null;
            }
            this.markers = [];
            this.infoWindowDatas = [];
        },
        setInfoWindow(playerName, _distance, _points, _endGame, area) {
            if (playerName) this.infoWindowDatas.push({ playerName, area });
        },
        startNextRound() {
            if (this.polygonSelect) {
                this.polygonSelect.setStyle({
                    strokeOpacity: 0,
                    fillOpacity: 0,
                });
            }
            this.polygonSelect = null;
            this.areaRandom = null;
            this.allowSelect = true;

            this.centerOnBbox();
        },
        removeListener() {
            this.allowSelect = false;
        },
        fitBounds() {
            if (this.bbox) {
                this.centerOnBbox();
            } else {
                this.map.setZoom(2);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
#map {
    overflow: hidden;
    display: flex;
    .result-panel {
        height: 100%;
        padding: 2%;
        background: var(--v-card-base);
        display: flex;
        flex-direction: column;
        width: 30%;
        .result-panel__item {
            display: grid;
            grid-template-rows: auto auto;

            &.flag {
                display: inline-grid;
                grid-template-columns: 42px auto;
                grid-column-gap: 5px;
                align-items: center;
            }
        }
    }
    .map-content {
        position: relative;
        width: 100%;
        height: 100%;
        #mapAreas {
            width: 100%;
            height: 100%;
        }
        .map-label {
            z-index: 5;
            position: absolute;
            top: 1rem;
            left: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .map-label__country-name {
                &.large {
                    width: fit-content;
                }
                width: 7rem;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                background: var(--v-primary-base);
                margin-top: 0.2rem;
                padding: 0.1% 5%;
                border-radius: 5px;
                font-weight: 500;
            }
        }
    }
}
@media (max-width: 450px) {
    #map.map-areas {
        display: grid !important;
        grid-auto-rows: auto 30vw;
        .result-panel {
            width: 100%;
            overflow-y: auto;
        }
    }
}
</style>
