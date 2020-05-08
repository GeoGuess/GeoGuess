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
            
            <v-combobox
              class="search"
              :items="items"
              :search-input.sync="search"
              :loading="isLoading"
              autofocus
              placeholder="Enter city, state or country"
              dark
              v-model="place"
              />
          </v-flex>
          
          <v-spacer/>
          <v-flex>
            <v-btn 
              id="single-player-button"
              class="ml-8 mr-8"
              dark
              color="#FF5252"
              @click="$router.push({name:'street-view', params: {place: place}})">
              Single Player
            </v-btn>
            <DialogRoom :place="place" />
          </v-flex>
        </v-layout>
      </v-container>
      </v-container>
      </v-img>
    </div>
    
    <v-container class="section" id="section-about"> 
      <h3 class="section-header">ABOUT</h3>
      <p class="section-description">
        Geoguess Master is a free and lazy geoguess game with no ads. Players compete how close the player can guess random locations in five rounds. You can share the score with other people via social media like Facebook or Twitter. You can play multiplayer game with your friends up to five friends. The first player creates a room and decide the room size. Other players type the same room name as the first player created and the game will start. 
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
            href="https://github.com/spider-hand/Geoguess-Master-Web">
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
            href="mailto:creative.spider.hand@gmail.com">
            <v-icon size="30">mdi-email</v-icon>
          </v-btn>
        </v-row>
        <v-row
          class="mt-8" 
          justify="center">
          <span id="copyright-text">All rights reserved. Copyright © {{ new Date().getFullYear() }} <strong>Le bon michel</strong></span>
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
    
         <v-alert
            class="alert-update"
            type="info"
            elevation="3"
            prominent
            v-if="enableUpdate"
          >
            <v-row align="center">
              <v-col class="grow">A new version is available. Click on the button to obtain it.</v-col>
              <v-col class="shrink">
                <v-btn @click="update">Update</v-btn>
              </v-col>
            </v-row>
          </v-alert>
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
        enableUpdate: process.env.VUE_APP_NEED_UPDATE
      }
    },  
    computed: {
      minHeight () {
        const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'

        return `calc(${height} - ${this.$vuetify.application.top}px)`
      },
      items () {
          return this.entries.map(entry => entry.display_name)
      },
    },
    methods:{
      update(){
        window.location.reload()
      }
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
    padding: 5% 0;
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
.alert-update{
  position: fixed;
  bottom: 0;
  right: 5%;
  width:90% ;
}

</style>
