<template>
  <v-footer
    id="footer"
    absolute
    color="#061422"
    :height="$viewport.width > 450 ? 210 : 300">
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
          <span id="privacy-policy">{{ $t('Footer.privacyPolicy') }}</span>
        </v-btn>
      </v-row>
      <v-row v-if="$viewport.width < 450">
        <v-col cols="6">
          <v-select
            :items="languages"
            :label="getCurrentLanguage"
            solo
            @change="switchLanguage">
          </v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    data() {
      return {
        languages: [
          {
            text: 'English',
            value: 'en',
          },
          {
            text: '日本語',
            value: 'ja',
          }
        ],
      }
    },
    computed: {
      getCurrentLanguage() {
        return this.languages.find(language => language.value == this.$i18n.locale).text
      },
    },
    methods: {
      switchLanguage(language) {
        this.$i18n.locale = language
        this.saveLanguage(language)
      },
      saveLanguage(language) {
        localStorage.setItem('language', language)
      },
    },
  }
</script>

<style scoped>
  span {
    font-family: Montsetrrat;
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
    #footer {
      top: 1440px;
    }   
  }
</style>