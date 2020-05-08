<template>
  <div id="container-map" 
      :class="[(($viewport.width >= 450 && (activeMap|| pinActive)) || isMakeGuessButtonClicked) ? 'container-map--active': '', `container-map--size-${size}`]"
      @mouseover="activeMap = true"
      @mouseleave="activeMap = false"
    >
    <div class="container-map_controls">
      <div class="container-map_btns">
        <v-btn fab x-small @click="size--" :disabled="size<2">
            <v-icon dark>mdi-arrow-bottom-left</v-icon>
          </v-btn>

        <v-btn fab x-small @click="size++" :disabled="size>3">
            <v-icon dark >mdi-arrow-top-right</v-icon>
          </v-btn>

        <v-btn fab x-small  @click="pinActive = !pinActive">
          <v-icon dark >mdi-pin{{(pinActive)? '-off': ''}}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-btn
      id="hide-map-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && isMakeGuessButtonClicked"
      fab
      x-small
      color="red"
      @click="hideMap"
      >
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
        <div 
      id="map">
    </div>
    <button
      id="make-guess-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && !isMakeGuessButtonClicked"
      @click="showMap"
      >
      MAKE GUESS
    </button>
    <div>
      <button
        id="reset-button"
        v-if="!isGuessButtonClicked && ($viewport.width > 450 || isMakeGuessButtonClicked)"
        @click="resetLocation"
        >RESET
      </button>
      <button
        id="guess-button"
        :disabled="selectedLatLng == null || isGuessButtonClicked || !isReady"
        v-if="!isNextButtonVisible && !isSummaryButtonVisible && ($viewport.width > 450 || isMakeGuessButtonClicked)"
        @click="selectLocation"
        >GUESS
      </button>
    </div>
    <button
      id="next-button"
      :disabled="!isNextButtonEnabled"
      :style="{ backgroundColor: isNextButtonEnabled ? '#F44336' : '#B71C1C' }"
      v-if="isNextButtonVisible"
      @click="goToNextRound"
      >NEXT ROUND
    </button>
    <button
      id="summary-button"
      v-if="isSummaryButtonVisible"
      @click="dialogSummary = true"
      >VIEW SUMMARY
    </button>
    <DialogSummaryWithFriends
      :dialogSummary="dialogSummary"
      :summaryTexts="summaryTexts"
      :score="score"
      @finishGame="finishGame" />
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import DialogSummaryWithFriends from '@/components/DialogSummaryWithFriends'

  export default {
    props: [
      'randomLatLng',
      'roomName',
      'playerNumber',
      'isReady',
      'round',
      'score',
    ],
    components: {
      DialogSummaryWithFriends,
    },
    data() {
      return {
        markers: [],
        polylines: [],
        summaryTexts: [],
        strokeColors: [
          '#F44336',
          '#76FF03',
          '#FFEB3B',
          '#FF4081',
          '#18FFFF',
        ],
        map: null,
        room: null,
        selectedLatLng: null,
        distance: null,
        isGuessButtonClicked: false,
        isMakeGuessButtonClicked: false,
        isSelected: false,
        isNextStreetViewReady: false,
        isNextButtonVisible: false,
        isSummaryButtonVisible: false,
        dialogSummary: false,
        activeMap: false,
        size: 2,
        pinActive: false,
      }
    },
    computed: {
      isNextButtonEnabled() {
        if (this.playerNumber == 1) {
          return true
        } else {
          if (this.isNextStreetViewReady == true) {
            return true
          } else {
            return false
          }
        }
      }
    },
    methods: {
      showMap() {
        this.isMakeGuessButtonClicked = true
      },
      hideMap() {
        this.isMakeGuessButtonClicked = false
      },
      selectLocation() {
        this.calculateDistance()

        // Save the selected location into database
        // So that it uses for putting the markers and polylines
        this.room.child('guess/player' + this.playerNumber).set({
            latitude: this.selectedLatLng.lat(),
            longitude:this.selectedLatLng.lng()
        })

        // Clear the event
        google.maps.event.clearListeners(this.map, 'click')

        // Diable guess button and opacity of the map
        this.isGuessButtonClicked = true
        this.isSelected = true

        // Turn off the flag before the next button appears
        this.isNextStreetViewReady = false

      },
      selectRandomLocation(randomLatLng) {
        // set a random location if the player didn't select in time
        this.selectedLatLng = randomLatLng
        this.removeMarkers()
        this.putMarker(this.selectedLatLng)
        this.selectLocation()
      },
      resetLocation(){
        this.$emit('resetLocation')
      },
      putMarker(position) {
        var marker = new google.maps.Marker({
          position: position,
          map: this.map,
        })
        this.markers.push(marker)
      },
      removeMarkers() {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null)
        }
        this.markers = []
      },
      calculateDistance() {
        this.distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(this.randomLatLng, this.selectedLatLng))

        // Save the distance into firebase
        this.room.child('round' + this.round + '/player' + this.playerNumber).set(this.distance)

        this.$emit('calculateDistance', this.distance)
      },
      setInfoWindow(playerName, distance) {
        let dataToDisplay =''
        if(this.distance < 1000){
          dataToDisplay = '<b>' + playerName + '</b>' + ' is <b>' + this.distance + '</b> m away!'
        }else{
          dataToDisplay = '<b>' + playerName + '</b>' + ' is <b>' + this.distance / 1000  + '</b> km away!'
        }
        var infoWindow = new google.maps.InfoWindow({
          content: dataToDisplay
        })
        infoWindow.open(this.map, this.markers[this.markers.length - 1])
      },
      drawPolyline(selectedLatLng, i) {
        var polyline = new google.maps.Polyline({
          path: [selectedLatLng, this.randomLatLng],
          strokeColor: this.strokeColors[i],
        })
        polyline.setMap(this.map)
        this.polylines.push(polyline)
      },
      removePolylines() {
        for (var i = 0; i < this.polylines.length; i++) {
          this.polylines[i].setMap(null)
        }
      },
      startNextRound() {
        this.map.addListener('click', (e) => {
          // Clear the previous marker when clicking the map
          this.removeMarkers()

          // Show the new marker
          this.putMarker(e.latLng)

          // Save latLng
          this.selectedLatLng = e.latLng
        })   
      },
      goToNextRound() {
        // Reset
        this.selectedLatLng = null
        this.isGuessButtonClicked = false
        this.isSelected = false
        this.isNextButtonVisible = false

        if (this.$viewport.width < 450) {
          // Hide the map if the player is on mobile
          this.hideMap()
        }

        this.removeMarkers()
        this.removePolylines()

        // Replace the streetview with the next one
        this.$emit('goToNextRound')
      },
      finishGame() {
        this.dialogSummary = false
        this.room.child('isGameDone/player' + this.playerNumber).set(true)
        this.$emit('finishGame')
      },
    },
    mounted() {
      this.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,        
      })

      this.room = firebase.database().ref(this.roomName)
      this.room.on('value', (snapshot) => {
        // Check if the room is already removed
        if (snapshot.hasChild('active')) {

          // Allow players to move on to the next round when every players guess locations
          if (snapshot.child('guess').numChildren() == snapshot.child('size').val()) {
            this.$emit('showResult')

            // Put markers and draw polylines on the map
            var i = 0
            var j = 1
            snapshot.child('guess').forEach((childSnapshot) => {
              var lat = childSnapshot.child('latitude').val()
              var lng = childSnapshot.child('longitude').val()
              var latLng = new google.maps.LatLng({lat: lat, lng: lng});

              var playerName = snapshot.child('playerName').child(childSnapshot.key).val()
              var distance = snapshot.child('round' + this.round + '/player' + j).val()

              this.drawPolyline(latLng, i)
              this.putMarker(latLng)
              this.setInfoWindow(playerName, distance)
              i++
              j++
            })
            this.putMarker(this.randomLatLng)

            // Remove guess node every time the round is done
            this.room.child('guess').remove()

            if (this.round >= 5) {
              // Show summary button
              snapshot.child('finalScore').forEach((childSnapshot) => {
                var playerName = snapshot.child('playerName').child(childSnapshot.key).val()
                var finalScore = childSnapshot.val()
                this.summaryTexts.push({
                  playerName: playerName,
                  finalScore: finalScore,
                })
              })

              this.summaryTexts.sort((a,b) => parseInt(a.finalScore)-parseInt(b.finalScore))

              this.isSummaryButtonVisible = true

            } else {
              // Show next button
              this.isNextButtonVisible = true
            }
          }

          // Allow other players to move on to the next round when the next street view is set
          if (snapshot.child('streetView').numChildren() == this.round + 1) {
            this.isNextStreetViewReady = true
          }
        }
      })
    },
  }
</script>

<style scoped lang="scss">
  #container-map{
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 5px;
    left: 10px;
    z-index: 3;
    opacity: 0.7;
    width: var(--width);
    height: var(--height);
    z-index: 3;
    --aspect-ratio: 1.25;
    --inactive-width: 16vw;
    --active-width: 30vw;
    --active-height: calc(var(--active-width)/var(--aspect-ratio));
    --inactive-height: calc(var(--inactive-width)/var(--aspect-ratio));
    --height: var(--inactive-height);
    --width: var(--inactive-width);
    max-width: 100%;
    max-height: calc(100% - 150px);
    #map{
      width: 100%;
      height: 100%;
    }

    &.container-map--size-1{
      --active-width: 16vw;
    }
    &.container-map--size-3{
      --active-width: 45vw;
    }
    &.container-map--size-4{
      --active-width: 65vw;
    }
    &.container-map--active {
      opacity: 1;
      --width: var(--active-width);
      --height: var(--active-height);
      .container-map_controls{
        display: flex;

      }
    }
    .container-map_controls{
        display: none;
        .container-map_btns{
          background-color: rgba(33,33,33);
          padding: 0.2rem;
          border-top-left-radius: 5%;
          border-top-right-radius: 5%;
        }
        button {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0 0.5rem;
        }
        display: flex;
        flex-direction: row-reverse;
    }
  }

  
  #make-guess-button, #guess-button, #next-button, #summary-button, #reset-button {
    border: none;
    border-radius: 5px;
    opacity: 0.8;
    color: white;
    font-size: 16px;
    text-decoration: none;
    text-align: center;
    padding: 10px 0;   
  }

  #make-guess-button, #guess-button {
    width: 75%;
  }

  #reset-button {
    width: 25%;
    background-color: #ff5e5e;
  }

  #next-button, #summary-button {
    width: 100%;
  }

  #make-guess-button, #guess-button {
    background-color: #212121;
  }

  #guess-button:hover, #reset-button {
    opacity: 1.0;
  }

  #next-button, #summary-button {
    background-color: #F44336;
  }


  @media (max-width: 450px) {
    #container-map{
        display: flex;
        flex-direction: column;
      #map{
        display: none;
      }
      &.container-map--active #map{
        display: block;
      }
      
      &.container-map--active .container-map_controls{
        display: none;
      }
      bottom: 0;
      width: 95%;
      &.container-map--active {
        height: 30vh;

      }
    }
    #make-guess-button, #guess-button, #next-button, #summary-button {
      bottom: 0;
      width: 100%;
    }

    #hide-map-button {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 4;
    }
  }
</style>
