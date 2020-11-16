<template>
    <div class="home-page">
        <Header />
        <section class="home-page__main">
            <v-container class="home-page__main__container" fluid>
                <v-layout row class="home-page__main__layout">
                    <div class="home-page__traveler-container">
                        <img
                            class="home-page__traveler-img"
                            src="../assets/home/traveller.svg"
                        />
                    </div>
                    <v-layout row class="home-page__main__content">
                        <div class="box">
                            <SearchBox />
                        </div>
                    </v-layout>
                </v-layout>
            </v-container>
            <v-btn id="btnMaps" href="#maps" large fab color="secondary" dark>
                <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
        </section>
        <section id="maps">
            <v-row>
                <v-col v-for="(map, index) in maps" v-bind:key="index">
                    <MapCard :map="map" />
                </v-col>
            </v-row>
        </section>

        <Footer />
    </div>
</template>

<script>
import Header from '@/components/home/Header';
import SearchBox from '@/components/home/SearchBox';
import Footer from '@/components/home/Footer';
import MapCard from '@/components/home/maps/MapCard';
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {
        Header,
        Footer,
        SearchBox,
        MapCard,
    },
    mounted() {
        if (this.$route.params && this.$route.params.partyParams) {
            const params = atob(this.$route.params.partyParams)
                .split(',')
                .map((val) => parseFloat(val));

            if (params.length === 12) {
                const difficulty = params[0];
                const timeLimitation = params[1];
                const rounds = [
                    params.slice(2, 4),
                    params.slice(4, 6),
                    params.slice(6, 8),
                    params.slice(8, 10),
                    params.slice(10, 12),
                ];
                this.$router.push({
                    name: 'street-view',
                    params: {
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
    computed: { ...mapGetters(['maps']) },
};
</script>

<style scoped lang="scss">
.home-page {
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
                    min-width: 400px;
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
    #maps {
        padding: 2% 5%;
    }
}

@media (max-width: 660px) {
    .home-page {
        background-color: #ded3af;
        .home-page__main__container {
            .home-page__main__layout {
                flex-direction: column-reverse;
            }
        }
    }
}
</style>
