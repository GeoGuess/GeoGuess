<template>
    <div style="height: 400px" class="map-container">
        <GmapMap
            ref="mapRef"
            :center="{ lat: 0, lng: 0 }"
            :options="{
                mapTypeControl: false,
                gestureHandling: 'greedy',
            }"
            :zoom="0"
            map-type-id="roadmap"
            class="map"
        >
            <div v-for="(r, index) in item.rounds" :key="index">
                <GmapMarker
                    :position="r.position"
                    :label="(index + 1).toString()"
                />
            </div>
        </GmapMap>

        <div v-if="item.multiplayer" class="result-panel">
            <div v-for="(r, index) in item.rounds" :key="index">
                <p>
                    <b>
                        {{ $t('HeaderGame.round') }} {{ index + 1 }} :
                        <FlagIcon :iso-name="r.position.country" />
                    </b>
                </p>
                <div
                    v-for="(value, playerName, index) in r.players"
                    :key="playerName"
                    class="result-panel__item"
                >
                    <FlagIcon :iso-name="value.guess" />
                    <span
                        :style="`color: ${
                            strokeColors[index % strokeColors.length]
                        }`"
                    >{{ playerName }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FlagIcon from '@/components/shared/FlagIcon';
import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'HistoryMapCountry',
    components: {
        FlagIcon,
    },
    props: ['item'],
    data() {
        return {
            strokeColors: [
                '#F44336',
                '#76FF03',
                '#FFEB3B',
                '#FF4081',
                '#18FFFF',
                '#18FFFF',
            ],
        };
    },
    methods: { ...mapActions(['loadCountries']) },
    computed: {
        ...mapGetters(['countriesJson']),
    },
    watch: {
        countriesJson(val) {
            if (!val || !val.features) {
                return;
            }
        },
    },
    async mounted() {
        await this.loadCountries();
        await this.$gmapApiPromiseLazy();
        this.$refs.mapRef.$mapPromise.then((map) => {
            if (!this.item.multiplayer) {
                //SinglePlayer
                this.item.rounds.forEach((r) => {
                    const p = new google.maps.Data({
                        style: {
                            strokeOpacity: 0.8,
                            fillOpacity: 0.3,
                            strokeWeight: 2,
                            strokeColor: '#1E3A8A',
                            fillColor: '#1D4ED8',
                        },
                    });
                    const geojsonCountry = this.countriesJson.features.find(
                        (j) => j.properties.iso_a2 === r.guess
                    );
                    p.addGeoJson(geojsonCountry);

                    p.setMap(map);
                });
            } else {
                //Multiplayer
                this.item.rounds.forEach((r) => {
                    let i = 0;
                    for (const playerName in r.players) {
                        const p = new google.maps.Data({
                            style: {
                                strokeOpacity: 0.8,
                                fillOpacity: 0.3,
                                strokeWeight: 2,
                                strokeColor: this.strokeColors[i],
                                fillColor: this.strokeColors[i],
                            },
                        });
                        const geojsonCountry = this.countriesJson.features.find(
                            (j) =>
                                j.properties.iso_a2 ===
                                r.players[playerName].guess
                        );
                        p.addGeoJson(geojsonCountry);

                        p.setMap(map);
                        i = (i + 1) % this.strokeColors.length;
                    }
                });
            }
        });
    },
};
</script>
<style lang="scss" scoped>
.map-container {
    overflow: hidden;
    display: flex;

    .map {
        height: 400px;
        width: 100%;
    }

    .result-panel {
        p {
            text-align: center;
            margin: 5% 0;
            border-top: 1px solid gray;
        }
        height: 100%;
        width: 15%;
        background: #f1e9d6;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 218px;
        .result-panel__item {
            display: inline-grid;
            grid-template-columns: 30px auto;
            grid-column-gap: 5px;
            width: 100%;
        }
    }
}
</style>
