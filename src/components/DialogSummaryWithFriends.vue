<template>
  <div>
    <v-dialog
      v-model="dialogSummary"
      max-width="80%"
      persistent
      :fullscreen="$viewport.width < 450">
      <v-card color="#FFF9C4">
        <v-card-text id="card-text">
          <v-row
            class="summary-text-container" 
            v-for="text in summaryTexts">
            <v-col>
              <div class="align-center">
                <span id="summary-text">
                  <strong>{{ text.playerName }}</strong> is <strong>{{ text.finalScore }}</strong> km away!
                </span>
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
          </v-row>
        </v-card-text>
        <v-card-text class="text-right">
          <v-btn
            target="_blank"
            :href="'http://www.facebook.com/sharer.php?u=https://geoguess-master.netlify.com/&amp;t=I am ' + score + ' km away! How close can you guess?'" 
            rel="nofollow"
            icon>
            <v-icon size="36">mdi-facebook-box</v-icon>
          </v-btn>
          <v-btn
            target="_blank"
            :href="'http://twitter.com/share?url=https://geoguess-master.netlify.com/&amp;text=I am ' + score +' km away! How close can you guess?'" 
            icon>
            <v-icon size="36">mdi-twitter-box</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: [
      'dialogSummary',
      'summaryTexts',
      'score',
    ],
    methods: {
      updateRecord() {
        var currentRecord = localStorage.getItem('record')
        if (currentRecord == null || this.score < currentRecord) {
          localStorage.setItem('record', this.score)
        }
      },
    },
    watch: {
      dialogSummary: function(newVal, oldVal) {
        if (newVal == true) {
          this.updateRecord()
        }
      }      
    }
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

  #card-text {
    padding: 180px 10% 100px 10%;
  }

  .summary-text-container {
    padding: 5px 0;
  }

  #summary-text {
    font-size: 36px;
    color: #1A237E;
  }

  #button-container {
    padding-top: 6%;
  }

  #exit-button {
    background-color: #F44336;
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