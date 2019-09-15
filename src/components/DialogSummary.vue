<template>
  <div>
    <v-dialog
      v-model="dialogSummary"
      fullscreen>
      <v-card id="dialog-summary-card">
        <v-card-text id="card-text">
          <v-row>
            <v-col>
              <div class="align-center">
                <span id="summary-text">You are <strong>{{ score }}</strong> km away!</span>
              </div>
            </v-col>
          </v-row>
          <v-row id="button-container">
            <v-col>
              <div class="align-center">
                <button 
                  class="button" 
                  id="exit-button"
                  @click="$router.push('/')">EXIT</button>
              </div>
            </v-col>
            <v-col>
              <div class="align-center">
                <button 
                  class="button" 
                  id="play-again-button"
                  @click="playAgain">PLAY AGAIN</button>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: [
      'dialogSummary',
      'score',
    ],
    methods: {
      playAgain() {
        this.$emit('playAgain')
      }
    },
  }
</script>

<style scoped>
  .button {
    border: none;
    border-radius: 40px;
    color: white;
    font-size: 30px;
    font-weight: bold;
    text-decoration: none;
    text-align: center;
    padding: 21px 100px;
    width: 400px;
  }

  .align-center {
    text-align: center;
  }

  #dialog-summary-card {
    background-image: linear-gradient(#FFF59D, #FFD600);
  }

  #card-text {
    padding: 180px 10% 100px 10%;
  }

  #summary-text {
    font-size: 50px;
    color: #1A237E;
  }

  #button-container {
    padding-top: 6%;
  }

  #exit-button {
    background-color: #F44336;
  }

  #play-again-button {
    background-color: #00E676;
  }

  @media (max-width: 450px) {
    .button {
      border: none;
      border-radius: 40px;
      color: white;
      font-size: 20px;
      text-decoration: none;
      text-align: center;
      padding: 4% 15%;
      margin: 5% 0;
      width: 90%;      
    }

    #summary-text {
      font-size: 25px;
    } 
  }
</style>
