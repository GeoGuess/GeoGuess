<template>
    <div class="search-box">
        <h2>{{ $tc('Home.placeVisited', nbPlaceVisits) }}</h2>
        <div class="search-box__search-bar">
            <v-combobox
                v-model="place"
                :items="items"
                :search-input.sync="search"
                id="search-input"
                :loading="isLoading"
                autofocus
                :placeholder="
                    isValidGeoJson
                        ? $t('Home.searchBar.customLoaded')
                        : $t('Home.searchBar.enterCity')
                "
                :disabled="isValidGeoJson"
                :persistent-hint="isValidGeoJson"
                :background-color="isValidGeoJson ? 'primary' : 'secondary'"
                append-icon="mdi-magnify"
                dark
                rounded
                height="50"
                full-width
            />

            <v-btn
                icon
                class="btn-customs"
                color="primary"
                height="50"
                @click="dialogCustom = !dialogCustom"
            >
                <v-icon>mdi-map-plus</v-icon>
            </v-btn>
        </div>
        <DialogCustomMap
            :visibility="dialogCustom"
            @change-visibility="dialogCustom = !dialogCustom"
        />

        <div class="search-box__btns">
            <v-btn
                class="search-box__btns__btn"
                rounded
                color="primary"
                large
                @click="openDialog()"
            >
                {{ $t('DialogRoom.singlePlayer') }}
            </v-btn>

            <v-btn
                class="search-box__btns__btn"
                rounded
                color="secondary"
                large
                @click="openDialog(false)"
            >
                {{ $t('DialogRoom.withFriends') }}
            </v-btn>
            <DialogRoom />
        </div>
    </div>
</template>
<script>
import DialogCustomMap from '@/components/home/DialogCustomMap';
import DialogRoom from '@/components/dialogroom/DialogRoom';
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {
        DialogRoom,
        DialogCustomMap,
    },
    data() {
        return {
            place: '',
            dialog: false,
            entries: [],
            isLoading: false,
            search: '',
            dialogCustom: false,
        };
    },

    computed: {
        ...mapGetters(['isValidGeoJson', 'geoJson', 'nbPlaceVisits']),
        items() {
            return this.entries.map((entry) => entry.properties.name);
        },
    },

    watch: {
        geoJson(val) {
            if (val !== null) {
                this.place = '';
            }
        },
        search(val) {
            // Items have already been requested
            if (!val) return;

            this.isLoading = true;

            this.axios
                .get(`https://photon.komoot.io/api/?q=${encodeURI(val)}`)
                .then((res) => {
                    if (res.status === 200 && res.data && res.data.features) {
                        this.entries = res.data.features.filter(
                            (node) => node.properties.osm_type === 'R'
                        );
                    }
                })
                .catch(() => {})
                .finally(() => (this.isLoading = false));
        },
    },
    mounted() {
        this.loadHistory();
    },
    methods: {
        ...mapActions(['loadHistory', 'loadPlaceGeoJSON']),
        ...mapActions('settingsStore', ['openDialogRoom']),
        openDialog(isSinglePlayer) {
            if (this.place) {
                this.loadPlaceGeoJSON(this.place);
            }

            this.openDialogRoom(isSinglePlayer);
        },
    },
};
</script>
<style lang="scss">
.search-box {
    h2 {
        text-align: center;
    }
    .search-box__search-bar {
        display: flex;
        .btn-customs {
            margin-top: 18px;
        }
    }
    .v-input {
        font-size: 1.2rem !important;
    }
    .search-box__btns {
        display: flex;
        justify-content: space-around;
        &__btn {
            width: 40%;
            padding: 0 5em;
            font-size: 1.1rem;
        }
    }
}
@media (max-width: 410px) {
    .search-box {
        .v-input {
            font-size: 1rem !important;
            width: 95% !important;
            margin: auto !important;
        }
        .search-box__search-bar {
            flex-direction: column;
            width: 100%;
            margin: auto;
            .btn-customs {
                margin: 0 auto;
            }
        }
        .search-box__btns {
            flex-direction: column;
            .v-btn {
                width: 80%;
                margin: 2% auto;
            }
        }
    }
}
</style>
