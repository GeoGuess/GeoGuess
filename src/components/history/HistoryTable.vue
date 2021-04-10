<template>
    <div id="historyTable">
        <h2>
            {{ $t('History.title') }}
        </h2>
        <v-dialog
            v-model="dialog"
            max-width="500"
        >
            <v-card>
                <v-card-text>
                    <center>
                        <v-icon x-large>
                            mdi-clipboard-check
                        </v-icon>
                        <p>{{ $t('urlCopied') }}</p>
                        <v-text-field
                            v-model="url"
                            readonly
                        />
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
                    <div
                        v-bind="attrs"
                        v-on="on"
                    >
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
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="exportSave"
                    >
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
            :search="search"
            :headers="headers.filter((h) => !h.hide)"
            :items="items"
            show-expand
            single-expand
            :sort-by="['dateString']"
            :sort-desc="[true]"
            item-key="id"
            :custom-sort="customSort"
            :expanded="items.length > 0 ? [items[items.length - 1]] : []"
        >
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="share(item)"
                >
                    mdi-share
                </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td
                    :colspan="headers.length"
                    class="item"
                >
                    <HistoryMapCountry
                        v-if="item.gameMode === $t('modes.country')"
                        :item="item"
                    />
                    <HistoryMapClassic
                        v-else
                        :item="item"
                    />
                </td>
            </template>
        </v-data-table>
        <v-btn
            color="primary"
            class="btn-export"
            @click="exportCsv"
        >
            {{ $t('History.exportCSV') }}
        </v-btn>
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
                    export: true,
                },
                {
                    text: this.$t('History.mode'),
                    value: 'mode',
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
    mounted() {
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
    .btn-export {
        position: absolute;
        bottom: 20px;
        left: 10px;
    }
}
</style>
