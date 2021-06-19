<template>
    <v-card class="map-card" rounded="lg" width="200">
        <v-img
            class="white--text align-end"
            height="140px"
            gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
            :src="
                data.imageUrl ||
                    `https://source.unsplash.com/500x230/daily?${encodeURI(
                        data.nameLocate
                    )}`
            "
        >
            <v-card-title>
                {{ data.nameLocate }}
            </v-card-title>
        </v-img>
        <v-card-actions class="map-card__actions">
            <v-subheader>{{ $t('Home.HomeCardMode.' + type) }}</v-subheader>
            <v-spacer />
            <HomeCardDialog :data="data" :type="type" />
        </v-card-actions>
    </v-card>
</template>

<script>
import HomeCardDialog from '@/components/home/card/HomeCardDialog';
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
};
</script>

<style lang="scss">
.map-card__actions {
    padding: 1%;
}
.map-card {
    min-width: 300px;
}
</style>
