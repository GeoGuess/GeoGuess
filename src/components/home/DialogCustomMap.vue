<template>
    <v-dialog
        :value="this.visibility"
        @input="$emit('change-visibility')"
        scrollable
        :fullscreen="$viewport.width < 450"
    >
        <v-card class="dialog-customs">
            <v-btn class="close-btn" icon @click="$emit('change-visibility')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-title>
                <p>{{ $t('DialogCustomMap.title') }}</p>
            </v-card-title>
            <v-card-text>
                <v-row no-gutters class="dialog-customs__row">
                    <v-col md="5" sm="12" class="mr-6">
                        <v-skeleton-loader
                            v-if="loading"
                            class="mx-auto"
                            height="500"
                            type="image"
                        ></v-skeleton-loader>
                        <div v-else>
                            <v-alert
                                type="error"
                                v-if="isValidGeoJson === false"
                                transition="out-in"
                            >
                                {{ $t('DialogCustomMap.invalid') }}
                            </v-alert>

                            <GmapMap
                                :center="{ lat: 10, lng: 10 }"
                                :zoom="1"
                                ref="mapRef"
                                map-type-id="roadmap"
                                style="width: 100%; height: 500px"
                                :options="{
                                    gestureHandling: 'greedy',
                                }"
                            >
                            </GmapMap>
                            <v-row>
                                <v-btn
                                    class="mt-6 mr-auto ml-auto"
                                    @click="saveGeoJson"
                                    color="secondary"
                                >
                                    <v-icon left dark>
                                        mdi-cloud-download
                                    </v-icon>
                                    {{ $t('DialogCustomMap.download') }}
                                </v-btn>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col>
                        <v-radio-group v-model="type" row>
                            <v-radio
                                :label="$t('DialogCustomMap.text')"
                                value="text"
                            ></v-radio>
                            <v-radio
                                :label="$t('DialogCustomMap.url')"
                                value="url"
                            ></v-radio>
                            <v-radio
                                :label="$t('DialogCustomMap.file')"
                                value="file"
                            ></v-radio>
                            <v-radio
                                :label="$t('DialogCustomMap.edit')"
                                value="edit"
                            ></v-radio>
                        </v-radio-group>
                        <v-file-input
                            v-if="type === 'file'"
                            :label="$t('DialogCustomMap.fileLabel')"
                            v-model="file"
                            prepend-icon="mdi-map"
                        ></v-file-input>
                        <v-text-field
                            v-else-if="type === 'url'"
                            placeholder="https://gist.github.com/..."
                            label="Url"
                            type="text"
                            v-model="url"
                            :rules="rulesUrl"
                        />
                        <v-textarea
                            v-else
                            :error="isValidGeoJson !== null && !isValidGeoJson"
                            :success="isValidGeoJson"
                            :value="geoJsonString"
                            v-on:input="onChangeTextArea"
                            :placeholder="placeholderGeoJson"
                            :rules="rulesTextArea"
                            rows="21"
                            filled
                            clearable
                            :loading="loading"
                        >
                        </v-textarea>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn dark color="primary" @click="$emit('change-visibility')">
                    {{ $t('DialogCustomMap.OK') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { validURL } from '@/utils';
import { download, isGeoJSONValid } from '../../utils';

export default {
    name: 'DialogCustomMap',
    props: ['visibility'],
    data() {
        return {
            rulesUrl: [(value) => validURL(value)],
            rulesTextArea: [(value) => this.checkIfStringGeoJsonValid(value)],
            type: 'text',
            file: null,
            url: '',
            initMap: false,
            editMap: false,
            loading: false,
        };
    },
    computed: {
        ...mapGetters(['geoJsonString', 'isValidGeoJson', 'geoJson']),
        placeholderGeoJson() {
            return this.loading ? '' : geoJsonExample;
        },
    },
    methods: {
        ...mapActions(['loadGeoJsonFromUrl', 'setGeoJson', 'setGeoJsonString']),
        checkIfStringGeoJsonValid(string) {
            try {
                return isGeoJSONValid(JSON.parse(string));
            } catch (e) {
                return false;
            }
        },

        onChangeTextArea(e) {
            this.setGeoJsonString(e);
        },

        onChangeMap() {
            this.editMap = true;
            this.$refs.mapRef.$mapPromise.then((map) => {
                map.data.toGeoJson((geoJson) => this.setGeoJson(geoJson));
            });
        },
        saveGeoJson() {
            download(
                this.geoJsonString,
                'geoguessMap_' + new Date().toISOString() + '.geojson',
                'application/vnd.geo+json'
            );
        },
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        if ('launchQueue' in window) {
            launchQueue.setConsumer((launchParams) => {
                if (
                    !Array.isArray(launchParams.files) ||
                    launchParams.files.length !== 1
                ) {
                    return;
                }
                launchParams.files[0].getFile().then((f) => {
                    this.loading = true;
                    this.$emit('change-visibility');
                    f.text()
                        .then((content) => {
                            return this.setGeoJsonString(content);
                        })
                        .then(() => {
                            this.loading = false;
                        });
                });
            });
        }
    },
    updated() {
        if (!this.initMap) {
            this.$nextTick(() => {
                if (this.$refs.mapRef)
                    this.$refs.mapRef.$mapPromise.then((map) => {
                        const streetViewLayer = new google.maps.StreetViewCoverageLayer();
                        streetViewLayer.setMap(map);
                        let data = new google.maps.Data({
                            map: map,
                        });
                        if (this.geoJson) data.addGeoJson(this.geoJson);
                        map.data.setMap(null);
                        map.data = data;
                        this.initMap = true;
                    });
            });
        }
    },
    watch: {
        geoJson(v) {
            if (!this.$refs.mapRef) {
                return;
            }
            if (!this.editMap) {
                this.$refs.mapRef.$mapPromise.then((map) => {
                    let data = new google.maps.Data({
                        map: map,
                        style: map.data.getStyle(),
                        controls: map.data.getControls(),
                    });
                    try {
                        data.addGeoJson(v);
                    } catch (e) {
                        throw e;
                    }

                    if (this.type === 'edit') {
                        data.addListener('addfeature', this.onChangeMap);
                        data.addListener('removefeature', this.onChangeMap);
                        data.addListener('setgeometry', this.onChangeMap);
                    }
                    map.data.setMap(null);
                    map.data = data;
                });
            } else {
                this.editMap = false;
            }
        },
        file(file) {
            if (typeof file === 'object' && !!file.text) {
                file.text().then((content) => {
                    this.setGeoJsonString(content);
                });
            }
        },
        url(value) {
            this.loadGeoJsonFromUrl(value);
        },
        type(t) {
            this.$refs.mapRef.$mapPromise.then((map) => {
                if (t === 'edit') {
                    map.data.setControls(['Point', 'Polygon']);
                    map.data.setStyle({
                        editable: true,
                        draggable: true,
                    });
                    map.data.addListener('addfeature', this.onChangeMap);
                    map.data.addListener('removefeature', this.onChangeMap);
                    map.data.addListener('setgeometry', this.onChangeMap);
                } else {
                    map.data.setControls(null);
                    map.data.setStyle({});

                    map.data.removeEventListener(
                        'addfeature',
                        this.onChangeMap
                    );
                    map.data.removeEventListener(
                        'removefeature',
                        this.onChangeMap
                    );
                    map.data.removeEventListener(
                        'setgeometry',
                        this.onChangeMap
                    );
                }
            });
        },
    },
};

const geoJsonExample = `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[ [0, 0.0], [10.0, 0.0], [10, 20], [0.0, 20], [0, 0.0] ]]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[ [0, 0.0], [10.0, 0.0], [10, 20], [0.0, 20], [0, 0.0] ]]
      }
    }
   ]
}`;
</script>
<style lang="scss" scoped>
.dialog-customs {
    background: #fffaec;
}

@media (max-width: 400px) {
    .v-card__text {
        width: calc(100% - 25px);
    }
    .dialog-customs__row {
        display: block;
    }
}
</style>
