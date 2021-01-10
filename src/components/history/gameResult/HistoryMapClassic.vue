<template>
    <GmapMap
        :center="{ lat: 0, lng: 0 }"
        :options="{
            mapTypeControl: false,
            gestureHandling: 'greedy',
        }"
        :zoom="0"
        map-type-id="roadmap"
        :style="'width:' + ($viewport.width - 100) + 'px ; height: 400px'"
    >
        <div v-if="!item.multiplayer">
            <div :key="index" v-for="(r, index) in item.rounds">
                <GmapMarker
                    :position="{ lat: r.guess.lat, lng: r.guess.lng }"
                />
                <GmapInfoWindow :options="infoOptions" :position="r.guess">
                    <p>
                        <b>{{ $t('Maps.infoWindow.Distance') }} : </b
                        >{{ r.distance / 1000 }} km <br /><b
                            >{{ $t('Maps.infoWindow.Points') }}
                            :
                        </b>
                        {{ r.points }}
                    </p>
                </GmapInfoWindow>
                <GmapPolyline
                    :path="[
                        { lat: r.position.lat, lng: r.position.lng },
                        {
                            lat: r.guess.lat,
                            lng: r.guess.lng,
                        },
                    ]"
                />
                <GmapMarker
                    :icon="icon"
                    :position="{ lat: r.position.lat, lng: r.position.lng }"
                />
            </div>
        </div>
        <div v-else>
            <div :key="indexR" v-for="(r, indexR) in item.rounds">
                <div
                    :key="indexR + '' + indexP"
                    v-for="(player, indexP) in Object.keys(r.players)"
                >
                    <GmapMarker
                        :label="
                            player && player.length > 0
                                ? player[0].toUpperCase()
                                : undefined
                        "
                        :position="{
                            lat: r.players[player].guess.lat,
                            lng: r.players[player].guess.lng,
                        }"
                    />
                    <GmapInfoWindow
                        :options="infoOptions"
                        :position="{
                            lat: r.players[player].guess.lat,
                            lng: r.players[player].guess.lng,
                        }"
                    >
                        <p>
                            <b>{{ player }}</b
                            ><br />
                            <b>{{ $t('Maps.infoWindow.Distance') }} : </b
                            >{{ r.players[player].distance / 1000 }} km <br /><b
                                >{{ $t('Maps.infoWindow.Points') }}
                                :
                            </b>
                            {{ r.players[player].points }}
                        </p>
                    </GmapInfoWindow>
                    <GmapPolyline
                        :path="[
                            { lat: r.position.lat, lng: r.position.lng },
                            {
                                lat: r.players[player].guess.lat,
                                lng: r.players[player].guess.lng,
                            },
                        ]"
                        :options="{
                            strokeColor:
                                strokeColors[indexP % strokeColors.length],
                        }"
                    />
                </div>
                <GmapMarker
                    :icon="icon"
                    :position="{ lat: r.position.lat, lng: r.position.lng }"
                />
            </div>
        </div>
    </GmapMap>
</template>

<script>
export default {
    name: 'HistoryMapClassic',
    props: ['item'],
    data() {
        return {
            infoOptions: {
                pixelOffset: {
                    width: 0,
                    height: -42,
                },
            },
            strokeColors: [
                '#F44336',
                '#76FF03',
                '#FFEB3B',
                '#FF4081',
                '#18FFFF',
                '#18FFFF',
            ],
            icon: window.location.origin + '/img/icons/favicon-16x16.png',
        };
    },
};
</script>
