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
                            <SearchBox />
                        </div>
                    </v-layout>
                </v-layout>
            </v-container>
            <v-btn id="btnMaps" href="#areas" large fab color="secondary" dark>
                <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
        </section>
        <v-container id="areas"> <h2>{{$t('Home.Sections.areasTitle')}}</h2></v-container>
        <section class="sliders-container">
            <v-slide-group show-arrows="always">
                <v-slide-item
                    v-for="(mode, index) in areasList"
                    :key="index"
                    class="ma-4"
                >
                    <HomeCard :data="mode" type="area" />
                </v-slide-item>
            </v-slide-group>
        </section>
        <v-container><h2>{{$t('Home.Sections.mapsTitle')}}</h2></v-container>
        <section id="maps">
            <HomeCard
                v-for="(map, index) in maps"
                :key="index"
                :data="map"
                type="map"
            />
        </section>
    </ContentPage>
</template>

<script>
import SearchBox from '@/components/home/SearchBox';
import ContentPage from '@/components/page/ContentPage';
import HomeCard from '@/components/home/card/HomeCard';
import { mapActions, mapGetters } from 'vuex';
import { GAME_MODE } from '../constants';
export default {
    components: {
        ContentPage,
        SearchBox,
        HomeCard,
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
        this.getListMaps();
    },
    methods: { ...mapActions(['getListMaps']) },
    computed: {
        ...mapGetters(['maps', 'areasList']),
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
    background-color: #ded3af;
    .home-page__main {
        position: relative;

        .home-page__main__container {
            font-size: 1.2rem;
            padding: 0;
            margin: 0;
            width: 100%;
            background: url('../assets/home/world.svg');
            background-size: cover;
            .home-page__main__layout {
                height: calc(100vh - 100px);
                flex-wrap: nowrap;
                justify-items: end;
                .box {
                    margin: 28vh auto;
                    width: 35vw;
                    max-width: 100%;
                }

                .home-page__main__content {
                    min-width: 65%;
                }
                .home-page__traveler-container {
                    position: relative;
                    height: auto;
                    width: 100%;
                    max-width: 50vw;
                    .home-page__traveler-img {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        max-width: 772px;
                        max-height: 814px;
                    }
                }
            }
        }
        #btnMaps {
            position: absolute;
            margin: auto;
            bottom: 4rem;
            left: 0;
            right: 0;
        }
    }
    .sliders-container {
        max-width: 100vw;
    }
    #maps {
        padding: 3rem 15px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        column-gap: 30px;
        row-gap: 1.5rem;
        justify-items: center;
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

@media (max-width: 330px) {
    .home-page #maps {
        grid-auto-columns: 90%;
        column-gap: 0;
        padding: 3rem 10px;
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
