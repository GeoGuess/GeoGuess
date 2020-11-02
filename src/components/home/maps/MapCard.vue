<template>
    <v-card width="300" rounded="lg">
        <v-img
            class="white--text align-end"
            height="140px"
            gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
            :src="
                map.imageUrl || `https://source.unsplash.com/300x140/?${name}`
            "
        >
            <v-card-title>{{ name }}</v-card-title>
        </v-img>
        <v-card-actions class="map-card__actions">
            <v-spacer></v-spacer>
            <v-btn
                text
                color="darkGreen"
                v-on:click="() => loadGeoJsonFromUrl(this.map.url)"
            >
                {{ $t('Home.play') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'MapCard',
    props: {
        map: Object,
    },
    computed: {
        name() {
            return this.map.name.en;
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
