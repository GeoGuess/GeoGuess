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
      <div 
        v-if="$viewport.width < 450" 
        id="button-container">
        <div>
          <button 
            class="button" 
            id="single-player-button"
            @click="$router.push('street-view')">Single Player</button>        
        </div>
        <div>
          <DialogRoom />     
        </div>
      </div>
    </div>

    <v-row  
      v-if="$viewport.width > 450" 
      id="button-container"
      align="center">
      <v-col>
        <button 
          class="button" 
          id="single-player-button" 
          @click="$router.push('street-view')">Single Player</button>
      </v-col>
      <v-col>
        <DialogRoom />
      </v-col>
    </v-row>

    <v-footer
      id="footer"
      height="200"
      padless
      fixed
      color="transparent">
      <v-row>
        <div class="flex-grow-1"></div>
        <v-btn 
          icon
          class="share-button">
          <v-icon 
            :size="$viewport.width > 450 ? 90 : 60" 
            color="white">mdi-facebook-box</v-icon>
        </v-btn>
        <v-btn 
          icon
          class="share-button">
          <v-icon 
            :size="$viewport.width > 450 ? 90 : 60" 
            color="white">mdi-twitter-box</v-icon>
        </v-btn>
        <v-btn 
          icon
          class="share-button">
          <v-icon 
            :size="$viewport.width > 450 ? 90 : 60" 
            color="white">mdi-instagram</v-icon>
        </v-btn>
        <v-btn 
          icon
          class="share-button">
          <v-icon 
            :size="$viewport.width > 450 ? 90 : 60" 
            color="white">mdi-discord</v-icon>
        </v-btn>
        <div class="flex-grow-1"></div>
      </v-row>
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

  .align-center {
    text-align: center; 
  }

  #icon {
    height: 80px;
  }

  #title {
    height: 80px;
  }

  #button-container {
    padding: 9% 10% 0 10%;
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

  .share-button {
    margin: 0 7%;
  }

  #single-player-button {
    background-color: #F44336;
  }

  @media (max-width: 450px) {
    #icon {
      height: 65px;
    }

    #title {
      height: 50px;
    }

    #button-container {
      padding-top: 25%;
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
  }
</style>
