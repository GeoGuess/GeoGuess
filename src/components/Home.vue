<template>
  <div>
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
            <h2>Record: {{ record / 1000 }} km</h2>
          </v-flex>
          
          <v-flex xs12>
            
            <v-row justify="space-around"
                  class="search">
                <v-combobox
                  :items="items"
                  :search-input.sync="search"
                  :loading="isLoading"
                  autofocus
                  :placeholder="(placeGeoJson !==null) ? 'Custom geoJson file has been loaded': 'Enter city, state or country'"
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
                  <v-icon>mdi-settings</v-icon>
                </v-btn>
                <v-dialog v-model="dialogCustom">
                  <v-card class="dialog-customs" color="#061422">
                    <v-card-title>
                      <p>Paste GeoJSON <small> (<a target="_blank" href="https://tomscholz.github.io/geojson-editor/">Open Editor</a>)</small></p>
                    </v-card-title>
                    <v-card-text>
                      <v-textarea :error="errorGeoJson" :success="placeGeoJson !==null" dark v-model="geoJson" :placeholder="placeholderGeoJson" rows="20">
                      </v-textarea>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        dark
                        @click="dialogCustom = !dialogCustom">
                        OK
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            </v-row>
                  
          </v-flex>
          
          <v-spacer/>
          <v-flex>
            <v-btn 
              id="single-player-button"
              class="ml-8 mr-8"
              dark
              color="#FF5252"
              @click="startSinglePlayer">
              Single Player
            </v-btn>
            <DialogRoom :place="place" :geoJson="placeGeoJson" />
          </v-flex>
        </v-layout>
      </v-container>
      </v-container>
      </v-img>
    </div>
    
    <v-container class="section" id="section-about"> 
       <h3 class="section-header">ABOUT</h3>
      <p class="section-description">
          Geoguess 2 is a free and lazy geoguess game with no ads. Players compete how close the player can guess random locations in five rounds. You can share the score with other people via social media like Facebook or Twitter. You can play multiplayer game with your friends up to five friends. The first player creates a room and decide the room size. Other players type the same room name as the first player created and the game will start. 
          <br/>This game was forked from <a href="https://geoguessmaster.com/">GeoGuess Master</a>.
      </p>
    </v-container>

    <v-container class="section" id="section-CustomsMap"> 
       <h3 class="section-header">CUSTOMS MAP</h3>
      <p class="section-description">
        You can limit random locations to city, state, or country with the search bar. <br/>In the multiplayer, the first player fixes the location.
        <br/><br/>
        Furthermore, you can make your customs map with <a href="https://geojson.org/">GeoJson</a> file.
        Insert the content of the GeoJson map with the button : <v-icon>mdi-settings</v-icon>.
        <br/>
        Customs Maps : 
        <ul>
          <li><a href="https://gist.github.com/BilelJegham/7f855024440c67d65f24536c9215719e">Biggest cities world</a></li>
          <li><a href="https://gist.github.com/BilelJegham/b6a0faa627aac3b7f5bc677523c4c7eb">Hard Map</a></li>
        </ul>
      </p>
    </v-container>
    <v-container  class="section" id="section-limitation">
      <h3 class="section-header">LIMITATION</h3>
      <p class="section-description">
        Currently I set quotas per day so the cost to run this game can't get too high. If the map doesn't load, it means the quotas has been exceeded on the day. It will reset at midnight Pacific Time. Sorry for inconvenience. This game is open source so you can build your own game server and play this game unlimitedly.
      </p>
    </v-container>
    
    <v-footer
      id="footer"
      color="#061422"
      height="210">
      <v-container>
        <v-row justify="center">
          <v-btn
            class="ml-4 mr-4" 
            icon
            color="#FFFFFF"
            href="https://github.com/BilelJegham/Geoguess-2">
            <v-icon size="30">mdi-github-circle</v-icon>
          </v-btn>
          <v-btn 
            class="ml-4 mr-4"
            icon
            color="#FFFFFF"
            href="https://discord.gg/fPpUzgJ">
            <v-icon size="30">mdi-discord</v-icon>
          </v-btn>
          <v-btn 
            class="ml-4 mr-4"
            icon
            color="#FFFFFF"
            href="https://twitter.com/BilelJegham">
            <v-icon size="30">mdi-twitter</v-icon>
          </v-btn>
        </v-row>
        <v-row
          class="mt-8" 
          justify="center">
          <span id="copyright-text">under <a href="https://raw.githubusercontent.com/spider-hand/Geoguess-Master-Web/master/LICENSE">MIT license</a></span>
        </v-row>
        <v-row
          class="mt-1"
          justify="center">
          <span id="credit-text">
            <small>VERSION : {{version}}</small>
          </span>
        </v-row>
        <v-row
          class="mt-3"
          justify="center">
          <v-btn
            text
            color="#FFFFFF"
            @click="$router.push('privacy-policy')">
            <span id="privacy-policy">Privacy Policy</span>
          </v-btn>
        </v-row>
        <v-row
          class="mt-3"
          justify="center">
        </v-row>
      </v-container>
    </v-footer> 
  </div>
</template>


<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import Header from '@/components/Header'
  import DialogRoom from '@/components/DialogRoom'
  import axios from 'axios'

  export default {
    components: {
      Header,
      DialogRoom,
    },
    data() {
      return {
        record: localStorage.getItem('record'),
        place: '',
        entries: [],
        isLoading: false,
        search: '',
        version: process.env.VUE_APP_VERSION,
        dialogCustom: false,
        geoJson: '',
        placeholderGeoJson: geoJsonExample,
        errorGeoJson: false
      }
    },  
    computed: {
      placeGeoJson(){
        if(this.geoJson == ''){
          return null;
        }
        try{
          let obj = JSON.parse(this.geoJson);
          this.place= '';
          if(obj.type === "FeatureCollection"){
            if(obj.features.length == 1){
              this.errorGeoJson = false;
              return obj.features[0]
            }else{
              this.errorGeoJson = false;
              return {
              "type": "Feature",
              "geometry": {
                  "type": "MultiPolygon",
                  "coordinates": obj.features.map((f) => {
                    if(f.geometry.type ==  "Polygon"){
                      return f.geometry.coordinates;
                    }else{
                      return [];
                    }

                  })
              }
              };
            }
          }
          this.errorGeoJson = false;
          return obj; 
        }catch(e){
          this.errorGeoJson = true
        }
        return null;
      },
      minHeight () {
        const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'

        return `calc(${height} - ${this.$vuetify.application.top}px)`
      },
      items () {
          return this.entries.map(entry => entry.display_name)
      },
    },
    watch: {
      search (val) {

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true
        // Lazily load input items
        axios.get(`https://nominatim.openstreetmap.org/search/${encodeURI(val)}?format=json`)
          .then(res => {
            if(res.status === 200 && res.data){
              this.entries = res.data.filter((node ) => node.osm_type === 'relation');
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    },
    methods: {
      startSinglePlayer() {
        if( this.geoJson !=  ''){    
          this.$router.push({name:'street-view', params: {placeGeoJson:this.placeGeoJson}});
        }
        else if(this.place == null || this.place == ''){
          this.$router.push({name:'street-view'});
        }else{
          axios.get(`https://nominatim.openstreetmap.org/search/${encodeURIComponent(this.place)}?format=geojson&limit=1&polygon_geojson=1`)
          .then((res) => {
            if(res && res.status === 200 && res.data.features.length > 0){
              this.$router.push({name:'street-view', params: {placeGeoJson: res.data.features[0]}});
            }
          }).catch((e) => { console.err(e) })
        }
      }
    }
    
  }
    const geoJsonExample = `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [0, 0.0], [10.0, 0.0], [10, 20],
               [0.0, 20], [0, 0.0] ]]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [0, 0.0], [10.0, 0.0], [10, 20],
               [0.0, 20], [0, 0.0] ]]
      }
    }
   ]
}`
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

  #copyright-text, #credit-text {
    color: #7D7D7D;
  }
  .search{
    width: 50vw;
    margin: auto;
  }
  .dialog-customs {
    color: #FFFFFF;
  }
</style>
