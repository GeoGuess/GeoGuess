<template>
  <div id="game-page">
    <HeaderGame
      ref="header"
      :score="scoreHeader"
      :round="round"
      :remainingTime="remainingTime" />
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
  import firebase from 'firebase/app'
  import 'firebase/database'

  import HeaderGame from '@/components/widgets/bar/HeaderGame'
  import MapsWithFriends from '@/components/MapsWithFriends'
  import DialogMessage from '@/components/widgets/dialog/DialogMessage'

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
        timeLimitation: 0,
        remainingTime: 0,
        hasTimerStarted: false,
        hasLocationSelected: false,
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

          // Put the streetview's location into firebase
          this.room.child('streetView/round' + this.round).set({
            latitude: this.randomLatLng.lat(),
            longitude:this.randomLatLng.lng()
          })

        } else {
          this.loadStreetView()
        }
      },
      startTimer() {
        if (!this.hasLocationSelected) {
          if (this.remainingTime > 0) {
            setTimeout(() => {
              this.remainingTime -= 1
              this.startTimer()
            }, 1000)
          } else {
            // Set a random location if the player didn't select a location in time
            this.$refs.map.selectRandomLocation(this.getRandomLatLng())
          }
        }
      },
      updateScore(distance) {
        // Update the score and save it into firebase
        this.hasLocationSelected = true
        this.score += distance
        this.room.child('finalScore/player' + this.playerNumber).set(this.score)

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
        this.hasTimerStarted = false
        this.hasLocationSelected = false

        // Update the round
        this.round += 1

        if (this.playerNumber == 1) {
          this.loadStreetView()
        } else {
          // Trigger listener and load the next streetview
          this.room.child('trigger/player' + this.playerNumber).set(this.round)
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
        
        setTimeout(() => {
          this.$router.push({ name: 'home' })
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

      // Set a room name if it's null to detect when the user refresh the page
      if (this.roomName == null) {
        this.roomName = 'defaultRoomName'
      }
      this.room = firebase.database().ref(this.roomName)
      this.room.child('active').set(true)
      this.room.on('value', (snapshot) => {
        // Check if the room is already removed
        if (snapshot.hasChild('active')) {

          // Put the player into the current round node if the player is not put yet
          if (!snapshot.child('round' + this.round).hasChild('player' + this.playerNumber)) {

            this.room.child('round' + this.round).child('player' + this.playerNumber).set(0)

            // Other players load the streetview the first player loaded earlier
            if (this.playerNumber != 1) {
              this.randomLat = snapshot.child('streetView/round' + this.round + '/latitude').val()
              this.randomLng = snapshot.child('streetView/round' + this.round + '/longitude').val()

              this.loadDecidedStreetView()
            }
          }

          // Enable guess button when every players are put into the current round's node
          if (snapshot.child('round' + this.round).numChildren() == snapshot.child('size').val()) {

            // Close the dialog when evryone is ready
            if (this.isReady == false) {
              this.dialogMessage = false
            }

            this.isReady = true
            this.$refs.map.startNextRound()

            // Countdown timer starts
            this.timeLimitation = snapshot.child('timeLimitation').val() * 60

            if (this.timeLimitation != 0) {
              if (!this.hasTimerStarted) {
                this.remainingTime = this.timeLimitation
                this.startTimer()
                this.hasTimerStarted = true
              }
            }
          }

          // Delete the room when everyone finished the game
          if (snapshot.child('isGameDone').numChildren() == snapshot.child('size').val()) {
            this.room.child('active').remove()
          }

        } else {
          // Force the players to exit the game when 'Active' is removed
          this.exitGame()
        }
      })

      window.addEventListener('popstate', (event) => {
        // Remove the room when the player pressed the back button on browser
        this.room.child('active').remove()
        this.room.off()
      })

      window.addEventListener('beforeunload', (event) => {
        // Remove the room when the player refreshes the window
        this.room.child('active').remove()
      })

      // Force to exit the game if it's still the name this is set programmatically
      if (this.roomName == 'defaultRoomName') {
        this.room.child('active').remove()
      }
    }
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

  @media (max-width: 450px) {
    #game-page {
      position: fixed;
      height: 92%;
    }
  }
</style>
