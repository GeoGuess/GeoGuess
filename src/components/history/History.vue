<template>
    <v-card id="history">
        <v-btn class="close-btn" icon @click="$emit('onHide')">
            <v-icon>mdi-close</v-icon>
        </v-btn>
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
            calculate-widths
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
            :expanded="openLast ? [items[items.length - 1]] : []"
        >
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="share(item)">
                    mdi-share
                </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="item">
                    <HistoryMapCountry
                        :item="item"
                        v-if="item.gameMode === $t('modes.country')"
                    />
                    <HistoryMapClassic :item="item" v-else />
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>
<script>
import { GAME_MODE } from '../../constants';
import HistoryMapClassic from './gameResult/HistoryMapClassic';
import HistoryMapCountry from './gameResult/HistoryMapCountry';
export default {
    name: 'History',
    props: ['history', 'openLast'],
    components: {
        HistoryMapClassic,
        HistoryMapCountry,
    },
    data() {
        return {
            expanded: [history[history.length - 1]],
            dialog: false,
            url: '',
            search: '',
            headers: [
                {
                    text: this.$t('History.date'),
                    value: 'dateString',
                },
                {
                    text: this.$t('History.mode'),
                    value: 'gameMode',
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
                gameMode:
                    g.mode === GAME_MODE.COUNTRY
                        ? this.$t('modes.country')
                        : this.$t('modes.classic'),
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
#history {
    padding: 10px;
    .close-btn {
        position: absolute;
        right: 1rem;
        top: 1rem;
        color: black;
    }
    .item {
        padding: 0;
        width: 90%;
    }
}
</style>
