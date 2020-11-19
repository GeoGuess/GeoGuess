<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomRounds.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-slider
                        :value="rounds"
                        class="align-center"
                        v-on:change="changeRounds"
                        max="20"
                        min="1"
                        step="1"
                        hide-details
                    >
                    </v-slider>
                </v-row>
                <v-row>
                    <v-text-field
                        :value="this.rounds"
                        v-on:change="changeRounds"
                        type="number"
                    ></v-text-field>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn dark depressed color="#43B581" @click="setRounds">{{
                $t('next')
            }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            rounds: 5,
        };
    },
    methods: {
        setRounds() {
            this.$emit('setRounds', this.rounds);
        },
        changeRounds(rounds) {
            // click on the slider
            this.rounds = rounds;
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>

<style lang="scss" scoped>
#card-title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
}
.rounds-input {
    display: flex;
    margin: auto;
    p {
        line-height: 4;
        margin: 0 1rem;
    }
    .v-input {
        width: 10rem;
    }
}
</style>
