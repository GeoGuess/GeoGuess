<template>
  <div>
    <v-dialog v-model="historyDialog" >
      <History :history="history"/>
    </v-dialog>
    <div id="section-top">
      
      <v-img
        id="image-earth"
        height="640"
        class="white--text"
        src="../assets/earth.jpg"
        gradient="to right, rgba(5, 11, 31, .7), rgba(5, 11, 31, .7)"  >
      <Header />
      <v-container  fill-height>
      <v-container grid-list-md text-center align-center>
        <v-layout row wrap >
          <v-spacer/>
          <v-flex 
            xs12>
            <h2>{{$t('Home.record')}}: {{ record / 1000 }} km</h2>
          </v-flex>
          
          <v-flex xs12>
            
            <v-row justify="space-around"
                  class="search">
                <v-combobox
                  :items="items"
                  :search-input.sync="search"
                  :loading="isLoading"
                  autofocus
                  :placeholder="(placeGeoJson !==null) ? $t('Home.searchBar.customLoaded'): $t('Home.searchBar.enterCity')"
                  dark
                  v-model="place"
                  :disabled="placeGeoJson !==null"
                  :persistent-hint="placeGeoJson !==null"
                  :outlined="placeGeoJson !==null"
                  :background-color="(placeGeoJson !==null)? 'rgba(5, 11, 31, 0.7)': ''"
                  >
                </v-combobox>
                  
                <v-btn 
                  icon
                  class="btn-customs"
                  color="#FFFFFF"
                  @click="dialogCustom = !dialogCustom">
                  <v-icon medium>mdi-map-plus</v-icon>
                </v-btn>
                <DialogCustomMap :visibility="dialogCustom" @changeVisibility="dialogCustom = !dialogCustom" v-model="geoJson" :validGeoJson="placeGeoJson !==null"/>
            </v-row>
                  
          </v-flex>
          
          <v-spacer/>
          <v-flex>
          
            <DialogRoom singlePlayer :place="place" :geoJson="placeGeoJson" />

            <DialogRoom :place="place" :geoJson="placeGeoJson" />
          </v-flex>

          <v-flex xs12>
              <v-btn
                dark
                text
                @click="historyDialog = true">{{$t('Home.historyBtn')}}</v-btn>

          </v-flex>

        </v-layout>
      </v-container>
      </v-container>
      </v-img>
    </div>

    <v-container class="section" id="section-about">
       <h3 class="section-header">{{$t('Home.about')}}</h3>
      <p class="section-description">
          {{$t('Home.aboutDescriptions.1')}} 
          <br/>{{$t('Home.aboutDescriptions.2')}} <a href="https://geoguessmaster.com/">GeoGuess Master</a>.
      </p>
    </v-container>

    <v-container class="section" id="section-CustomsMap">
       <h3 class="section-header">{{$t('Home.customMap')}}</h3>
      <p class="section-description">
        {{$t('Home.customMapDescriptions.1')}} 
        <br/>{{$t('Home.customMapDescriptions.2')}} 
        <br/><br/>
        {{$t('Home.customMapDescriptions.3')}} <a href="https://geojson.org/">GeoJson</a> {{$t('Home.customMapDescriptions.4')}}
        {{$t('Home.customMapDescriptions.5')}} <v-icon>mdi-map-plus</v-icon>.
        <br/>
        {{$t('Home.customMapDescriptions.6')}}
        <ul>
          <li><a href="https://gist.github.com/BilelJegham/7f855024440c67d65f24536c9215719e">Biggest cities world</a></li>
          <li><a href="https://gist.github.com/BilelJegham/b6a0faa627aac3b7f5bc677523c4c7eb">Hard Map</a></li>
        </ul>
      </p>
    </v-container>
    <v-container  class="section" id="section-limitation">
      <h3 class="section-header">{{$t('Home.limitation')}}</h3>
      <p class="section-description">
        {{$t('Home.limitationDescription')}}
      </p>
    </v-container>

    <Footer/>
  </div>
</template>


<script>
  import firebase from 'firebase/app'
  import 'firebase/database'
  import axios from 'axios'

  import History from '@/components/History'
  import DialogCustomMap from '@/components/DialogCustomMap'

  import Header from '@/components/Header'
  import DialogRoom from '@/components/widgets/dialog/DialogRoom'
  import Footer from '@/components/Footer'

  export default {
    components: {
      Header,
      DialogRoom,
      History,
      DialogCustomMap,
      Footer,
    },
    data() {
      return {
        historyDialog: false,
        record: localStorage.getItem('record'),
        history: (localStorage.getItem('history')) ? JSON.parse(localStorage.getItem('history')) : [],
        place: '',
        dialog: false,
        entries: [],
        isLoading: false,
        search: '',
        version: process.env.VUE_APP_VERSION,
        dialogCustom: false,
        geoJson: '',
      }
    },  
    computed: {
      placeGeoJson(){
        if(this.geoJson == ''){
          return null;
        }
        try{
          let obj = JSON.parse(this.geoJson);
          if(obj.type === "FeatureCollection" && obj.features){
            obj.features.map((f)=>{
              if(!["Point", "Polygon", "MultiPolygon"].includes(f.geometry.type)){
                throw new Error("Error Format")
              }
            })
            this.place= '';
            return obj; 

          }else{
            
            throw new Error("Error Format")
          }
        }catch(e){
          return null;
        }
      },
      minHeight () {
        const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'

        return `calc(${height} - ${this.$vuetify.application.top}px)`
      },
      items () {
          return this.entries.map(entry => entry.properties.name)
      },
    },
    watch: {
      
      search (val) {

        // Items have already been requested
        if (!val) return

        this.isLoading = true
        // Lazily load input items
        axios.get(`https://photon.komoot.de/api/?q=${encodeURI(val)}`)
          .then(res => {
            if(res.status === 200 && res.data && res.data.features){
              this.entries = res.data.features.filter((node ) => node.properties.osm_type === 'R');
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    },    
  }
</script>

<style scoped>
  span, .section-header {
    font-family: montserrat;
  }
  #single-player-button {
    border-radius: 40px;
  }

  .section{
    padding: 2% 0;
  }
  #record {
    font-size: 26px;
    font-weight: 700;
    color: #FFFFFF;
  }
  .section-header{
    text-align: center;
  }
 .section-description, .section-header{
    padding: 0 18%;
    color: #777777;
  }

  .search{
    width: 50vw;
    margin: auto;
  }
  
  @media (max-width: 550px) {
    .search{
      width: 90vw;
      margin: auto;
    }
    #single-player-button {
      margin-bottom: 10px;
    }
  }
</style>
