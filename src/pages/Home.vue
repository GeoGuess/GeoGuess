<template>
  <div>
     <Header />
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




    <Footer/>
  </div>
</template>


<script>
  import firebase from 'firebase/app'
  import 'firebase/database'
  import axios from 'axios'

  import History from '@/components/History'
  import DialogCustomMap from '@/components/DialogCustomMap'

  import Header from '@/components/home/Header'
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
    mounted() {
      if(this.$route.params.partyParams){
        const params = atob(this.$route.params.partyParams).split(',').map((val) => parseFloat(val));
        console.log(params)
        if(params.length === 12){
          const difficulty = params[0];
          const timeLimitation = params[1];
          const rounds = [params.slice(2,4),params.slice(4,6),params.slice(6,8),params.slice(8,10),params.slice(10,12)];
          this.$router.push({
            name:'street-view',  
            params: {
              time : timeLimitation,
              difficulty: difficulty, 
              roundsPredefined: rounds
            }
          });
        }
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

</style>
