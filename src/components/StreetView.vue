<template>
  <div id="game-page">
    <div id="street-view-container">
      
        <HeaderGame 
          :score="score"
          :round="round" />
      <div id="game-interface">
        <div id="street-view">
        </div>
        <div id="game-interface--overlay">
        <Maps
          :randomLatLng="randomLatLng"
          :round="round"
          :score="score"
          @calculateDistance="updateScore"
          @goToNextRound="goToNextRound"
          @playAgain="playAgain" />
        </div>
      </div>
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="2"/>
  </div>
</template>

<script>
  import HeaderGame from '@/components/HeaderGame'
  import Maps from '@/components/Maps'

  export default {
    components: {
      HeaderGame,
      Maps,
    },
    data() {
      return {
        randomLatLng: null,
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
          var panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'))
          panorama.setOptions({
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
          })
          panorama.setPano(data.location.pano)
          panorama.setPov({
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
      }
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
  #game-interface{
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

  @media (max-width: 450px) {
    #street-view {
      position: fixed;
      min-height: 100%;
      height: 92%;
    }

  }

</style>
