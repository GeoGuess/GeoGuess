<template>
    <div
        id="map"
        class="map-countries"
    >
        <div class="map-content">
            <div
                v-if="polygonSelect || countryRandom"
                class="map-label"
                :title="countryName"
            >
                <FlagIcon
                    size="big"
                    rounded
                    :iso-name="
                        countryRandom ||
                            polygonSelect
                                .getFeatureById('feature')
                                .getProperty('iso_a2')
                    "
                />
                <span
                    class="map-label__country-name"
                    :class="{
                        beige: !countryRandom,
                        green: !!countryRandom,
                        'white--text': !!countryRandom,
                    }"
                >{{ this.countryName }}</span>
            </div>
            <GmapMap
                id="mapCountries"
                ref="mapRef"
                :center="{ lat: 37.86926, lng: -122.254811 }"
                :zoom="1"
                map-type-id="roadmap"
                :options="{
                    fullscreenControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                }"
            />
        </div>
        <div
            v-if="this.infoWindowDatas.length > 0"
            class="result-panel"
        >
            <div
                v-for="info in this.infoWindowDatas"
                :key="info.playerName"
                class="result-panel__item"
            >
                <FlagIcon :iso-name="info.country" />
                <span>{{ info.playerName }}</span>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import FlagIcon from '@/components/shared/FlagIcon';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        FlagIcon,
    },
    props: ['bbox', 'country'],
    data() {
        return {
            map: null,
            polygonSelect: null,
            countries: {},
            markers: [],
            allowSelect: true,
            countryRandom: null,
            randomPos: null,
            infoWindowDatas: [],
        };
    },
    computed: {
        ...mapGetters(['countriesJson']),
        countryName() {
            return this.$countryNameLocale(
                this.countryRandom ||
                    this.polygonSelect
                        .getFeatureById('feature')
                        .getProperty('iso_a2')
            );
        },
    },
    watch: {
        bbox() {
            this.centerOnBbox();
        },
    },
    async mounted() {
        await this.loadCountries();
        await this.$gmapApiPromiseLazy();
        this.$refs.mapRef.$mapPromise.then((map) => {
            this.map = map;
            this.countriesJson.features.forEach((c) => {
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
                                    .getProperty('iso_a2')
                            );
                        }
                    });
                    this.countries[c.properties.iso_a2] = p;
                }
            });
            this.centerOnBbox();
        });
    },
    methods: {
        ...mapActions(['loadCountries']),
        centerOnBbox() {
            if (this.map && this.bbox) {
                this.map.fitBounds({
                    east: this.bbox[2],
                    north: this.bbox[3],
                    south: this.bbox[1],
                    west: this.bbox[0],
                });
            }
        },
        putMarker(pos, isRandomLocation, country) {
            const c = isRandomLocation ? country || this.country : pos;
            if (isRandomLocation) {
                this.countryRandom = this.country;
                this.randomPos = new google.maps.Marker({
                    position: pos,
                    map: this.map,
                });
            }
            if (this.countries[c])
                this.countries[c].setStyle({
                    fillOpacity: 0.3,
                    strokeOpacity: 0.8,
                    fillColor: isRandomLocation ? '#52DA42' : '#FF4081',
                    strokeColor: isRandomLocation ? '#16A910' : '#FF4081',
                });
            this.markers.push(c);
        },
        removeMarkers() {
            this.markers.forEach((country) => {
                this.countries[country].setStyle({
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
        setInfoWindow(playerName, _distance, _points, _endGame, country) {
            if (playerName) this.infoWindowDatas.push({ playerName, country });
        },
        drawPolyline() {},
        removePolylines() {},
        startNextRound() {
            if (this.polygonSelect) {
                this.polygonSelect.setStyle({
                    strokeOpacity: 0,
                    fillOpacity: 0,
                });
            }
            this.polygonSelect = null;
            this.countryRandom = null;
            this.allowSelect = true;
        },
        removeListener() {
            this.allowSelect = false;
        },
        fitBounds() {
            this.map.setZoom(2);
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
        background: #f1e9d6;
        display: flex;
        flex-direction: column;
        width: 218px;
        .result-panel__item {
            display: inline-grid;
            grid-template-columns: 30px auto;
            grid-column-gap: 5px;
        }
    }
    .map-content {
        position: relative;
        width: 100%;
        height: 100%;
        #mapCountries {
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
    #map.map-countries {
        display: grid !important;
        grid-auto-rows: auto 30vw;
        .result-panel {
            width: 100%;
            overflow-y: auto;
        }
    }
}
</style>
