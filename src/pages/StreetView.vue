<template>
  <div id="game-page">
    <HeaderGame 
      :score="score"
      :round="round" />
    <div id="street-view-container">
      <div id="street-view">
        <v-btn 
          id="reset-button"
          icon
          color="#FFFFFF"
          @click="resetLocation">
          <v-icon size="36">mdi-flag</v-icon>
        </v-btn>
        <v-btn 
          id="zoom-in-button"
          icon
          color="#FFFFFF"
          @click="zoomIn">
          <v-icon size="36">mdi-plus</v-icon>
        </v-btn>
        <v-btn 
          id="zoom-out-button"
          icon
          color="#FFFFFF"
          @click="zoomOut">
          <v-icon size="36">mdi-minus</v-icon>
        </v-btn>
      </div>
      <Maps
        :randomLatLng="randomLatLng"
        :round="round"
        :score="score"
        @calculateDistance="updateScore"
        @goToNextRound="goToNextRound"
        @playAgain="playAgain" />
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="2"/>
  </div>
</template>

<script>
  import HeaderGame from '@/components/widgets/bar/HeaderGame'
  import Maps from '@/components/Maps'

  export default {
    components: {
      HeaderGame,
      Maps,
    },
    data() {
      return {
        randomLatLng: null,
        panorama: null,
        score: 0,
        round: 1,
        overlay: false,
      }
    },
    methods: {
      loadStreetView() {
        var service = new google.maps.StreetViewService()
        service.getPanorama({
          location: this.getRandomLatLng(),
          preference: 'nearest',
          radius: 100000,
          source: 'outdoor',
        }, this.checkStreetView)
      },
      getRandomLatLng() {
        // Generate a random latitude and longitude
        var lat = (Math.random() * 170) - 85
        var lng = (Math.random() * 360) - 180
        return new google.maps.LatLng(lat, lng)
      },
      checkStreetView(data, status) {
        // Generate random streetview until the valid one is generated
        if (status == 'OK') {
          this.panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'))
          this.panorama.setOptions({
            zoomControl: false,
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
          })
          this.panorama.setPano(data.location.pano)
          this.panorama.setPov({
            heading: 270,
            pitch: 0,
          })

          // Save the location's latitude and longitude
          this.randomLatLng = data.location.latLng
        } else {
          this.loadStreetView()
        }
      },
      updateScore(distance) {
        this.score += distance
        this.overlay = true
      },
      goToNextRound() {
        // Reset
        this.randomLatLng = null
        this.overlay = false

        // Update the round
        this.round += 1

        // Replace streetview with new one
        this.loadStreetView()
      },
      playAgain() {
        // Reset
        this.randomLatLng = null
        this.distance = null
        this.score = 0
        this.round = 1
        this.overlay = false

        // Load streetview
        this.loadStreetView()
      },
      resetLocation() {
        this.panorama.setPosition(this.randomLatLng)
      },
      zoomIn() {
        var currentLevel = this.panorama.getZoom()
        currentLevel++
        this.panorama.setZoom(currentLevel)
      },
      zoomOut() {
        var currentLevel = this.panorama.getZoom()
        currentLevel--
        this.panorama.setZoom(currentLevel)
      },
    },
    mounted() {
      // Generate the first streetview and check if it's valid
      this.loadStreetView()
    },
  }
</script>

<style scoped>
  #game-page {
    position: relative;
    height: 100%; 
    width: 100%; 
    top: 0; 
    left: 0;
  }

  #street-view-container {
    position: absolute;
    height: 100%; 
    width: 100%; 
    top: 0; 
    left: 0; 
  }

  #street-view {
    position: relative;
    min-height: 100%;
    width: 100%;
  }

  #reset-button, #zoom-in-button, #zoom-out-button {
    position: absolute;
    z-index: 2;
    background-color: #212121;
    opacity: 0.8;
    right: 12px;
  }

  #reset-button {
    bottom: 200px;
  }

  #zoom-in-button {
    bottom: 150px;
  }

  #zoom-out-button {
    bottom: 100px;
  }

  @media (max-width: 450px) {
    #game-page {
      position: fixed;
      height: 92%;
    }

    #reset-button {
      bottom: 120px;
    }

    #zoom-in-button {
      bottom: 70px;
    }

    #zoom-out-button {
      bottom: 20px;
    }
  }
</style>
