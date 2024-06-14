<template>
    <v-alert
        id="leaderboard-alert"
        transition="slide-x-reverse-transition"
        width="300"
        dark
        class="mt-2 mr-2"
        dismissible
        :value="value"
        @input="(value) => $emit('input', value)"
    >
        <h4>Leaderboard</h4>
        <LeaderboardContent
            :leaderboard="leaderboard"
        />
    </v-alert>

</template>

<script>
import LeaderboardContent from './LeaderboardContent.vue';

export default {
    name: "Leaderboard",
    props: {
        leaderboard: Array,
        value: Boolean, 
    },
    components: {
        LeaderboardContent,
    }
};
</script>

<style scoped lang="scss">
.leaderboard {
    inset: 0;
    position: absolute;
}
#leaderboard-alert {
    opacity: 0.8;
    white-space: pre-line;
    float: right;
}

</style>