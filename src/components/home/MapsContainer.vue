<template>
    <div id="maps-container">
        <div class="maps-container__header">
            <v-checkbox
                v-model="showAreas"
                :label="$t('Home.HomeCardMode.area')"
                dense
                hide-details
            />
            <v-checkbox
                v-model="showMaps"
                :label="$t('Home.HomeCardMode.map')"
                dense
                hide-details
            />
            <v-text-field
                v-model="search"
                class="pl-3"
                prepend-inner-icon="mdi-magnify"
                filled
                outlined
                single-line
                dense
                hide-details
                width="50px"
            />
        </div>
        <template 
            v-if="showAreas"
        >
            <v-container> <h2>{{ $t('Home.Sections.areasTitle') }}</h2></v-container>
            <section
                v-if="search === '' && showMaps"
                class="sliders-container"
            >
                <v-slide-group show-arrows="always">
                    <v-slide-item
                        v-for="(mode, index) in areasFiltered"
                        :key="index"
                        class="ma-4"
                    >
                        <HomeCard
                            :data="mode"
                            type="area"
                        />
                    </v-slide-item>
                </v-slide-group>
            </section>
            <section
                v-else
                class="maps"
            >
                <HomeCard
                    v-for="(mode, index) in areasFiltered"
                    :key="index"
                    :data="mode"
                    type="area"
                />
            </section>
        </template>
        <template 
            v-if="showMaps"
        >
            <v-container><h2>{{ $t('Home.Sections.mapsTitle') }}</h2></v-container>
            <section class="maps">
                <HomeCard
                    v-for="(map, index) in mapsFiltered"
                    :key="index"
                    :data="map"
                    type="map"
                />
            </section>
        </template>
        <p
            v-if="!showMaps && !showAreas"
            class="no-results subtitle-1"
        >
            {{ $t('Home.Sections.pleaseSelectLabel') }} <a
                @click="doBarrelRoll"
            >
                {{ $t('Home.Sections.barrelRoll') }} ;)
            </a>
        </p>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import HomeCard from '@/components/home/card/HomeCard';

export default {
    components: {
        HomeCard,
    },
  
    data() {
        return {
            search: '',
            showAreas: true,
            showMaps: true,
        };
    },

    computed: {
        ...mapGetters(['maps', 'areasList']),
        mapsFiltered() {
            if(this.search === '') {
                return this.maps;
            }
            return this.maps.filter(map => this.filterMethods(map));
        },
        areasFiltered() {
            if(this.search === '') {
                return this.areasList;
            }
            return this.areasList.filter(area => this.filterMethods(area));
        },
    },

    mounted() {
        this.getListMaps();
        this.getListMapsCustoms();
    },
    methods: { 
        ...mapActions(['getListMaps', 'getListMapsCustoms']) ,
        filterMethods(obj){
            return ['nameLocate', 'descriptionLocate', 'author'].some(key => 
                obj[key].toLowerCase().includes(this.search.toLowerCase())
            );
        },
        doBarrelRoll() {
            this.$root.$el.classList.add('barrel-roll');
        },
    },
};
</script>

<style lang="scss" scoped>
    .maps-container__header{
        display: flex;
        align-items: center;
        width: 40%;
        margin-left: auto;
        margin-right: 2rem;
        margin-top: 1rem;
        > div{
            margin: 0 0.5rem;
        }
        
        @media (max-width: 700px) {
            margin-right: auto;
            width: 90%;
        }
    }
    .sliders-container {
        max-width: 100vw;
    }
    .maps {
        padding: 3rem 15px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
        column-gap: 30px;
        row-gap: 1.5rem;
        justify-items: center;
    }
    .no-results {
        text-align: center;
        margin-top: 4rem;
        margin-bottom: 7rem;
    }
    @media (max-width: 330px) {
        .maps {
            grid-auto-columns: 90%;
            column-gap: 0;
            padding: 3rem 10px;
        }
    }

</style>

<style lang="scss">
#app.barrel-roll {
    transform: rotate(1turn);
    transition: 4s;
}
</style>