<template>
    <div id="historyTable">
        <h2>
            {{ $t('History.title') }}
        </h2>
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
        <div class="history-table__btns">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                        <v-file-input
                            hide-input
                            prepend-icon="mdi-upload-outline"
                            @change="importSave"
                        ></v-file-input>
                    </div>
                </template>
                <span>Import GeoGuess Save</span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="exportSave">
                        <v-icon>mdi-download-outline</v-icon>
                    </v-btn>
                </template>
                <span>Export GeoGuess Save</span>
            </v-tooltip>
        </div>
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
            item-key="id"
            :customSort="customSort"
            :expanded="items.length > 0 ? [items[items.length - 1]] : []"
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
        <v-btn @click="exportCsv"> Export CSV</v-btn>
    </div>
</template>
<script>
import { GAME_MODE } from '../../constants';
import { download } from '../../utils';
import HistoryMapClassic from './gameResult/HistoryMapClassic';
import HistoryMapCountry from './gameResult/HistoryMapCountry';
export default {
    name: 'HistoryTable',
    components: {
        HistoryMapClassic,
        HistoryMapCountry,
    },
    data() {
        return {
            history: localStorage.getItem('history')
                ? JSON.parse(localStorage.getItem('history'))
                : [],
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
            return this.history.map((g, index) => ({
                ...g,
                id: index,
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
        hide() {
            this.$router.push('/');
        },
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
        exportSave() {
            download(
                JSON.stringify(this.history),
                'save_' + new Date().toISOString() + '.geoguess',
                'application/json'
            );
        },
        importSave(file) {
            file.text().then((text) => {
                const history = JSON.parse(text);
                // eslint-disable-next-line no-console
                console.log(this.history, history);

                if (
                    !Array.isArray(history) ||
                    history.some((h) => !h.date || !h.score)
                ) {
                    return;
                }
                this.history = this.history.concat(history);

                localStorage.setItem('history', JSON.stringify(this.history));
            });
        },
        exportCsv() {
            const content = this.history
                .map((h) =>
                    [
                        h.date,
                        h.multiplayer,
                        h.timeLimitation,
                        h.points,
                        h.score,
                        h.rounds.map((r) => [
                            r.position.lat,
                            r.position.lng,
                            r.guess.lat,
                            r.guess.lng,
                        ]),
                    ]
                        .flat(2)
                        .join(';')
                )
                .join('\n');

            const roundHeader = [1, 2, 3, 4, 5]
                .map(
                    (i) =>
                        `Round ${i}: position latitude;Round ${i}: position longitude;Round ${i}: guess latitude;Round ${i}:guess longitude`
                )
                .join(';');
            const header = `Date;is Multiplayer game?;Time (seconds);Points;Distance (km);${roundHeader};\n`;

            download(
                header + content,
                'export_' + new Date().toISOString() + '.csv',
                'text/csv'
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.v-card,
.v-data-table {
    background-color: #f1e9d6 !important;
}
#historyTable {
    h2 {
        font-weight: 500;
    }
    padding: 10px;
    .item {
        padding: 0;
        width: 90%;
    }

    position: relative;
    .history-table__btns {
        position: absolute;
        top: 10px;
        right: 10px;
        display: inline-flex;
        .v-input {
            margin-top: 2px;
            padding-top: 0;
        }
        .v-btn {
            margin-right: 5px;
        }
    }
}
</style>
