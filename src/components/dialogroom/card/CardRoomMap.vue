<template>
    <v-card id="card-playername">
        <v-card-title>
            <span id="card-title">
                {{ $t('CardRoomPlayerName.title') }}
            </span>
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-combobox
                    v-model="place"
                    :items="items"
                    :search-input.sync="search"
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
                    height="20"
                    full-width
                />
                <v-btn @click="loadPlaceGeoJSON(place)"> Load MAP </v-btn>
            </v-row>
            <GmapMap
                ref="mapRef"
                :class="{ 'd-none': loadingGeoJson }"
                :center="{ lat: 10, lng: 10 }"
                :zoom="1"
                map-type-id="roadmap"
                style="width: 100%; height: 400px"
                :options="{
                    mapTypeControl: false,
                    fullscreenControl: false,
                    gestureHandling: 'greedy',
                }"
            />

            <v-skeleton-loader
                v-if="loadingGeoJson"
                class="mx-auto"
                style="width: 100%; height: 400px"
                type="image"
            />
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn dark depressed color="#FF5252" @click="cancel">
                {{ $t('cancel') }}
            </v-btn>
            <v-btn id="btnStart" dark depressed color="#43B581">
                {{ $t('next') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import bbox from '@turf/bbox';
import { mapActions, mapGetters, mapState } from 'vuex';
import CardRoomMixin from './mixins/CardRoomMixin';
export default {
    mixins: [CardRoomMixin],
    data() {
        return {
            place: '',
            entries: [],
            isLoading: false,
            search: '',
        };
    },
    computed: {
        ...mapGetters(['isValidGeoJson', 'geoJson']),
        ...mapState({
            loadingGeoJson: (state) => state.homeStore.loadingGeoJson,
        }),
        items() {
            return this.entries.map((entry) => entry.properties.name);
        },
    },
    watch: {
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
        geoJson(val) {
            this.setGeoJson(val);
        },
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        if (this.placeGeoJson) {
            this.setGeoJson(this.placeGeoJson);
        }

        this.$refs.mapRef.$mapPromise.then((map) => {
            const streetViewLayer = new google.maps.StreetViewCoverageLayer();
            streetViewLayer.setMap(map);
        });
    },

    methods: {
        ...mapActions(['loadPlaceGeoJSON']),
        setGeoJson(val) {
            this.$refs.mapRef.$mapPromise.then((map) => {
                map.data.setMap(null);
                let data = new google.maps.Data({
                    map: map,
                });
                if (val) data.addGeoJson(val);
                map.data = data;
                if (val && val.bbox) {
                    map.fitBounds({
                        east: val.bbox[2],
                        north: val.bbox[3],
                        south: val.bbox[1],
                        west: val.bbox[0],
                    });
                }
            });
        },
    },
};
</script>
