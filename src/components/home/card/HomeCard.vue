<template>
    <v-card class="map-card" rounded="lg" width="200">
        <v-img
            class="white--text align-end"
            height="140px"
            gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
            :src="
                data.imageUrl ||
                `https://source.unsplash.com/500x230/weekly?${encodeURI(
                    data.nameLocate
                )}`
            "
        >
            <v-menu v-if="data.custom">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        absolute
                        top
                        right
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon> mdi-file</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="editMap">
                        <v-list-item-title>
                            {{ $t('Home.HomeCard.edit') }}
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteMap">
                        <v-list-item-title>
                            {{ $t('Home.HomeCard.delete') }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-card-title class="map-card__title">
                {{ data.nameLocate }}
            </v-card-title>
        </v-img>
        <v-card-actions class="map-card__actions">
            <v-subheader>
                <v-icon class="map-card__icon">{{
                    type === 'map' ? 'mdi-image-area' : 'mdi-map-marker-circle'
                }}</v-icon>
                {{ $t('Home.HomeCardMode.' + type) }}</v-subheader
            >
            <v-spacer />
            <HomeCardDialog :data="data" :type="type" />
        </v-card-actions>
    </v-card>
</template>

<script>
import HomeCardDialog from '@/components/home/card/HomeCardDialog';
import { mapActions } from 'vuex';
export default {
    name: 'HomeCard',
    components: {
        HomeCardDialog,
    },
    props: {
        data: Object,
        type: {
            type: String,
            validator: (v) => ['map', 'area'].includes(v),
        },
    },
    methods: {
        ...mapActions(['getListMapsCustoms', 'setMapLoaded']),
        async deleteMap() {
            if (this.type === 'map' && this.data.custom) {
                await this.data.delete();
                this.getListMapsCustoms();
            }
        },
        async editMap() {
            this.setMapLoaded(this.data);
            this.$router.push('/custom');
        },
    },
};
</script>

<style lang="scss">
.map-card__actions {
    padding: 1%;
}
.map-card {
    min-width: 300px;
    &:hover {
        transform: scale(1.02);
        box-shadow: 2px 2px 10px 2px rgb(0 0 0 / 20%) !important;
    }
    &__title {
        word-break: break-word;
    }
    &__icon {
        color: #4f665a !important;
        margin-right: 5px;
    }
}
</style>
