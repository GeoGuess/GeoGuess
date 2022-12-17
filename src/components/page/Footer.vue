<template>
    <footer>
        <div class="footer__container">
            <div class="footer__logo">
                <v-btn
                    icon
                    color="#FFFFFF"
                    href="https://github.com/GeoGuess/Geoguess"
                >
                    <v-icon size="30">
                        mdi-github
                    </v-icon>
                </v-btn>
                <v-btn
                    icon
                    color="#FFFFFF"
                    href="https://discord.gg/9GXm6RT"
                >
                    <v-icon size="30">
                        mdi-discord
                    </v-icon>
                </v-btn>
                <v-btn
                    icon
                    color="#FFFFFF"
                    href="https://twitter.com/BilelJegham"
                >
                    <v-icon size="30">
                        mdi-twitter
                    </v-icon>
                </v-btn>
                <v-btn
                    icon
                    color="#FFFFFF"
                    href="https://www.instagram.com/geoguess.games/"
                >
                    <v-icon size="30">
                        mdi-instagram
                    </v-icon>
                </v-btn>
            </div>
            <div class="licence">
                <p class="mb-0">
                    {{ version }} - {{ $t('Footer.under') }}
                    <a
                        href="https://github.com/GeoGuess/Geoguess/blob/master/LICENSE"
                    >MIT license</a>
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
    background: var(--v-footer-base);
    .footer__container {
        padding: 0.5rem 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
        align-items: center;
        .theme--light & p, a {
            color: #484848;
        }
        .theme--dark & p, a {
            color: #FFFFFF;
        }
        a {
            font-weight: bold;
        }      
    }
    .footer__logo{        
        display: grid;
        grid-template-columns: repeat(4, minmax(36px, 1fr));
        justify-items: center;
        column-gap: 1.5rem;
    }
}

@media (max-width: 430px) {
    footer .footer__container div.licence{
        display: none;
    }
}
</style>
