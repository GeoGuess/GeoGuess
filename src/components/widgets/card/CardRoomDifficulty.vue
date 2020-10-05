<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomDifficulty.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="6" sm="4" md="4" lg="4" xl="4">
                        <v-autocomplete
                            v-model="difficulty"
                            :items="difficultyItems"
                            autofocus
                            v-on:keyup.enter="searchRoom"
                        ></v-autocomplete> </v-col
                ></v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn dark depressed color="#43B581" @click="searchRoom">{{
                $t('next')
            }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: ['errorMessage'],
    data() {
        return {
            difficulty: 0,
            difficultyItems: [
                {
                    text: this.$t('CardRoomDifficulty.easy'),
                    value: 0,
                },
                {
                    text: this.$t('CardRoomDifficulty.medium'),
                    value: 1,
                },
                {
                    text: this.$t('CardRoomDifficulty.hard'),
                    value: 2,
                },
            ],
        };
    },
    methods: {
        searchRoom() {
            // Pass room name to parent component
            this.$emit('setDifficulty', this.difficulty);
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>

<style scoped>
#card-title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
}
</style>
