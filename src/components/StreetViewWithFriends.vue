<template>
  <div id="game-page">
    <HeaderGame
      :distance="distance"
      :score="score"
      :round="round" />
    <div id="street-view-container">
      <div id="street-view">
      </div>
      <MapsWithFriends
        :randomLatLng="randomLatLng"
        :roomName="roomName"
        :playerNumber="playerNumber"
        :isReady="isReady"
        :round="round"
        :score="score"
        @selectLocation="calcurateDistance"
        @showResult="showResult"
        @goToNextRound="goToNextRound" />
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="2"/>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import HeaderGame from '@/components/HeaderGame'
  import MapsWithFriends from '@/components/MapsWithFriends'

  export default {
    props: [
      'roomName',
      'playerNumber',
    ],
    components: {
      HeaderGame,
      MapsWithFriends,
    },
    data() {
      return {
        randomLatLng: null,
        randomLat: null,
        randomLng: null,
        distance: null,
        score: 0,
        round: 1,
        overlay: false,
        room: null,
        isReady: false,
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
      loadDecidedStreetView() {
        // Other players load the decided streetview the first player loaded
        var service = new google.maps.StreetViewService()
        service.getPanorama({
          location: {
            lat: this.randomLat,
            lng: this.randomLng,
          },
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

          // Put the streetview's location into firebase
          this.room.child('street_views/round' + this.round).set({
            latitude: this.randomLatLng.lat(),
            longitude:this.randomLatLng.lng()
          })

        } else {
          this.loadStreetView()
        }
      },
      calcurateDistance(selectedLatLng) {
        this.selectedLatLng = selectedLatLng
        this.distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(this.randomLatLng, this.selectedLatLng) / 1000)
        this.score += this.distance

        /* Issue: Mobile app executes the part that refers to the distance in the firebase faster than
        the web app executes the part that stores the distance into firebase
        so the distance always shows 0 */
        this.room.child('round' + this.round + '/Player' + this.playerNumber).set(this.distance)

        // Update the score stored into firebase
        this.room.child('final_score/Player' + this.playerNumber).set(this.score)
      },
      showResult() {
        // Every players guessed locations and show the result
        this.overlay = true
      },
      goToNextRound() {
        // Reset
        this.selectedLatLng = null
        this.randomLatLng = null
        this.overlay = false
        this.isReady = false  // Turn off the flag so the click event can be added in the next round

        // Update the round
        this.round += 1

        if (this.playerNumber == 1) {
          this.loadStreetView()
        } else {
          const that = this
          this.room.child('street_views/round' + this.round).on('value', function(snapshot) {
            that.randomLat = snapshot.child('latitude').val()
            that.randomLng = snapshot.child('longitude').val()

            that.loadDecidedStreetView()
          })
        }

      },
      exitGame() {
        // Force the players to exit the game
      },
    },
    mounted() {
      if (this.playerNumber == 1) {
        this.loadStreetView()
      }

      const that = this
      this.room = firebase.database().ref(this.roomName)
      this.room.child('Active').set(true)
      this.room.on('value', function(snapshot) {
        // Check if the room is already removed
        if (snapshot.hasChild('Active')) {

          // Put the player into the current round node if the player is not put yet
          if (!snapshot.child('round' + that.round).hasChild('Player' + that.playerNumber)) {

            that.room.child('round' + that.round).child('Player' + that.playerNumber).set(0)

            // Other players load the streetview the first player loaded earlier
            if (that.playerNumber != 1) {
              that.randomLat = snapshot.child('street_views/round' + that.round + '/latitude').val()
              that.randomLng = snapshot.child('street_views/round' + that.round + '/longitude').val()

              that.loadDecidedStreetView()
            }
          }

          // Enable guess button when every players are put into the current round's node
          if (snapshot.child('round' + that.round).numChildren() == snapshot.child('size').val()) {

            that.isReady = true

            // Countdown timer starts
          }

        } else {
          // Force the players to exit the game when 'Active' is removed
          that.exitGame()
        }
      })
    }
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
