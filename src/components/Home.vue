<template>
  <div>
    <div id="section-top">
      <v-img
        id="image-earth"
        src="../assets/earth.jpg" />
      <Header />
      <v-container fluid>
        <v-row
          id="row-record"
          justify="center">
          <span id="record">Record: {{ record }} km</span>
        </v-row>
        <v-row
          id="row-buttons" 
          justify="center">
          <v-btn 
            id="single-player-button"
            class="ml-8 mr-8"
            dark
            color="#FF5252"
            @click="$router.push('street-view')">
            Single Player
          </v-btn>
          <DialogRoom />
        </v-row>
      </v-container>
    </div>
    <div id="section-about">
      <v-container>
        <v-row justify="center">
          <h3 class="section-header">ABOUT</h3>
        </v-row>
        <v-row justify="center">
          <span class="section-description">
            Geoguess Master is a free and lazy geoguess game with no ads. Players compete how close the player can guess random locations in five rounds. You can share the score with other people via social media like Facebook or Twitter. You can play multiplayer game with your friends up to five friends. The first player creates a room and decide the room size. Other players type the same room name as the first player created and the game will start. 
          </span>
        </v-row>
      </v-container>
    </div>
    <div id="section-limitation">
      <v-container fluid>
        <v-row justify="center">
          <h3 class="section-header">LIMITATION</h3>
        </v-row>
        <v-row justify="center">
          <span class="section-description">
            Currently I set quotas per day so the cost to run this game can't get too high. If the map doesn't load, it means the quotas has been exceeded on the day. It will reset at midnight Pacific Time. Sorry for inconvenience. This game is open source so you can build your own game server and play this game unlimitedly.
          </span>
        </v-row>
      </v-container>
    </div>
    <v-footer
      id="footer"
      absolute
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
          <span id="copyright-text">All rights reserved. Copyright © {{ new Date().getFullYear() }} <strong>Spider Hand</strong></span>
        </v-row>
        <v-row
          class="mt-1"
          justify="center">
          <span id="credit-text">
            Photo by <a href="https://unsplash.com/@nasa">NASA</a> on <a href="https://unsplash.com/">Unsplash</a>, 
            Design by <a href="http://www.pauloxgomes.com/">Paulo Gomes</a>
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
      </v-container>
    </v-footer>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import Header from '@/components/Header'
  import DialogRoom from '@/components/DialogRoom'

  export default {
    components: {
      Header,
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
  span, .section-header {
    font-family: Montsetrrat;
  }

  #section-top {
    position: absolute;
    width: 100%;
    height: 640px;
    left: 0px;
    top: 0px;
    background: linear-gradient(#071D3E, #06121D);
  }

  #image-earth {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.4;
  }

  #row-record {
    position: absolute;
    width: 100%;
    top: 200px;
  }

  #record {
    font-size: 26px;
    font-weight: 700;
    color: #FFFFFF;
  }

  #row-buttons {
    position: absolute;
    width: 100%;
    top: 300px;
  }

  #single-player-button {
    height: 44px;
    width: 240px;
    border-radius: 40px;
  }

  #section-about {
    position: absolute;
    width: 100%;
    height: 430px;
    left: 0px;
    top: 640px;
    background: #FAFAFA;
  }

  #section-limitation {
    position: absolute;
    width: 100%;
    height: 430px;
    left: 0px;
    top: 1070px;
    background: #F4F4F4;
  }

  .section-header {
    position: absolute;
    top: 94px;
    color: #52575C;
  }

  .section-description {
    position: absolute;
    top: 148px;
    padding: 0 18%;
    color: #777777;
  }

  #copyright-text, #credit-text {
    font-size: 12px;
    color: #7D7D7D;
  }

  #privacy-policy {
    font-size: 12px;
  }

  #footer {
    top: 1500px;
    bottom: 0px;
  }

  @media (max-width: 450px) {
    #section-top {
      height: 480px;
    }

    #row-record {
      top: 120px;
    }

    #record {
      font-size: 18px;
    }

    #row-buttons {
      top: 200px;
    }

    #single-player-button {
      height: 42px;
      margin-bottom: 24px;
    }

    #section-about {
      top: 480px;
      height: 480px;
    }

    #section-limitation {
      top: 960px;
      height: 480px;
    }

    .section-header {
      top: 48px;
    }

    .section-description {
      top: 96px;
      padding: 0 12%;
    }

    #footer {
      top: 1440px;
    }
  }
</style>
