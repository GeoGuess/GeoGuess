<template>
    <footer>
        <div class="footer__container">
            <div class="footer__logo">
                <v-btn
                    class="ml-4 mr-4"
                    icon
                    color="#FFFFFF"
                    href="https://github.com/GeoGuess/Geoguess"
                >
                    <v-icon size="30">mdi-github-circle</v-icon>
                </v-btn>
                <v-btn
                    class="ml-4 mr-4"
                    icon
                    color="#FFFFFF"
                    href="https://discord.gg/9GXm6RT"
                >
                    <v-icon size="30">mdi-discord</v-icon>
                </v-btn>
                <v-btn
                    class="ml-4 mr-4"
                    icon
                    color="#FFFFFF"
                    href="https://twitter.com/BilelJegham"
                >
                    <v-icon size="30">mdi-twitter</v-icon>
                </v-btn>
            </div>
            <div>
                <p>
                    {{ version }} - {{ $t('Footer.under') }}
                    <a
                        href="https://github.com/GeoGuess/Geoguess/blob/master/LICENSE"
                        >MIT license</a
                    >
                </p>
            </div>

            <div>
                <a href="https://geoguess.games/">{{ $t('Header.about') }}</a>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    computed: {
        version() {
            return require('../../../package.json').version;
        },
    },
};
</script>

<style lang="scss">
footer {
    background: #7fad94;
    .footer__container {
        padding: 0.5rem 0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        & > div {
            display: flex;
            & > p,
            a {
                margin: auto;
                color: #484848;
            }
        }

        a {
            font-weight: bold;
        }
    }
}
@media (max-width: 350px) {
    .footer__logo .v-btn.ml-4 {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}
</style>
