<template>
  <div id="game-page">
    <HeaderGame 
      :distance="distance"
      :score="score"
      :round="round" />
    <div id="street-view-container">
      <div id="street-view">
      </div>
      <Maps
        :randomLatLng="randomLatLng"
        :round="round"
        :score="score"
        @selectLocation="calcurateDistance"
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
        selectedLatLng: null,
        distance: null,
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
      calcurateDistance(selectedLatLng) {
        this.selectedLatLng = selectedLatLng
        this.distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(this.randomLatLng, this.selectedLatLng) / 1000)
        this.score += this.distance
        this.overlay = true
      },
      goToNextRound() {
        // Reset
        this.selectedLatLng = null
        this.randomLatLng = null
        this.overlay = false

        // Replace streetview with new one
        this.loadStreetView()

        // Update the round
        this.round += 1
      },
      playAgain() {
        // Reset
        this.selectedLatLng = null
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
    height: 85%; 
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
</style>
