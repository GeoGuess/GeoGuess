<template>
    <ContentPage>
        <div class="content content--no-background mt-5 mb-0 pa-0">
            <WorldCountries class="m-auto" :countries="countriesData" />
        </div>
        <div class="content">
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :label="$t('History.search')"
                single-line
                hide-details
            ></v-text-field>
            <v-data-table
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
import { getMedals } from '@/utils/game/medals';
import WorldCountries from '@/components/shared/WorldCountries.vue';

export default {
    name: 'MedalsPage',
    components: {
        ContentPage,
        FlagIcon,
        WorldCountries,
    },
    data(){
          return {
            search: '',
            medalcolors: { platine: '#468f69', gold: '#fcc200', silver: '#b8b8b8', bronze: '#CC8E34', none: ''},
            headers: [
                {
                    text: 'Country',
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
            medals: [
  {
    "iso_a2": "AL",
    "osmId": 53292,
    "osmType": "relation"
  },
  {
    "iso_a2": "AS",
    "osmId": 2177187,
    "osmType": "relation"
  },
  {
    "iso_a2": "AD",
    "osmId": 9407,
    "osmType": "relation"
  },
  {
    "iso_a2": "AR",
    "osmId": 286393,
    "osmType": "relation"
  },
  {
    "iso_a2": "AU",
    "osmId": 80500,
    "osmType": "relation"
  },
  {
    "iso_a2": "AT",
    "osmId": 16239,
    "osmType": "relation"
  },
  {
    "iso_a2": "BD",
    "osmId": 184640,
    "osmType": "relation"
  },
  {
    "iso_a2": "BY",
    "osmId": 59065,
    "osmType": "relation"
  },
  {
    "iso_a2": "BE",
    "osmId": 52411,
    "osmType": "relation"
  },
  {
    "iso_a2": "BM",
    "osmId": 1993208,
    "osmType": "relation"
  },
  {
    "iso_a2": "BT",
    "osmId": 184629,
    "osmType": "relation"
  },
  {
    "iso_a2": "BO",
    "osmId": 252645,
    "osmType": "relation"
  },
  {
    "iso_a2": "BW",
    "osmId": 1889339,
    "osmType": "relation"
  },
  {
    "iso_a2": "BR",
    "osmId": 59470,
    "osmType": "relation"
  },
  {
    "iso_a2": "IO",
    "osmId": 1993867,
    "osmType": "relation"
  },
  {
    "iso_a2": "BG",
    "osmId": 186382,
    "osmType": "relation"
  },
  {
    "iso_a2": "KH",
    "osmId": 49898,
    "osmType": "relation"
  },
  {
    "iso_a2": "CA",
    "osmId": 1428125,
    "osmType": "relation"
  },
  {
    "iso_a2": "CL",
    "osmId": 167454,
    "osmType": "relation"
  },
  {
    "iso_a2": "CN",
    "osmId": 270056,
    "osmType": "relation"
  },
  {
    "iso_a2": "CX",
    "osmId": 2177207,
    "osmType": "relation"
  },
  {
    "iso_a2": "CC",
    "osmId": 82636,
    "osmType": "relation"
  },
  {
    "iso_a2": "CO",
    "osmId": 120027,
    "osmType": "relation"
  },
  {
    "iso_a2": "CR",
    "osmId": 287667,
    "osmType": "relation"
  },
  {
    "iso_a2": "HR",
    "osmId": 214885,
    "osmType": "relation"
  },
  {
    "iso_a2": "DK",
    "osmId": 50046,
    "osmType": "relation"
  },
  {
    "iso_a2": "DO",
    "osmId": 307828,
    "osmType": "relation"
  },
  {
    "iso_a2": "EC",
    "osmId": 108089,
    "osmType": "relation"
  },
  {
    "iso_a2": "EG",
    "osmId": 1473947,
    "osmType": "relation"
  },
  {
    "iso_a2": "EE",
    "osmId": 79510,
    "osmType": "relation"
  },
  {
    "iso_a2": "FK",
    "osmId": 2185374,
    "osmType": "relation"
  },
  {
    "iso_a2": "FO",
    "osmId": 52939,
    "osmType": "relation"
  },
  {
    "iso_a2": "FI",
    "osmId": 54224,
    "osmType": "relation"
  },
  {
    "iso_a2": "FR",
    "osmId": 1403916,
    "osmType": "relation"
  },
  {
    "iso_a2": "DE",
    "osmId": 51477,
    "osmType": "relation"
  },
  {
    "iso_a2": "GH",
    "osmId": 192781,
    "osmType": "relation"
  },
  {
    "iso_a2": "GI",
    "osmId": 1278736,
    "osmType": "relation"
  },
  {
    "iso_a2": "GR",
    "osmId": 192307,
    "osmType": "relation"
  },
  {
    "iso_a2": "GL",
    "osmId": 2184073,
    "osmType": "relation"
  },
  {
    "iso_a2": "HK",
    "osmId": 913110,
    "osmType": "relation"
  },
  {
    "iso_a2": "HU",
    "osmId": 21335,
    "osmType": "relation"
  },
  {
    "iso_a2": "IS",
    "osmId": 299133,
    "osmType": "relation"
  },
  {
    "iso_a2": "IN",
    "osmId": 304716,
    "osmType": "relation"
  },
  {
    "iso_a2": "ID",
    "osmId": 304751,
    "osmType": "relation"
  },
  {
    "iso_a2": "IQ",
    "osmId": 304934,
    "osmType": "relation"
  },
  {
    "iso_a2": "IE",
    "osmId": 62273,
    "osmType": "relation"
  },
  {
    "iso_a2": "IM",
    "osmId": 62269,
    "osmType": "relation"
  },
  {
    "iso_a2": "IL",
    "osmId": 1473946,
    "osmType": "relation"
  },
  {
    "iso_a2": "IT",
    "osmId": 365331,
    "osmType": "relation"
  },
  {
    "iso_a2": "JP",
    "osmId": 382313,
    "osmType": "relation"
  },
  {
    "iso_a2": "JE",
    "osmId": 367988,
    "osmType": "relation"
  },
  {
    "iso_a2": "JO",
    "osmId": 184818,
    "osmType": "relation"
  },
  {
    "iso_a2": "KE",
    "osmId": 192798,
    "osmType": "relation"
  },
  {
    "iso_a2": "KG",
    "osmId": 178009,
    "osmType": "relation"
  },
  {
    "iso_a2": "LA",
    "osmId": 49903,
    "osmType": "relation"
  },
  {
    "iso_a2": "LV",
    "osmId": 72594,
    "osmType": "relation"
  },
  {
    "iso_a2": "LB",
    "osmId": 184843,
    "osmType": "relation"
  },
  {
    "iso_a2": "LS",
    "osmId": 2093234,
    "osmType": "relation"
  },
  {
    "iso_a2": "LI",
    "osmId": 1155955,
    "osmType": "relation"
  },
  {
    "iso_a2": "LT",
    "osmId": 72596,
    "osmType": "relation"
  },
  {
    "iso_a2": "LU",
    "osmId": 2171347,
    "osmType": "relation"
  },
  {
    "iso_a2": "MO",
    "osmId": 1867188,
    "osmType": "relation"
  },
  {
    "iso_a2": "MG",
    "osmId": 447325,
    "osmType": "relation"
  },
  {
    "iso_a2": "MY",
    "osmId": 2108121,
    "osmType": "relation"
  },
  {
    "iso_a2": "MT",
    "osmId": 365307,
    "osmType": "relation"
  },
  {
    "iso_a2": "MQ",
    "osmId": 1891495,
    "osmType": "relation"
  },
  {
    "iso_a2": "MX",
    "osmId": 114686,
    "osmType": "relation"
  },
  {
    "iso_a2": "MC",
    "osmId": 1124039,
    "osmType": "relation"
  },
  {
    "iso_a2": "MN",
    "osmId": 161033,
    "osmType": "relation"
  },
  {
    "iso_a2": "ME",
    "osmId": 53296,
    "osmType": "relation"
  },
  {
    "iso_a2": "NP",
    "osmId": 184633,
    "osmType": "relation"
  },
  {
    "iso_a2": "NL",
    "osmId": 12728888,
    "osmType": "relation"
  },
  {
    "iso_a2": "NZ",
    "osmId": 556706,
    "osmType": "relation"
  },
  {
    "iso_a2": "NG",
    "osmId": 192787,
    "osmType": "relation"
  },
  {
    "iso_a2": "MK",
    "osmId": 53293,
    "osmType": "relation"
  },
  {
    "iso_a2": "MP",
    "osmId": 306004,
    "osmType": "relation"
  },
  {
    "iso_a2": "NO",
    "osmId": 2978650,
    "osmType": "relation"
  },
  {
    "iso_a2": "PK",
    "osmId": 307573,
    "osmType": "relation"
  },
  {
    "iso_a2": "PE",
    "osmId": 288247,
    "osmType": "relation"
  },
  {
    "iso_a2": "PH",
    "osmId": 443174,
    "osmType": "relation"
  },
  {
    "iso_a2": "PN",
    "osmId": 2185375,
    "osmType": "relation"
  },
  {
    "iso_a2": "PL",
    "osmId": 49715,
    "osmType": "relation"
  },
  {
    "iso_a2": "PT",
    "osmId": 295480,
    "osmType": "relation"
  },
  {
    "iso_a2": "PR",
    "osmId": 4422604,
    "osmType": "relation"
  },
  {
    "iso_a2": "QA",
    "osmId": 305095,
    "osmType": "relation"
  },
  {
    "iso_a2": "RO",
    "osmId": 90689,
    "osmType": "relation"
  },
  {
    "iso_a2": "RU",
    "osmId": 60189,
    "osmType": "relation"
  },
  {
    "iso_a2": "RE",
    "osmId": 1785276,
    "osmType": "relation"
  },
  {
    "iso_a2": "PM",
    "osmId": 3406826,
    "osmType": "relation"
  },
  {
    "iso_a2": "SM",
    "osmId": 54624,
    "osmType": "relation"
  },
  {
    "iso_a2": "SN",
    "osmId": 192775,
    "osmType": "relation"
  },
  {
    "iso_a2": "RS",
    "osmId": 1741311,
    "osmType": "relation"
  },
  {
    "iso_a2": "SG",
    "osmId": 536780,
    "osmType": "relation"
  },
  {
    "iso_a2": "SK",
    "osmId": 14296,
    "osmType": "relation"
  },
  {
    "iso_a2": "SI",
    "osmId": 218657,
    "osmType": "relation"
  },
  {
    "iso_a2": "ZA",
    "osmId": 87565,
    "osmType": "relation"
  },
  {
    "iso_a2": "GS",
    "osmId": 1983628,
    "osmType": "relation"
  },
  {
    "iso_a2": "KR",
    "osmId": 307756,
    "osmType": "relation"
  },
  {
    "iso_a2": "ES",
    "osmId": 1311341,
    "osmType": "relation"
  },
  {
    "iso_a2": "LK",
    "osmId": 536807,
    "osmType": "relation"
  },
  {
    "iso_a2": "SE",
    "osmId": 52822,
    "osmType": "relation"
  },
  {
    "iso_a2": "CH",
    "osmId": 51701,
    "osmType": "relation"
  },
  {
    "iso_a2": "TW",
    "osmId": 449220,
    "osmType": "relation"
  },
  {
    "iso_a2": "TZ",
    "osmId": 195270,
    "osmType": "relation"
  },
  {
    "iso_a2": "TH",
    "osmId": 2067731,
    "osmType": "relation"
  },
  {
    "iso_a2": "TN",
    "osmId": 192757,
    "osmType": "relation"
  },
  {
    "iso_a2": "TR",
    "osmId": 174737,
    "osmType": "relation"
  },
  {
    "iso_a2": "UG",
    "osmId": 192796,
    "osmType": "relation"
  },
  {
    "iso_a2": "UA",
    "osmId": 60199,
    "osmType": "relation"
  },
  {
    "iso_a2": "AE",
    "osmId": 307763,
    "osmType": "relation"
  },
  {
    "iso_a2": "GB",
    "osmId": 62149,
    "osmType": "relation"
  },
  {
    "iso_a2": "US",
    "osmId": 148838,
    "osmType": "relation"
  },
  {
    "iso_a2": "VI",
    "osmId": 286898,
    "osmType": "relation"
  },
  {
    "iso_a2": "UY",
    "osmId": 287072,
    "osmType": "relation"
  },
  {
    "iso_a2": "VU",
    "osmId": 2177246,
    "osmType": "relation"
  },
  {
    "iso_a2": "VN",
    "osmId": 49915,
    "osmType": "relation"
  },
]
            
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
              if(item.medal) 
                acc[item.iso_a2] = item.medal;
              return acc;
            }, {});
        }
    },
    mounted(){
        this.loadHistory();
    },
    methods:{
        ...mapActions(['loadHistory', 'loadPlaceGeoJSON']),
        ...mapActions('settingsStore', ['openDialogRoom']),
        onClickRow({osmId}){
            this.loadPlaceGeoJSON({osmId});
            this.openDialogRoom(true);
            this.$router.push({name: 'home'});
        }
    }
};
</script>


<style lang="scss" scoped>
.country-col{
  display: flex;
  align-items: center;
  .flag-icon{
    transform: scale(0.8);
    margin-right: 0.7rem;
  }
}
</style>