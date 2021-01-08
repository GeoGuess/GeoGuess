<template>
    <div
        :style="'width:' + ($viewport.width - 100) + 'px ; height: 400px'"
        class="map-container"
    >
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
            <div :key="index" v-for="(r, index) in item.rounds">
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
                        <FlagIcon :isoName="r.position.country" />
                    </b>
                </p>
                <div
                    class="result-panel__item"
                    v-bind:key="playerName"
                    v-for="(value, playerName, index) in r.players"
                >
                    <FlagIcon :isoName="value.guess" />
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
import json from '@/resources/countries.geo.json';
import FlagIcon from '@/components/shared/FlagIcon';
export default {
    name: 'HistoryMapCountry',
    props: ['item'],
    components: {
        FlagIcon,
    },
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
    async mounted() {
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
                    const geojsonCountry = json.features.find(
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
                        const geojsonCountry = json.features.find(
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
        .result-panel__item {
            padding: 0 2%;
            .flag-icon {
                margin-right: 0.8rem;
                --width-flag: 1.2em;
            }
        }
    }
}
</style>
