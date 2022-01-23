<template>
    <v-dialog
        v-model="visible"
        max-width="500"
        :fullscreen="$viewport.width < 450"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" text color="darkGreen" v-on="on">
                {{ $t('Home.play') }}
            </v-btn>
        </template>
        <v-card>
            <v-img
                class="white--text align-end"
                height="230px"
                gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
                :src="data.imageSrc"
            >
                <v-card-title>{{ data.nameLocate }}</v-card-title>
            </v-img>
            <v-card-subtitle class="pt-3 pb-2 font-italic">
                {{ data.author }}
            </v-card-subtitle>
            <v-card-text class="text--primary map-dialog__description">
                {{ data.descriptionLocate }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" text @click="visible = false">
                    {{ $t('cancel') }}
                </v-btn>

                <v-spacer />
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
import { mapActions, mapMutations } from 'vuex';
import { SETTINGS_SET_GAME_SETTINGS } from '../../../store/mutation-types';
export default {
    props: {
        data: Object,
        type: {
            type: String,
            validator: (v) => ['map', 'area'].includes(v),
        },
    },
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        ...mapMutations('settingsStore', {
            setGameSettings: SETTINGS_SET_GAME_SETTINGS,
        }),
        ...mapActions('settingsStore', ['openDialogRoom']),
        ...mapActions(['loadGeoJsonFromUrl', 'setGeoJson', 'setMapLoaded', 'loadMap']),
        setMap() {
            if (this.type === 'area') {
                this.loadGeoJsonFromUrl(this.data.data.urlArea);
                this.setGameSettings({ areaParams: this.data });
            } else {
                if (this.data.type === 'custom') {
                    this.setMapLoaded(this.data);
                } else {
                    this.loadMap(this.data);
                }
            }
            this.visible = false;
        },
        onClickSinglePlayer() {
            this.setMap();
            this.openDialogRoom(true);
        },
        onClickMultiPlayer() {
            this.setMap();
            this.openDialogRoom(false);
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
