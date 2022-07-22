<template>
    <ContentPage>
        <div class="content content--no-background mt-5 mb-0 pa-0">
            <WorldCountries 
                class="m-auto"
                :countries="countriesData"
                @click-country="selectCountry"
            />
        </div>
        <div class="content">
            <div class="medal-count">
                <div

                    v-for="medal in ['platinum', 'gold', 'silver', 'bronze']"
                    :key="`medal-${medal}`">
                    <p><v-chip
                        class="medal-count__chip"
                        :color="medalcolors[medal]"
                        dark
                    >
                        {{ $t(`Home.HomeCard.medal.${medal}`) }}
                    </v-chip> {{countMedal[medal]}}</p>
                </div>
            </div>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :label="$t('History.search')"
                single-line
                hide-details
            ></v-text-field>
            <v-data-table
                class="medal-table"
                :headers="headers"
                :items="items"
                :search="search"
                :items-per-page="-1"
                sort-by="maxScore"
                sort-desc
                disable-pagination
                @click:row="onClickRow"
            >
                <template v-slot:item.name="{ item }">
                    <div  class="country-col">
                        <FlagIcon size="big" :iso-name="item.iso_a2" rounded /> <span>{{item.name}}</span>
                    </div>
                </template>
                <template v-slot:item.medal="{ item }">
                    <v-chip
                        v-if="item.medal"
                        :color="medalcolors[item.medal]"
                        dark
                    >
                        {{ $t(`Home.HomeCard.medal.${item.medal}`) }}
                    </v-chip>
                </template>
       
            </v-data-table>
        </div>
    </ContentPage>
</template>

<script>
import ContentPage from '@/components/page/ContentPage';
import { mapActions, mapGetters } from 'vuex';
import FlagIcon from '@/components/shared/FlagIcon.vue';
import { getMedals, COUNTRIES_MEDALS_DATA } from '@/utils/game/medals';

export default {
    name: 'MedalsPage',
    components: {
        ContentPage,
        FlagIcon,
        WorldCountries: () => import('@/components/shared/WorldCountries.vue'),
    },
    data(){
          return {
            search: '',
            medalcolors: { platinum: '#468f69', gold: '#fcc200', silver: '#b8b8b8', bronze: '#CC8E34', none: ''},
            headers: [
                {
                    text: 'Location',
                    value: 'name',
                },
                {
                    text: 'Medal',
                    value: 'medal',
                    sort: (a, b)=>{
                      const keys = Object.keys(this.medalcolors);
                      const akey = keys.indexOf(a || 'none');
                      const bkey = keys.indexOf(b || 'none');
                      return akey - bkey;
                    },
                    groupable: true,
                },
                {
                    text: 'Max Score',
                    value: 'maxScore',
                },
            ],
            medals: COUNTRIES_MEDALS_DATA,            
        };
    },
    computed: {
        ...mapGetters(['getMaxScoreOsm']),
        items(){
            return this.medals.map((medal)=>{
              const maxScore = this.getMaxScoreOsm(medal);
              return {
                ...medal,
                name: this.$countryNameLocale(medal.iso_a2),
                maxScore,
                medal: getMedals(maxScore)
              };
            });
        },
        countriesData(){
            return this.items.reduce((acc, item)=>{
                acc[item.iso_a2] = item.medal || 'none';
                return acc;
            }, {});
        },
        countMedal(){
            return ['platinum', 'gold', 'silver', 'bronze'].reduce((acc, medal)=>{
                acc[medal] = this.items.filter((item)=>{
                    return item.medal === medal;
                }).length;
                return acc;
             }, {});
        }
    },
    mounted(){
        this.loadHistory();
    },
    methods:{
        ...mapActions(['loadHistory', 'loadPlaceGeoJSON']),
        ...mapActions('settingsStore', ['setSettings']),
        async onClickRow({osmId}){
            await this.loadPlaceGeoJSON({osmId});
            this.setSettings();
        },
        selectCountry(codeCountry){
            const iso_a2 = codeCountry.toUpperCase();
            const country = this.medals.find(item=>item.iso_a2===iso_a2);
            if(country && country.osmId){
                this.onClickRow({osmId: country.osmId});
            }
        }
    }
};
</script>


<style lang="scss" scoped>
.medal-count{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
    gap: 1.5rem;
    p{
        margin: 0;
    }
    &__chip{
        margin-right: 0.5rem;
    }
}
.country-col{
  display: flex;
  align-items: center;
  cursor: pointer;
  .flag-icon{
    transform: scale(0.8);
    margin-right: 0.7rem;
  }
}
</style>