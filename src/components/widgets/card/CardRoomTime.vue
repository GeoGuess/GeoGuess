<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomTime.title') }}</span>
        </v-card-title>
        <v-card-text> </v-card-text>
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
</style>
