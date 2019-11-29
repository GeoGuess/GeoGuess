<template>
  <div id="home-page">
    <div class="align-center">
      <div>
        <img 
          id="icon" 
          src="../assets/logo.png">
      </div>
      <div>
        <img 
          id="title" 
          src="../assets/title.png">
      </div>
      <div id="record-container">
        <span id="record-text">
          Record: <strong>{{ record }}</strong> km
        </span>
      </div>
      <v-row 
        id="button-container"
        v-if="$viewport.width < 450">
        <v-col cols="12">
          <button 
            class="button" 
            id="single-player-button"
            @click="$router.push('street-view')">Single Player</button>
        </v-col>
        <v-col cols="12">
            <DialogRoom />
        </v-col>
      </v-row>
    </div>

    <v-row  
      v-if="$viewport.width > 450" 
      id="button-container"
      align="center">
      <v-col class="button-col">
        <button 
          class="button" 
          id="single-player-button" 
          @click="$router.push('street-view')">Single Player</button>
      </v-col>
      <v-col class="button-col">
        <DialogRoom />
      </v-col>
    </v-row>

    <v-footer
      id="footer"
      color="transparent">
      <v-card
        flat
        tile
        width="100%"
        color="transparent">
        <v-card-text class="text-center white--text">
          <h1>ABOUT</h1>
        </v-card-text>
        <v-card-text class="white--text pt-0">
          <v-container>
            <span class="footer-text">
              Free and lazy geoguess game with no ads. Players compete how close the player can guess random locations in five rounds. You can share the score with other people via SNS like Facebook or Twitter. 
              You can play multiplayer game with your friends up to five friends. The first player creates a room and decide the room size. Other players type the same room name as the first player created and the game will start. There is Android version as well. (Android version was shut down.)
            </span>
          </v-container>
        </v-card-text>
        <v-card-text>
          <v-container>
            <a href="http://bit.ly/geoguess_master">
              <img src="../assets/google-play-badge.png" width="180">
            </a>
          </v-container>
        </v-card-text>
        <v-card-text class="text-center white--text">
          <h1>LIMITATION</h1>
        </v-card-text>
        <v-card-text class="white--text pt-0">
          <v-container>
            <span class="footer-text">
              Currently I set quotas per day so the cost to run this game can't get too high. If the map doesn't load, it means the quotas has been exceeded on the day. It will reset at midnight Pacific Time. Sorry for inconvenience.
            </span>
            <br>
            <br>
            <span class="footer-text">
              This game is open source so you can build your own game server and play this game unlimitedly.
            </span>
          </v-container>
        </v-card-text>
        <v-card-text class="white--text mt-8 pb-0">
          <v-container v-if="$viewport.width > 450">
            <v-row>
              <span>© {{ new Date().getFullYear() }} <strong>Spider Hand</strong></span>
              <router-link 
                to="/privacy-policy"
                id="privacy-policy">Privacy</router-link>
              <v-spacer />
              <v-btn
                class="mx-2"
                color="white"
                href="https://discord.gg/fPpUzgJ"
                icon>
                <v-icon size="36">mdi-discord</v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                color="white"
                href="https://github.com/spider-hand/Geoguess-Master-Web"
                icon>
                <v-icon size="36">mdi-github-circle</v-icon>
              </v-btn>
            </v-row>
          </v-container>
          <v-container v-else>
            <v-row>
              <v-btn
                class="mx-1"
                color="white"
                href="https://discord.gg/fPpUzgJ"
                icon>
                <v-icon size="30">mdi-discord</v-icon>
              </v-btn>
              <v-btn
                class="mx-1"
                color="white"
                href="https://github.com/spider-hand/Geoguess-Master-Web"
                icon>
                <v-icon size="30">mdi-github-circle</v-icon>
              </v-btn>
            </v-row>
            <v-row class="mt-2">
              <span>© {{ new Date().getFullYear() }} <strong>Spider Hand</strong></span>
              <router-link 
                to="/privacy-policy"
                id="privacy-policy">Privacy</router-link>
            </v-row>            
          </v-container>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import DialogRoom from '@/components/DialogRoom'

  export default {
    components: {
      DialogRoom,
    },
    data() {
      return {
        record: localStorage.getItem('record')
      }
    }
  }
</script>

<style scoped>
  #home-page {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-image: linear-gradient(#1A237E, #000000)
  }

  #icon {
    height: 80px;
  }

  #title {
    height: 80px;
  }

  .align-center {
    text-align: center; 
  }

  #record-container {
    padding-top: 30px;
  }

  #record-text {
    font-size: 36px;
    color: white;
  }

  #button-container {
    padding: 5% 10% 0 10%;
  }

  .button-col {
    padding: 20px 0;
  }

  .button {
    border: none;
    border-radius: 40px;
    color: white;
    font-size: 30px;
    font-weight: bold;
    text-decoration: none;
    text-align: center;
    padding: 10px 100px;
    width: 400px;
  }

  #single-player-button {
    background-color: #F44336;
  }

  #footer {
    padding-top: 250px;
  }

  .footer-text {
    font-size: 22px;
    line-height: 1.7em;
  }

  #privacy-policy {
    margin-left: 10px;
  }

  @media (max-width: 450px) {
    #icon {
      height: 65px;
    }

    #title {
      height: 50px;
    }

    #record-container {
      padding-top: 20px;
    }

    #record-text {
      font-size: 24px;
    }

    #button-container {
      padding: 18% 5% 0 5%;
    }

    .button {
      border: none;
      border-radius: 40px;
      color: white;
      font-size: 20px;
      text-decoration: none;
      text-align: center;
      padding: 2% 15%;
      margin: 5% 0;
      width: 80%;      
    }

    #footer {
      padding-top: 100px;
    }

    .footer-text {
      font-size: 18px;
    }
  }
</style>
