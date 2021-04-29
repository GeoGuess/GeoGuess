<template>
    <div class="time_detail">
        <v-chip color="#424242" dark v-if="playerName">
            <v-avatar
                :color="
                    ['#E91B0C', '#5ccc00', '#e0ca00', '#FF1F69', '#00b8b8'][
                        index % 5
                    ]
                "
                left
            >
                {{ playerName.slice(0, 2).toUpperCase() }}
            </v-avatar>
            {{ playerName }}
        </v-chip>
        <p v-for="(r, index) in rounds" :key="`round_${index}`">
            <b>
                {{ $t('HeaderGame.round') }}
                {{ index + 1 }} :
            </b>
            {{ durationToText(r.timePassed / 1000) }}
        </p>

        <p>
            <b> {{ $t('History.total') }} : </b>
            {{ durationToText(getTotalDuration(rounds)) }}
        </p>
    </div>
</template>

<script>
import { getCountdownText } from '@/utils';
export default {
    props: {
        rounds: {
            type: Array,
            required: true,
        },
        playerName: {
            type: String,
            required: false,
        },
        index: {
            type: Number,
            required: false,
        },
    },
    methods: {
        durationToText(time) {
            return getCountdownText(Math.floor(time));
        },
        getTotalDuration(rounds) {
            return rounds.reduce(
                (acc, { timePassed }) => acc + Math.floor(timePassed / 1000),
                0
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.time_detail {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 0.3em 0;
    .v-chip {
        width: 8.875rem;
    }
    p {
        margin: 0;
    }
}
</style>
