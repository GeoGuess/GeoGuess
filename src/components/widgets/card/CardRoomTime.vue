<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomTime.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-slider
                        :value="timeLimitation"
                        class="align-center"
                        v-on:change="changeAll"
                        max="600"
                        min="0"
                        step="30"
                        hide-details
                    >
                    </v-slider>
                </v-row>
                <v-row>
                    <div class="time-input" v-if="this.timeLimitation > 0">
                        <v-text-field
                            :value="Math.floor(this.timeLimitation / 60)"
                            v-on:change="changeMinute"
                            type="number"
                        ></v-text-field>
                        <p>:</p>

                        <v-text-field
                            :value="this.timeLimitation % 60"
                            v-on:change="changeSecond"
                            type="number"
                        ></v-text-field>
                    </div>
                    <p v-else class="infinite--text">
                        {{ $t('CardRoomTime.infinite') }}
                    </p>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn dark depressed color="#43B581" @click="setTimeLimitation">{{
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
            timeLimitation: 0,
        };
    },
    computed: {
        getTextTime() {
            return getCountdownText(this.timeLimitation);
        },
    },
    methods: {
        setTimeLimitation() {
            // Pass time limitation to parent component
            this.$emit('setTimeLimitation', this.timeLimitation);
        },
        changeAll(time) {
            // click on the slider
            this.timeLimitation = time;
        },
        changeMinute(m) {
            // Tape in input minute
            this.timeLimitation = (this.timeLimitation % 60) + parseInt(m) * 60; // Get number seconds and add minutes
        },
        changeSecond(s) {
            // Tape in input second
            this.timeLimitation =
                Math.floor(this.timeLimitation / 60) * 60 + parseInt(s); // Get number minutes and add seconds
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
.time-input {
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
