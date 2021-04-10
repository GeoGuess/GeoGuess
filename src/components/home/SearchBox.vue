<template>
    <div class="search-box">
        <h2>{{ $t('Home.record') }}: {{ record / 1000 }} km</h2>
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
            <DialogRoom
                single-player
                :place="place"
                :geo-json="geoJson"
            />

            <DialogRoom
                :place="place"
                :geo-json="geoJson"
            />
        </div>
    </div>
</template>
<script>
import DialogCustomMap from '@/components/home/DialogCustomMap';
import DialogRoom from '@/components/dialogroom/DialogRoom';
import { mapGetters } from 'vuex';
export default {
    components: {
        DialogRoom,
        DialogCustomMap,
    },
    data() {
        return {
            record: localStorage.getItem('record'),
            place: '',
            dialog: false,
            entries: [],
            isLoading: false,
            search: '',
            dialogCustom: false,
        };
    },

    computed: {
        ...mapGetters(['isValidGeoJson', 'geoJson']),
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
