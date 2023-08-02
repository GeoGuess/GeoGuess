<template>
    <v-alert
        id="leaderboard-alert"
        transition="slide-x-transition"
        icon="mdi-scoreboard-outline"
        width="400"
        dark
        class="mt-2 mr-2"
        v-if="guessString && !$vuetify.breakpoint.mobile && leaderboardShown"

    >
        {{ guessString }}
    </v-alert>
</template>

<script>
export default {
    name: "Leaderboard",
    props: ["guessString", "leaderboardShown"]
};
</script>

<style scoped lang="scss">
#leaderboard-alert {
    opacity: 0.8;
    white-space: pre-line;
    float: right;
    pointer-events: none;
}
</style>