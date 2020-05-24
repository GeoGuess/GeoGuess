<template>
  <v-dialog
    v-model="dialogSummary"
    max-width="720"
    persistent
    :fullscreen="$viewport.width < 450">
    <v-card color="#061422">
      <v-card-text id="card-text">
        <v-row
          class="mt-3"
          justify="center" 
          v-for="(text, index) in summaryTexts"
          :key="index">
          <span id="summary-text">
            <v-icon 
              v-if="index == 0 || index == 1 || index == 2"
              :color="index == 0 ? '#FAA61A': (index == 1 ? '#EEEEEE' : '#F4511E')">mdi-crown</v-icon>
            <strong>{{ text.playerName }}</strong> is <strong>{{ text.finalScore / 1000 }}</strong> km away!
          </span>
        </v-row>
        <v-row justify="center">
          <v-btn
            class="mt-8"
            id="exit-button"
            dark
            color="#FF5252"
            @click="finishGame">EXIT</v-btn>
        </v-row>
      </v-card-text>
      <v-card-text class="text-right">
        <v-btn
          target="_blank"
          :href="'http://www.facebook.com/sharer.php?u='+url+'&amp;t=I am ' + score / 1000 + ' km away! How close can you guess?'" 
          rel="nofollow"
          icon
          color="#FFFFFF">
          <v-icon size="32">mdi-facebook-box</v-icon>
        </v-btn>
        <v-btn
          target="_blank"
          :href="'http://twitter.com/share?url='+url+'&amp;text=I am ' + score / 1000 +' km away! How close can you guess?'" 
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
      'summaryTexts',
      'score',
    ],
    data(){
      return {
        url: process.env.URL
      }
    },
    methods: {
      updateRecord() {
        var currentRecord = localStorage.getItem('record')
        if (currentRecord == null || this.score < currentRecord) {
          localStorage.setItem('record', this.score)
        }
      },
      finishGame() {
        this.$emit('finishGame')
      },
    },
    watch: {
      dialogSummary: function(newVal) {
        if (newVal == true) {
          this.updateRecord()
        }
      }      
    }
  } 
</script>

<style scoped>
  span {
    font-family: montserrat;
  }

  #exit-button {
    height: 44px;
    width: 240px;
    border-radius: 40px; 
  }

  #card-text {
    padding: 80px 10% 80px 10%;
  }

  #summary-text {
    font-size: 18px;
    color: #FFFFFF;
    opacity: 0.9;
  }

  @media (max-width: 450px) {
    #exit-button {
      height: 36px;
    }
  }
</style>