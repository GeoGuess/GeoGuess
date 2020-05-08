<template>
  <v-dialog 
    v-model="dialogSummary" 
    max-width="720" 
    persistent
    :fullscreen="$viewport.width < 450">
    <v-card color="#061422">
      <v-card-text id="card-text">
        <v-row justify="center">
          <span id="summary-text">You are <strong>{{ score / 1000 }}</strong> km away!</span>
        </v-row>
        <v-row
          class="mt-8"
          justify="center">
          <v-btn
            id="exit-button"
            class="ml-4 mr-4"
            dark
            color="#FF5252"
            @click="$router.push('/')">EXIT</v-btn>
          <v-btn 
            id="play-again-button"
            class="ml-4 mr-4"
            dark
            color="#43B581"
            @click="playAgain">PLAY AGAIN</v-btn>
        </v-row>
      </v-card-text>
      <v-card-text class="text-right">
        <v-btn
          target="_blank"
          :href="'http://www.facebook.com/sharer.php?u=https://geoguessmaster.com/&amp;t=I am ' + score / 1000 + ' km away! How close can you guess?'" 
          rel="nofollow"
          icon
          color="#FFFFFF">
          <v-icon size="32">mdi-facebook-box</v-icon>
        </v-btn>
        <v-btn
          target="_blank"
          :href="'http://twitter.com/share?url=https://geoguessmaster.com/&amp;text=I am ' + score / 1000 +' km away! How close can you guess?'" 
          icon
          color="#FFFFFF">
          <v-icon size="32">mdi-twitter-box</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: [
      'dialogSummary',
      'score',
    ],
    methods: {
      updateRecord() {
        var currentRecord = localStorage.getItem('record')
        if (currentRecord == null || this.score < currentRecord) {
          localStorage.setItem('record', this.score)
        }
      },
      playAgain() {
        this.$emit('playAgain')
      }
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
  span {
    font-family: Montsetrrat;
  }

  #card-text {
    padding: 80px 10% 80px 10%;
  }

  #summary-text {
    font-size: 18px;
    color: #FFFFFF;
    opacity: 0.9;
  }

  #exit-button, #play-again-button {
    height: 44px;
    width: 210px;
    border-radius: 40px;
  }

  @media (max-width: 450px) {
    #exit-button, #play-again-button {
      height: 36px;
    }

    #exit-button {
      margin-top: 28px;
      margin-bottom: 24px;
    }
  }
</style>
