<template>
  <div id="game-page">
    <div id="street-view-container">
      
      <HeaderGame
        ref="header"
        :score="scoreHeader"
        :points="pointsHeader"
        :round="round"
        :roomName="roomName"
        :remainingTime="remainingTime" />
        
      <div id="game-interface">
        <div id="street-view">
        </div>
        
        <div id="game-interface--overlay">
      <Maps
        ref="map"
        :randomLatLng="randomLatLng"
        :roomName="roomName"
        :playerNumber="playerNumber"
        :isReady="isReady"
        :round="round"
        :score="score"
        :points="points"
        :difficulty="difficulty"
        :timeLimitation="timeLimitation"
        @resetLocation="resetLocation"
        @calculateDistance="updateScore"
        @showResult="showResult"
        @goToNextRound="goToNextRound"
        @finishGame="finishGame" />
        </div>
        </div>
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="1"/>
    <DialogMessage 
      :dialogMessage="dialogMessage"
      :dialogTitle="dialogTitle"
      :dialogText="dialogText" />
    <v-alert type="warning" dismissible class="warning-alert" v-if="isVisibleDialog" tile>
     <b>Nearby Position</b> : Unfortunately, we were unable to find a random position in the defined location. However, we have found one nearby 😉
    </v-alert>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import HeaderGame from '@/components/HeaderGame'
  import Maps from '@/components/Maps'
  import DialogMessage from '@/components/DialogMessage'

  import randomPositionInPolygon from 'random-position-in-polygon'
  import axios from 'axios'
  import * as turfModel from '@turf/helpers'
  import {isInGeoJSON} from '../utils'
  
  export default {
    props:{
      'roomName': {
        default: null,
        type: String
      },
      'playerNumber': {
        default: null,
        type: Number
      },
      'placeGeoJson': {
        default: null,
        type: Object
      },
      'multiplayer': {
        default: false,
        type: Boolean
      },
      'time': {
        default: 0,
        type: Number
      },
      'difficulty': {
        default: 0,
        type: Number
      }
    },
    components: {
      HeaderGame,
      Maps,
      DialogMessage,
    },
    data() {
      return {
        randomLatLng: null,
        randomLat: null,
        randomLng: null,
        score: 0,
        scoreHeader: 0,
        points: 0,
        pointsHeader: 0,
        round: 1,
        timeLimitation: this.time*60,
        remainingTime: 0,
        hasTimerStarted: false,
        hasLocationSelected: false,
        overlay: false,
        room: null,
        isReady: false,
        dialogMessage: this.multiplayer,
        dialogTitle: 'Waiting for other players...',
        dialogText: '',
        cptNotFoundLocation: 0,
        isVisibleDialog: false,
        panorama: null,
        timerInProgress: true,
      }
    },
    methods: {
      loadStreetView() {
        var service = new google.maps.StreetViewService()
        service.getPanorama({
          location: this.getRandomLatLng(),
          preference: 'nearest',
          radius: (this.placeGeoJson != null) ? 50 :  100000,
          source: 'outdoor',
        }, this.checkStreetView)
      },
      getRandomLatLng() {

        if(this.placeGeoJson != null){
          let position;
          if(this.placeGeoJson.type === "FeatureCollection"){ 
            let randInt = (Math.floor(Math.random() * (this.placeGeoJson.features.length)));

            const feature = this.placeGeoJson.features[randInt];
            if(feature.geometry.type === "Point"){
              position = feature.geometry.coordinates;
            }else {
              position = randomPositionInPolygon(feature);
            }

          } else{
            position = randomPositionInPolygon(this.placeGeoJson);
          }


          return new google.maps.LatLng(position[1], position[0]);
        }
          
        // Generate a random latitude and longitude
        let lat = (Math.random() * 170) - 85;
        let lng = (Math.random() * 360) - 180;
        
        return new google.maps.LatLng(lat, lng);
      },
      checkStreetView(data, status) {
        // Generate random streetview until the valid one is generated
        if (status == 'OK') {
          this.panorama.setOptions({
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
                    
          if(this.placeGeoJson != null && this.cptNotFoundLocation < 3 && !isInGeoJSON(turfModel.point([data.location.latLng.lng(), data.location.latLng.lat()]), this.placeGeoJson) ){
            this.loadStreetView()
            this.cptNotFoundLocation++; 
          }else{
             // If 3 times Street View does not find location in the polygon placeGeo print warning message
            if(this.placeGeoJson != null && !isInGeoJSON(turfModel.point([data.location.latLng.lng(), data.location.latLng.lat()]), this.placeGeoJson)) {
              this.isVisibleDialog = true;
            }
            // Save the location's latitude and longitude
            this.randomLatLng = data.location.latLng
            this.cptNotFoundLocation = 0;

            if(this.multiplayer){
              // Put the streetview's location into firebase
              this.room.child('streetView/round' + this.round).set({
                latitude: this.randomLatLng.lat(),
                longitude:this.randomLatLng.lng(),
                warning: this.isVisibleDialog
              })
            }
          }


        } else {
          this.loadStreetView()
        }
      },
      resetLocation(){
        this.panorama.setOptions({
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
        })
        this.panorama.setPosition(this.randomLatLng)
      },
      startTimer(round = this.round) {
        if(round === this.round){
          if (this.remainingTime > 0) {
            setTimeout(() => {
              this.remainingTime -= 1
              this.startTimer(round)
            }, 1000)
          } else {    
            this.timerInProgress = false
            if (!this.hasLocationSelected) {
              // Set a random location if the player didn't select a location in time
              this.$refs.map.selectRandomLocation(this.getRandomLatLng()) 
            }
          }
        }
      },
      updateScore(distance, points) {
        // Update the score and save it into firebase
        this.hasLocationSelected = true
        if(!this.multiplayer){
          this.remainingTime = 0;
        }
        this.score += distance
        this.points += points

        if(this.multiplayer){
          this.room.child('finalScore/player' + this.playerNumber).set(this.score)
          this.room.child('finalPoints/player' + this.playerNumber).set(this.points)

          // Wait for other players to guess locations
          this.dialogTitle = 'Waiting for other players...'
          this.dialogMessage = true
        }
      },
      showResult() {
        this.scoreHeader = this.score  // Update the score on header after every players guess locations
        this.pointsHeader = this.points
        this.remainingTime = 0;
        this.dialogMessage = false
        this.overlay = true
      },
      goToNextRound() {
        // Reset
        this.randomLatLng = null
        this.overlay = false
        this.hasTimerStarted = false
        this.hasLocationSelected = false
        this.isVisibleDialog =false

        if(this.multiplayer){
          this.dialogMessage = true  // Show the dialog while waiting for other players
          this.isReady = false  // Turn off the flag so the click event can be added in the next round
        }

        // Update the round
        this.round += 1

        if (this.playerNumber == 1 || !this.multiplayer) {
          this.loadStreetView()
          if (!this.multiplayer && this.timeLimitation != 0) {
            this.remainingTime = this.timeLimitation
            this.startTimer()
          }
        } else {
          // Trigger listener and load the next streetview
          this.room.child('trigger/player' + this.playerNumber).set(this.round)
        }
        this.$refs.map.startNextRound()

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
        if(!this.multiplayer){
          this.$router.push('/')
        }else{
          // Open the dialog while waiting for other players to finsih the game
          this.dialogTitle = 'Waiting for other players to finish the game...'
          this.dialogText = ''
          this.dialogMessage = true
        }
      }
    },
    mounted() {
      this.panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'))
      if (this.playerNumber == 1 || !this.multiplayer) {
        this.loadStreetView()
      }
      
      if(!this.multiplayer){
        this.$refs.map.startNextRound()
        
        if (this.timeLimitation != 0) {
          if (!this.hasTimerStarted) {
            this.remainingTime = this.timeLimitation
            this.startTimer()
            this.hasTimerStarted = true
          }
        }
        
      }else{
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
                this.isVisibleDialog = snapshot.child('streetView/round' + this.round + '/warning').val()
                this.randomLatLng = new google.maps.LatLng(this.randomLat, this.randomLng);
                this.resetLocation();
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
              this.difficulty = snapshot.child('difficulty').val()

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
  }
</script>

<style scoped lang="scss">
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
    #game-interface--overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
    }
  }

  #street-view {
    position: relative;
    min-height: 100%;
    width: 100%;
  }

  .warning-alert{
    z-index: 1;
    margin-top: 56px;
  }
  @media (max-width: 450px) {
    #street-view {
      position: fixed;
      min-height: 92%;
      height: 92%;
    }
  }
</style>
