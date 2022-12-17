<template>
    <ContentPage class="home-page">
        <section class="home-page__main">
            <v-container class="home-page__main__container" fluid>
                <v-layout class="home-page__main__layout">
                    <div class="home-page__traveler-container">
                        <img
                            class="home-page__traveler-img"
                            src="../assets/home/traveller.svg"
                        />
                    </div>
                    <v-layout class="home-page__main__content">
                        <div class="box">
                            <SearchBox :dialogCustomOpen="dialogCustomOpen" />
                        </div>
                    </v-layout>
                </v-layout>
            </v-container>
            <v-btn id="btnMaps" href="#maps-container" large fab color="secondary" dark>
                <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
        </section>
        <MapsContainer />
    </ContentPage>
</template>

<script>
import SearchBox from '@/components/home/SearchBox';
import ContentPage from '@/components/page/ContentPage';
import { GAME_MODE } from '../constants';
import MapsContainer from '@/components/home/MapsContainer.vue';
export default {
    components: {
        ContentPage,
        SearchBox,
        MapsContainer,
    },
    props: {
        dialogCustomOpen: Boolean,
    },
    mounted() {
        if (this.$route.params && this.$route.params.partyParams) {
            const params = atob(this.$route.params.partyParams)
                .split(',')
                .map((val) => parseFloat(val));

            if (params.length >= 12 && params.length % 2 === 0) {
                const difficulty = params[0];
                const timeLimitation = params[1];
                const rounds = new Array((params.length - 2) / 2)
                    .fill(0)
                    .map((_, round) => {
                        const index = (round + 1) * 2;
                        return params.slice(index, index + 2);
                    });

                this.$router.push({
                    name: 'street-view',
                    params: {
                        modeSelected: GAME_MODE.CLASSIC,
                        time: timeLimitation,
                        difficulty: difficulty,
                        roundsPredefined: rounds,
                    },
                });
            }
        }
    },
};
</script>

<style scoped lang="scss">
.v-application--is-rtl .home-page__traveler-img{
    transform: scaleX(-1)

}
.home-page {
    .demo-alert {
        position: absolute;
        z-index: 1;
        width: 100%;
    }
    background-color: var(--v-home-base);
    .home-page__main {
        position: relative;
      .theme--light & .home-page__main__container {
        background: url('../assets/home/world.svg');
      }
      .theme--dark & .home-page__main__container {
        background: url('../assets/home/world-dark.svg');
      }
        .home-page__main__container {
            font-size: 1.2rem;
            padding: 0;
            margin: 0;
            width: 100%;
            background-size: cover;
            background-position: top;
            .home-page__main__layout {
                height: calc(70vh - 100px);
                flex-wrap: nowrap;
                justify-items: end;
                .box {
                    margin: auto;
                    width: 35vw;
                    max-width: 100%;
                }

                .home-page__main__content {
                    min-width: 65%;
                }
                .home-page__traveler-container {
                    height: auto;
                    width: 100%;
                    max-width: 50vw;
                    display: flex;
                    justify-content: flex-start;
                    .home-page__traveler-img {
                        max-width: 30vw;
                        max-height: 60vh;
                    }
                }
            }
        }
        #btnMaps {
            position: absolute;
            margin: auto;
            bottom: 0.4rem;
            left: 0;
            right: 0;
        }
    }
    
}
@media (max-width: 1300px) and (min-width: 600px) {
    .home-page
        .home-page__main
        .home-page__main__container
        .home-page__main__layout
        .box {
        width: 60vw;
    }
}
@media (max-width: 660px) {
    .home-page {
        background-color: #ded3af;
        .home-page__main .home-page__main__container {
            .home-page__main__layout {
                flex-direction: column-reverse;

                .box {
                    width: 90vw;
                }
            }
        }
    }
}


@media (max-height: 550px) {
    .home-page
        .home-page__main
        .home-page__main__container
        .home-page__main__layout
        .box {
        margin: 10vh;
    }

    #btnMaps {
        display: none;
    }
}
</style>
