<template>
    <div>
        <div class="leaderboard-alert__line" v-for="({name, scoreHeader, guessed, id}) of leaderboard" :key="id">
            <div>
                <v-icon color="green" v-if="guessed">mdi-check</v-icon>
            </div>
            <p>
                {{ name }} {{ scoreHeader ? `: ${scoreHeader}` : ''}}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Leaderboard",
    props: {
        leaderboard: Array,
    },
};
</script>

<style scoped lang="scss">

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