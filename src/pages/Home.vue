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
            <v-btn id="btnMaps" href="#areas" large fab color="secondary" dark>
                <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
        </section>

        <v-container class="home-page__search">
            <h2 class="home-page__search-title">
                {{ $t('Home.searchTitle') }}
            </h2>
            <v-text-field
                class="home-page__search-input"
                v-model="search"
                clearable
                :placeholder="$t('Home.searchMap.placeholder')"
                prepend-inner-icon="mdi-map-marker"
            />
        </v-container>
        <section id="maps">
            <HomeCard
                v-for="(item, index) in filteredList"
                :key="index"
                :data="item"
                :type="item.constructor.name === 'GeoMap' ? 'map' : 'area'"
            />
        </section>
    </ContentPage>
</template>

<script>
import SearchBox from '@/components/home/SearchBox';
import ContentPage from '@/components/page/ContentPage';
import HomeCard from '@/components/home/card/HomeCard';
import { GeoMap } from '../models/GeoMap';
import { mapActions, mapGetters } from 'vuex';
import { GAME_MODE } from '../constants';
export default {
    components: {
        ContentPage,
        SearchBox,
        HomeCard,
    },
    props: {
        dialogCustomOpen: Boolean,
    },
    data: () => ({
        search: '',
    }),
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
        this.getListMapsCustoms();
    },
    methods: { ...mapActions(['getListMaps', 'getListMapsCustoms']) },
    computed: {
        ...mapGetters(['maps', 'areasList']),
        allContents() {
            const allContents = [...this.maps, ...this.areasList];
            for (let i = allContents.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allContents[i], allContents[j]] = [
                    allContents[j],
                    allContents[i],
                ];
            }
            return allContents;
        },
        filteredList() {
            return this.allContents.filter((map) => {
                return map.nameLocate
                    .toLowerCase()
                    .includes(this.search.toLowerCase());
            });
        },
    },
};
</script>

<style scoped lang="scss">
.v-application--is-rtl .home-page__traveler-img {
    transform: scaleX(-1);
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
    .home-page__search {
        width: 60vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.856);
        border-radius: 8px;
        margin: 100px auto 0 auto;
        &-title {
            color: #468f69;
            font-weight: 400;
        }
        &-input {
            width: 60%;
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
