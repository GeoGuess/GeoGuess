<template>
  <div id="game-page">
    <HeaderGame
      :score="scoreHeader"
      :round="round" />
    <div id="street-view-container">
      <div id="street-view">
      </div>
      <MapsWithFriends
        ref="map"
        :randomLatLng="randomLatLng"
        :roomName="roomName"
        :playerNumber="playerNumber"
        :isReady="isReady"
        :round="round"
        :score="score"
        @calculateDistance="updateScore"
        @showResult="showResult"
        @goToNextRound="goToNextRound"
        @finishGame="finishGame" />
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="2"/>
    <DialogMessage 
      :dialogMessage="dialogMessage"
      :dialogTitle="dialogTitle"
      :dialogText="dialogText" />
  </div>
</template>

<script>
  // Force to exit the game when one of the other player exit the game
  import firebase from 'firebase/app'
  import 'firebase/database'

  import HeaderGame from '@/components/HeaderGame'
  import MapsWithFriends from '@/components/MapsWithFriends'
  import DialogMessage from '@/components/DialogMessage'

  export default {
    props: [
      'roomName',
      'playerNumber',
    ],
    components: {
      HeaderGame,
      MapsWithFriends,
      DialogMessage,
    },
    data() {
      return {
        randomLatLng: null,
        randomLat: null,
        randomLng: null,
        score: 0,
        scoreHeader: 0,
        round: 1,
        overlay: false,
        room: null,
        isReady: false,
        dialogMessage: true,
        dialogTitle: 'Waiting for other players...',
        dialogText: '',
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
            motionTracking: false,
            showRoadLabels: false,
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
      updateScore(distance) {
        // Update the score and save it into firebase
        this.score += distance
        this.room.child('final_score/Player' + this.playerNumber).set(this.score)

        // Wait for other players to guess locations
        this.dialogTitle = 'Waiting for other players...'
        this.dialogMessage = true
      },
      showResult() {
        this.scoreHeader = this.score  // Update the score on header after every players guess locations
        this.dialogMessage = false
        this.overlay = true
      },
      goToNextRound() {
        // Reset
        this.randomLatLng = null
        this.overlay = false
        this.isReady = false  // Turn off the flag so the click event can be added in the next round
        this.dialogMessage = true  // Show the dialog while waiting for other players

        // Update the round
        this.round += 1

        if (this.playerNumber == 1) {
          this.loadStreetView()
        } else {
          // Trigger listener and load the next streetview
          this.room.child('trigger/Player' + this.playerNumber).set(this.round)
          this.$refs.map.startNextRound()
        }

      },
      exitGame() {
        // Disable the listener and force the players to exit the game
        this.dialogTitle = 'Redirect to Home Page...'
        this.dialogText = 'You are forced to exit the game. Redirect to home page after 5 seconds...'
        this.dialogMessage = true
        this.room.off()
        this.room.remove()
        const that = this
        setTimeout(function() {
          that.$router.push({ name: 'home' })
        }, 5000)
      },
      finishGame() {
        // Open the dialog while waiting for other players to finsih the game
        this.dialogTitle = 'Waiting for other players to finish the game...'
        this.dialogText = ''
        this.dialogMessage = true
      }
    },
    mounted() {
      if (this.playerNumber == 1) {
        this.loadStreetView()
      }

      const that = this

      // Set a room name if it's null to detect when the user refresh the page
      if (this.roomName == null) {
        this.roomName = 'thisIsFakeName'
      }
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

            // Close the dialog when evryone is ready
            if (that.isReady == false) {
              that.dialogMessage = false
            }

            that.isReady = true
            that.$refs.map.startNextRound()

            // Countdown timer starts
          }

          // Delete the room when everyone finished the game
          if (snapshot.child('is_game_done').numChildren() == snapshot.child('size').val()) {
            that.room.child('Active').remove()
          }

        } else {
          // Force the players to exit the game when 'Active' is removed
          that.exitGame()
        }
      })

      window.addEventListener('popstate', function(event) {
        // Remove the room when the player pressed the back button on browser
        that.room.child('Active').remove()
        that.room.off()
      })

      window.addEventListener('beforeunload', function(event) {
        // Remove the room when the player refreshes the window
        that.room.child('Active').remove()
      })

      // Force to exit the game if it's still the name that is set programmatically
      if (this.roomName == 'thisIsFakeName') {
        that.room.child('Active').remove()
      }
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
