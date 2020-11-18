<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomTime.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-slider
                        :value="roundsLimitation"
                        class="align-center"
                        v-on:change="changeAll"
                        max="20"
                        min="1"
                        step="1"
                        hide-details
                    >
                    </v-slider>
                </v-row>
                <v-row>
                        <v-text-field
                            :value="this.roundsLimitation"
                            v-on:change="changeRounds"
                            type="number"
                        ></v-text-field>
                    </div>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn dark depressed color="#43B581" @click="setRoundsLimitation">{{
                $t('next')
            }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { getCountdownText } from '@/utils';
export default {
    data() {
        return {
            roundsLimitation: 5,
        };
    },
    computed: {
        getTextTime() {
            return getCountdownText(this.roundsLimitation);
        },
    },
    methods: {
        setTimeLimitation() {
            // Pass time limitation to parent component
            this.$emit('setRoundsLimitation', this.roundsLimitation);
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
.infinite--text {
    text-align: center;
    font-size: 1rem;
    width: 100%;
}
</style>
