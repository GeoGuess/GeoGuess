<template>
    <v-alert
        
        id="leaderboard-alert"
        transition="slide-x-transition"
        width="300"
        dark
        class="mt-2 mr-2"
        dismissible
    >
        <h4>Leaderboard</h4>
        <div class="leaderboard-alert__line" v-for="({name, scoreHeader, guessed, id}) of leaderboard" :key="id">
            <div>
                <v-icon color="green" v-if="guessed">mdi-check</v-icon>
            </div>
            <p>
                {{ name }} : {{ scoreHeader }}
            </p>
        </div>
    </v-alert>
</template>

<script>
export default {
    name: "Leaderboard",
    props: {
        leaderboard: Object,
        leaderboardShown: Boolean 
        
    },
};
</script>

<style scoped lang="scss">
#leaderboard-alert {
    opacity: 0.8;
    white-space: pre-line;
    float: right;
}
.leaderboard-alert__line{
    display: grid;
    grid-template-columns: 1.5rem auto;
    align-items: center;
    gap: 0.5rem;
    p{
        margin: 0;
        vertical-align: baseline;
    }
    margin-top: 0.5rem;
}
</style>