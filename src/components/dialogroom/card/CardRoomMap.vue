<template>
    <v-card id="card-map">
        <v-card-title>
            <span id="card-title"> {{ $t('CardRoomMap.title') }} </span>
        </v-card-title>

        <v-card-text>
            <v-row class="search-bar">
                <v-combobox
                    id="search-input"
                    v-model="place"
                    :items="items"
                    :search-input.sync="search"
                    :loading="isLoading"
                    autofocus
                    :placeholder="$t('Home.searchBar.enterCity')"
                    background-color="secondary"
                    dark
                    rounded
                    height="15"
                    full-width
                    @input="loadPlaceGeoJSON"
                />
                <v-btn
                    @click="loadPlaceGeoJSON(place)"
                    color="dark"
                    dark
                    id="loadBtn"
                    :loading="loadingGeoJson"
                >
                    {{ $t('CardRoomMap.loadBtn') }}
                </v-btn>
            </v-row>
            <GmapMap
                ref="mapRef"
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
        </v-card-text>
        <v-card-actions>
            <v-btn plain v-if="geoJson" @click="reset">{{
                $t('CardRoomMap.reset')
            }}</v-btn>
            <div class="flex-grow-1" />
            <v-btn dark depressed color="error" @click="cancel">
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                id="btnStart"
                dark
                depressed
                color="#43B581"
                @click="next"
                :disabled="loadingGeoJson"
            >
                {{ $t('next') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { SETTINGS_SET_STEP_DIALOG_ROOM } from '../../../store/mutation-types';
import CardRoomMixin from './mixins/CardRoomMixin';
export default {
    name: 'CardRoomMap',
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
            this.addGeoJson(val);
        },
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        if (this.geoJson) {
            this.addGeoJson(this.geoJson);
        }

        this.$refs.mapRef.$mapPromise.then((map) => {
            const streetViewLayer = new google.maps.StreetViewCoverageLayer();
            streetViewLayer.setMap(map);
        });
    },

    methods: {
        ...mapMutations('settingsStore', {
            setStepDialogRoom: SETTINGS_SET_STEP_DIALOG_ROOM,
        }),
        ...mapActions(['loadPlaceGeoJSON', 'setGeoJson']),
        addGeoJson(val) {
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
                } else {
                    map.setZoom(1);
                }
            });
        },
        reset() {
            this.place = '';
            this.setGeoJson(null);
        },
        next() {
            this.setStepDialogRoom('settings');
        },
    },
};
</script>

<style lang="scss" scoped>
.search-bar {
    column-gap: 2rem;
    align-items: baseline;
    padding: 0 1rem;
    margin-bottom: 1rem;
}
</style>
