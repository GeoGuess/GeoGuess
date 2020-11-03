<template>
    <v-dialog
        v-model="visible"
        persistent
        max-width="500"
        :fullscreen="$viewport.width < 450"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                text
                color="darkGreen"
                v-on:click="() => loadGeoJsonFromUrl(this.map.url)"
            >
                {{ $t('Home.play') }}
            </v-btn>
        </template>
        <v-card>
            <v-img
                class="white--text align-end"
                height="230px"
                gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
                :src="
                    map.imageUrl ||
                    `https://source.unsplash.com/300x140/daily?${name}`
                "
            >
                <v-card-title>{{ this.map.name.en }}</v-card-title>
            </v-img>
            <v-card-subtitle class="pt-3 pb-2 font-italic">
                {{ this.map.author }}
            </v-card-subtitle>
            <v-card-text class="text--primary map-dialog__description">
                {{ this.map.description.en }}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="visible = false">
                    {{ $t('cancel') }}
                </v-btn>

                <v-btn color="#43B581" dark @click="setMap">
                    {{ $t('Home.play') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    props: ['map'],
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        ...mapActions(['loadGeoJsonFromUrl']),
        setMap() {
            this.loadGeoJsonFromUrl(this.map.url);
            this.visible = false;
        },
    },
};
</script>

<style scoped>
.map-dialog__description {
    max-height: 20vh;
    overflow-y: auto;
}
</style>
