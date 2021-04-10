<template>
    <v-container class="time-picker">
        <v-row>
            <v-slider
                :value="value"
                class="align-center"
                max="600"
                min="0"
                step="30"
                hide-details
                @change="changeAll"
            />
        </v-row>
        <v-row>
            <div
                v-if="this.value > 0"
                class="time-input"
            >
                <v-text-field
                    :value="Math.floor(this.value / 60)"
                    reverse
                    type="number"
                    class="time-input__minute"
                    @change="changeMinute"
                />
                <p>:</p>

                <v-text-field
                    :value="this.value % 60"
                    type="number"
                    class="time-input__second"
                    @change="changeSecond"
                />
            </div>
            <p
                v-else
                class="infinite--text"
            >
                {{ $t('CardRoomTime.infinite') }}
            </p>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: ['value'],
    methods: {
        changeAll(time) {
            // click on the slider
            this.$emit('input', time);
        },
        changeMinute(m) {
            // Tape in input minute
            this.$emit('input', (this.value % 60) + parseInt(m) * 60); // Get number seconds and add minutes
        },
        changeSecond(s) {
            // Tape in input second
            this.$emit('input', Math.floor(this.value / 60) * 60 + parseInt(s)); // Get number minutes and add seconds
        },
    },
};
</script>
<style lang="scss" scoped>
.time-input {
    display: flex;
    margin: auto;
    p {
        line-height: 4;
        margin: 0 1rem;
    }
    .v-input {
        width: 3rem;
    }
}
.infinite--text {
    text-align: center;
    font-size: 1rem;
    width: 100%;
    line-height: 3.5rem;
}
</style>
