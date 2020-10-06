<template>
    <div class="search-box">
        <h2>{{ $t('Home.record') }}: {{ record / 1000 }} km</h2>
        <div class="search-box__search-bar">
            <v-combobox
                :items="items"
                :search-input.sync="search"
                :loading="isLoading"
                autofocus
                :placeholder="
                    placeGeoJson !== null
                        ? $t('Home.searchBar.customLoaded')
                        : $t('Home.searchBar.enterCity')
                "
                v-model="place"
                :disabled="placeGeoJson !== null"
                :persistent-hint="placeGeoJson !== null"
                :outlined="placeGeoJson !== null"
                background-color="primary"
                append-icon="mdi-magnify"
                dark
                rounded
                height="50"
                full-width
                id="search-input"
            >
            </v-combobox>

            <v-btn
                icon
                class="btn-customs"
                color="primary"
                @click="dialogCustom = !dialogCustom"
                height="50"
            >
                <v-icon>mdi-map-plus</v-icon>
            </v-btn>
        </div>
        <DialogCustomMap
            :visibility="dialogCustom"
            @change-visibility="dialogCustom = !dialogCustom"
            v-model="geoJson"
            :validGeoJson="placeGeoJson !== null"
        />

        <div class="search-box__btns">
            <DialogRoom singlePlayer :place="place" :geoJson="placeGeoJson" />

            <DialogRoom :place="place" :geoJson="placeGeoJson" />
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import DialogCustomMap from '@/components/DialogCustomMap';
import DialogRoom from '@/components/widgets/dialog/DialogRoom';
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
            geoJson: '',
        };
    },

    computed: {
        placeGeoJson() {
            if (this.geoJson == '') {
                return null;
            }
            try {
                let obj = JSON.parse(this.geoJson);
                if (obj.type === 'FeatureCollection' && obj.features) {
                    obj.features.map((f) => {
                        if (
                            !['Point', 'Polygon', 'MultiPolygon'].includes(
                                f.geometry.type
                            )
                        ) {
                            throw new Error('Error Format');
                        }
                    });
                    return obj;
                } else {
                    throw new Error('Error Format');
                }
            } catch (e) {
                return null;
            }
        },

        items() {
            return this.entries.map((entry) => entry.properties.name);
        },
    },

    watch: {
        search(val) {
            // Items have already been requested
            if (!val) return;

            this.isLoading = true;
            // Lazily load input items
            axios
                .get(`https://photon.komoot.de/api/?q=${encodeURI(val)}`)
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
@media (max-width: 380px) {
    .search-box {
        .v-input {
            font-size: 1rem !important;
        }

        .search-box__search-bar {
            flex-direction: column;
            width: 100vw;
            margin: auto;
            .btn-customs {
                margin: 2% auto;
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
