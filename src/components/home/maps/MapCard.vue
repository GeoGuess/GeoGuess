<template>
    <v-card width="300" rounded="lg">
        <v-img
            class="white--text align-end"
            height="140px"
            gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
            :src="
                imageUrl || `https://source.unsplash.com/300x140/?${this.name}`
            "
        >
            <v-card-title>France</v-card-title>
        </v-img>
        <v-card-actions class="map-card__actions">
            <v-spacer></v-spacer>
            <v-btn text color="darkGreen"> {{ $t('Home.play') }} </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'MapCard',
    props: {
        name: String,
        imageUrl: String,
    },
};
</script>

<style lang="scss">
.map-card__actions {
    padding: 1%;
}
</style>
