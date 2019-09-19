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
              Free and lazy geoguess game. You can play multiplayer game with your friends. There is Android version as well.
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
          </v-container>
        </v-card-text>
        <v-card-text class="text-center white--text">
          <h1>CONTACT</h1>
        </v-card-text>
        <v-card-text class="white--text pt-0">
          <v-container>
            <span class="footer-text">
              Feel free to give me a feedback. I would appreciate a bug report. Also I'm looking for sponsors to maintain this game and make this game unlimited.
            </span>
          </v-container>
        </v-card-text>
        <v-card-text class="text-center white--text pt-0">
          <v-container>
            <a 
              href="mailto:creative.spider.hand@gmail.com" 
              class="footer-text">
              creative.spider.hand@gmail.com
            </a>
            <p class="footer-text">or</p>
            <v-btn
              color="white"
              href="https://discord.gg/fPpUzgJ"
              icon>
              <v-icon size="48">mdi-discord</v-icon>
            </v-btn>
          </v-container>
        </v-card-text>
        <v-card-text class="text-center white--text">
          <h1>SPONSORS</h1>
        </v-card-text>
        <v-card-text class="text-center white--text">
          <span class="footer-text">Become a sponsor! Please contact me!</span>
        </v-card-text>
        <v-card-text class="text-right white--text pb-0">
          <span>© {{ new Date().getFullYear() }} <strong>Spider Hand</strong></span>
          <router-link 
            to="/privacy-policy"
            id="privacy-policy">Privacy</router-link>
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
