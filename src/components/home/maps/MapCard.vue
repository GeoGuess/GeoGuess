<template>
    <v-card width="300" rounded="lg">
        <v-img
            class="white--text align-end"
            height="140px"
            gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
            :src="
                mapLocate.imageUrl ||
                `https://source.unsplash.com/300x140/daily?${encodeURI(
                    mapLocate.nameLocate
                )}`
            "
        >
            <v-card-title>{{ mapLocate.nameLocate }}</v-card-title>
        </v-img>
        <v-card-actions class="map-card__actions">
            <v-spacer></v-spacer>
            <MapDialog :mapLocate="mapLocate" />
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import MapDialog from '@/components/home/maps/MapDialog';
export default {
    name: 'MapCard',
    components: {
        MapDialog,
    },
    props: {
        map: Object,
    },
    computed: {
        mapLocate() {
            return {
                ...this.map,
                nameLocate:
                    this.map.name[this.$i18n.locale] || this.map.name['en'],
                descriptionLocate:
                    this.map.description[this.$i18n.locale] ||
                    this.map.description['en'],
            };
        },
    },
    methods: {
        ...mapActions(['loadGeoJsonFromUrl']),
    },
};
</script>

<style lang="scss">
.map-card__actions {
    padding: 1%;
}
</style>
