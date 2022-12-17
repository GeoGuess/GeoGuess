<template>
    <div id="historyTable">
        <h2>
            {{ $t('History.title') }}
        </h2>
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-text>
                    <center>
                        <v-icon x-large> mdi-clipboard-check </v-icon>
                        <p>{{ $t('urlCopied') }}</p>
                        <v-text-field v-model="url" readonly />
                    </center>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        dark
                        depressed
                        color="#43B581"
                        @click="dialog = false"
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
                            accept="application/json"
                            prepend-icon="mdi-download-outline"
                            @change="importSave"
                        />
                    </div>
                </template>
                <span>{{ $t('History.importGeoSave') }}</span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="exportSave">
                        <v-icon>mdi-upload-outline</v-icon>
                    </v-btn>
                </template>
                <span>{{ $t('History.exportGeoSave') }}</span>
            </v-tooltip>
        </div>
        <v-text-field
            v-model="search"
            :label="$t('History.search')"
            append-icon="mdi-magnify"
            single-line
            hide-details
        />
        <v-data-table
            id="history-table"
            calculate-widths
            item-key="id"
            show-expand
            single-expand
            :search="search"
            :headers="headers.filter((h) => !h.hide)"
            :items="items"
            :sort-by="['dateString']"
            :sort-desc="[true]"
            :custom-sort="customSort"
            :expanded="items.length > 0 ? [items[items.length - 1]] : []"
        >
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="share(item)">
                    mdi-share
                </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="item">
                    <div v-if="item.multiplayer" class="item_time_multi">
                        <HistoryTimeDetail
                            class="item__times"
                            v-for="(playerName, index) in playersNames(
                                item.rounds
                            )"
                            :rounds="roundsPlayer(item.rounds, playerName)"
                            :playerName="playerName"
                            :key="`HistoryTimeDetail` + playerName"
                            :index="index"
                        />
                    </div>
                    <div v-else>
                        <HistoryTimeDetail
                            class="item__times"
                            :rounds="item.rounds"
                        />
                    </div>
                    <HistoryMapClassic
                        v-if="item.gameMode === $t('modes.classic')"
                        :item="item"
                    />
                    <HistoryMapArea
                        v-else
                        :is-country="item.gameMode === $t('modes.country')"
                        :item="item"
                    />
                </td>
            </template>
        </v-data-table>
        <v-btn color="primary" class="btn-export mx-2" @click="exportCsv">
            {{ $t('History.exportCSV') }}
        </v-btn>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { download } from '../../utils';
import HistoryMapClassic from './gameResult/HistoryMapClassic';
import HistoryMapArea from './gameResult/HistoryMapArea';
import HistoryTimeDetail from './gameResult/HistoryTimeDetail';
export default {
    name: 'HistoryTable',
    components: {
        HistoryMapClassic,
        HistoryMapArea,
        HistoryTimeDetail,
    },
    data() {
        return {
            expanded: [history[history.length - 1]],
            dialog: false,
            url: '',
            search: '',
        };
    },
    computed: {
        ...mapState({
            history: (state) => state.homeStore.history,
        }),
        headers() {
            return[
                {
                    text: this.$t('History.date'),
                    value: 'dateString',
                },
                {
                    text: this.$t('History.mapName'),
                    value: 'mapName',
                    export: true,
                },
                {
                    text: this.$t('History.mode'),
                    value: 'gameMode',
                    export: true,
                },
                {
                    text: this.$t('History.rank'),
                    value: 'rank',
                    export: true,
                },
                {
                    text: this.$t('History.time'),
                    value: 'timeString',
                    export: true,
                },
                {
                    text: this.$t('History.nbRound'),
                    value: 'nbRound',
                    export: true,
                },
                {
                    text: this.$t('History.distance'),
                    value: 'score',
                    export: true,
                },
                {
                    text: this.$t('History.points'),
                    value: 'points',
                    export: true,
                },
                {
                    text: Array(10)
                        .fill(0)
                        .map(
                            (_a, i) =>
                                `Round ${i + 1}: position latitude,Round ${
                                    i + 1
                                }: position longitude`
                        )
                        .join(','),
                    value: (item) =>
                        item.rounds
                            .map((r) => `${r.position.lat},${r.position.lng}`)
                            .join(','),
                    export: true,
                    hide: true,
                },
                {
                    text: this.$t('History.actions'),
                    value: 'actions',
                    sortable: false,
                },
                {
                    text: '',
                    value: 'data-table-expand',
                },
            ];
        },
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
                gameMode: this.$t('modes.' + g.mode),
                timeString:
                    g.timeLimitation === 0
                        ? this.$t('CardRoomTime.infinite')
                        : g.timeLimitation / 60,
                mapName: g.mapDetails ? g.mapDetails.name : '',
            }));
        },
    },
    mounted() {
        this.loadHistory();
        if ('launchQueue' in window) {
            launchQueue.setConsumer((launchParams) => {
                if (
                    !Array.isArray(launchParams.files) ||
                    launchParams.files.length !== 1
                ) {
                    return;
                }
                launchParams.files[0].getFile().then((f) => {
                    this.importSave(f);
                });
            });
        }
    },
    methods: {
        ...mapActions(['loadHistory']),
        roundsPlayer(rounds, name) {
            return rounds.map((r) => r.players[name]);
        },
        playersNames(rounds) {
            return Object.keys(rounds[0].players);
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
                            return a.timeLimitation - b.timeLimitation;
                        } else {
                            return b.timeLimitation - a.timeLimitation;
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
                'save_' + new Date().toISOString() + '.geosave',
                'application/json'
            );
        },
        importSave(file) {
            file.text().then((text) => {
                const historyFile = JSON.parse(text);

                if (
                    !Array.isArray(historyFile) ||
                    historyFile.some((h) => !h.date || !h.score)
                ) {
                    return;
                }
                const historyFileFilter = historyFile.filter(
                    (line) => !this.history.some((h) => h.date === line.date)
                );
                this.history = this.history.concat(historyFileFilter);

                localStorage.setItem('history', JSON.stringify(this.history));
            });
        },
        exportCsv() {
            const headersExport = this.headers.filter((h) => h.export);

            const header = headersExport.map((h) => h.text).join(',') + '\n';
            const content = this.items
                .map((item) =>
                    headersExport
                        .map((h) =>
                            typeof h.value === 'function'
                                ? h.value(item)
                                : item[h.value]
                        )
                        .join(',')
                )
                .join('\n');

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
#historyTable {
    h2 {
        font-weight: 500;
    }
    padding: 0.625rem;
    .item {
        padding: 0;
        width: 100%;
        .item_time_multi {
            max-height: 10.5rem;
            overflow-x: auto;
        }
    }

    position: relative;
    .history-table__btns {
        position: absolute;
        top: 0.625rem;
        right: 0.625rem;
        display: inline-flex;
        .v-input {
            margin-top: 0.125rem;
            padding-top: 0;
        }
        .v-btn {
            margin-right: 0.3125rem;
        }
    }
    .btn-export {
        position: absolute;
        bottom: 1.25rem;
        left: 0.625rem;
    }
}
</style>
