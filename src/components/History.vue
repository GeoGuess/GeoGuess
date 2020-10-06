<template>
    <v-card class="history">
        <v-card-title>
            {{ $t('History.title') }}
        </v-card-title>
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-text>
                    <center>
                        <v-icon x-large> mdi-clipboard-check</v-icon>
                        <p>{{ $t('urlCopied') }}</p>
                        <v-text-field v-model="url" readonly></v-text-field>
                    </center>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        @click="dialog = false"
                        dark
                        depressed
                        color="#43B581"
                    >
                        {{ $t('OK') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-text-field
            v-model="search"
            :label="$t('History.search')"
            append-icon="mdi-magnify"
            single-line
            hide-details
        ></v-text-field>
        <v-data-table
            :search="search"
            id="history-table"
            :headers="headers"
            :items="items"
            show-expand
            single-expand
            :sort-by="['dateString']"
            :sort-desc="[true]"
            item-key="date"
            :customSort="customSort"
        >
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="share(item)">
                    mdi-share
                </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <GmapMap
                        :center="{ lat: 0, lng: 0 }"
                        :options="{
                            mapTypeControl: false,
                            gestureHandling: 'greedy',
                        }"
                        :zoom="0"
                        map-type-id="terrain"
                        :style="
                            'width:' +
                            ($viewport.width - 100) +
                            'px ; height: 400px'
                        "
                    >
                        <div v-if="!item.multiplayer">
                            <div :key="index" v-for="(r, index) in item.rounds">
                                <GmapMarker :position="r.guess" />
                                <GmapInfoWindow
                                    :options="infoOptions"
                                    :position="r.guess"
                                >
                                    <p>
                                        <b
                                            >{{
                                                $t('Maps.infoWindow.Distance')
                                            }}
                                            : </b
                                        >{{ r.distance / 1000 }} km <br /><b
                                            >{{ $t('Maps.infoWindow.Points') }}
                                            :
                                        </b>
                                        {{ r.points }}
                                    </p>
                                </GmapInfoWindow>
                                <GmapPolyline :path="[r.position, r.guess]" />
                                <GmapMarker
                                    :icon="icon"
                                    :position="r.position"
                                />
                            </div>
                        </div>
                        <div v-else>
                            <div
                                :key="indexR"
                                v-for="(r, indexR) in item.rounds"
                            >
                                <div
                                    :key="indexR + '' + indexP"
                                    v-for="(player, indexP) in Object.keys(
                                        r.players
                                    )"
                                >
                                    <GmapMarker
                                        :label="
                                            player && player.length > 0
                                                ? player[0].toUpperCase()
                                                : undefined
                                        "
                                        :position="r.players[player].guess"
                                    />
                                    <GmapInfoWindow
                                        :options="infoOptions"
                                        :position="r.players[player].guess"
                                    >
                                        <p>
                                            <b>{{ player }}</b
                                            ><br />
                                            <b
                                                >{{
                                                    $t(
                                                        'Maps.infoWindow.Distance'
                                                    )
                                                }}
                                                : </b
                                            >{{
                                                r.players[player].distance /
                                                1000
                                            }}
                                            km <br /><b
                                                >{{
                                                    $t('Maps.infoWindow.Points')
                                                }}
                                                :
                                            </b>
                                            {{ r.players[player].points }}
                                        </p>
                                    </GmapInfoWindow>
                                    <GmapPolyline
                                        :path="[
                                            r.position,
                                            r.players[player].guess,
                                        ]"
                                        :options="{
                                            strokeColor:
                                                strokeColors[
                                                    indexP % strokeColors.length
                                                ],
                                        }"
                                    />
                                </div>
                                <GmapMarker
                                    :icon="icon"
                                    :position="r.position"
                                />
                            </div>
                        </div>
                    </GmapMap>
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>
<script>
export default {
    name: 'History',
    props: ['history'],
    data() {
        return {
            dialog: '',
            url: '',
            search: '',
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
            headers: [
                {
                    text: this.$t('History.date'),
                    value: 'dateString',
                },
                {
                    text: this.$t('History.mode'),
                    value: 'mode',
                },
                {
                    text: this.$t('History.rank'),
                    value: 'rank',
                },
                {
                    text: this.$t('History.time'),
                    value: 'timeString',
                },
                {
                    text: this.$t('History.distance'),
                    value: 'score',
                },
                {
                    text: this.$t('History.points'),
                    value: 'points',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false,
                },
                {
                    text: '',
                    value: 'data-table-expand',
                },
            ],
        };
    },
    computed: {
        items() {
            return this.history.map((g) => ({
                ...g,
                score: g.score / 1000,
                points: g.points,
                dateString: new Date(g.date).toLocaleString(),
                mode: g.multiplayer
                    ? this.$t('DialogRoom.withFriends')
                    : this.$t('DialogRoom.singlePlayer'),
                timeString:
                    g.timeLimitation === 0
                        ? this.$t('CardRoomTime.infinite')
                        : g.timeLimitation / 60,
            }));
        },
    },
    methods: {
        customSort(items, index, isDesc) {
            if (index.length === 0) {
                return items;
            }
            return items.sort((a, b) => {
                if (index.includes('dateString')) {
                    if (!isDesc[0]) {
                        return Date.parse(a.date) - Date.parse(b.date);
                    } else {
                        return Date.parse(b.date) - Date.parse(a.date);
                    }
                } else {
                    if (index[0] === 'timeString')
                        if (!isDesc[0]) {
                            return a.time - b.time;
                        } else {
                            return b.time - a.time;
                        }

                    if (!isDesc[0]) {
                        return a[index[0]] < b[index[0]] ? -1 : 1;
                    } else {
                        return b[index[0]] < a[index[0]] ? -1 : 1;
                    }
                }
            });
        },
        share(item) {
            this.url =
                window.origin +
                '/game/' +
                btoa(
                    [
                        item.difficulty,
                        item.timeLimitation,
                        item.rounds.map(
                            (r) => r.position.lat + ',' + r.position.lng
                        ),
                    ]
                        .flat()
                        .join(',')
                );
            this.$copyText(this.url);
            this.dialog = true;
        },
    },
};
</script>

<style lang="scss" scoped>
.v-card,
.v-data-table {
    background-color: #f1e9d6 !important;
}
.history {
    padding: 10px;
}
</style>
