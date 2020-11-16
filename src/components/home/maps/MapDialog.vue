<template>
    <v-dialog
        v-model="visible"
        max-width="500"
        :fullscreen="$viewport.width < 450"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" text color="darkGreen">
                {{ $t('Home.play') }}
            </v-btn>
        </template>
        <v-card>
            <v-img
                class="white--text align-end"
                height="230px"
                gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
                :src="
                    mapLocate.imageUrl ||
                    `https://source.unsplash.com/500x230/daily?${encodeURI(
                        mapLocate.nameLocate
                    )}`
                "
            >
                <v-card-title>{{ mapLocate.nameLocate }}</v-card-title>
            </v-img>
            <v-card-subtitle class="pt-3 pb-2 font-italic">
                {{ mapLocate.author }}
            </v-card-subtitle>
            <v-card-text class="text--primary map-dialog__description">
                {{ mapLocate.descriptionLocate }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" text @click="visible = false">
                    {{ $t('cancel') }}
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onClickSinglePlayer">
                    {{ $t('DialogRoom.singlePlayer') }}
                </v-btn>

                <v-btn color="secondary" dark @click="onClickMultiPlayer">
                    {{ $t('DialogRoom.withFriends') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    props: ['mapLocate'],
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        ...mapActions([
            'loadGeoJsonFromUrl',
            'playSinglePlayer',
            'playMultiPlayer',
        ]),
        setMap() {
            this.loadGeoJsonFromUrl(this.mapLocate.url);
            this.visible = false;
        },
        onClickSinglePlayer() {
            this.setMap();
            this.playSinglePlayer();
        },
        onClickMultiPlayer() {
            this.setMap();
            this.playMultiPlayer();
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
