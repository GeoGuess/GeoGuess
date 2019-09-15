<template>
  <div>
    <div
      id="map"
      @mouseover="mouseOverMap"
      @mouseleave="mouseOutMap">
    </div>
    <button
      id="guess-button"
      :disabled="isClicked == true || isReady == false"
      v-if="isNextButtonVisible == false"
      @click="selectLocation"
      >GUESS
    </button>
    <button
      id="next-button"
      :disabled="!isNextButtonEnabled"
      v-if="isNextButtonVisible == true"
      @click="goToNextRound"
      >NEXT ROUND
    </button>
  </div>
</template>

<script>
  /** To do:
  * Put markers and draw polylines
  * Show the summary
  */
  import firebase from 'firebase/app'
  import 'firebase/database'

  export default {
    props: [
      'roomName',
      'playerNumber',
      'isReady',
      'round',
      'score',
    ],
    data() {
      return {
        markers: [],
        map: null,
        room: null,
        selectedLatLng: null,
        isClicked: false,
        isSelected: false,
        isNextStreetViewReady: false,
        isNextButtonVisible: false,
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
      selectLocation() {
        // Save the selected location into database
        // So that it uses for putting the markers and polylines
        this.room.child('guesses/Player' + this.playerNumber).set({
            latitude: this.selectedLatLng.lat(),
            longitude:this.selectedLatLng.lng()
        })

        // Clear the event
        google.maps.event.clearListeners(this.map, 'click')

        // Diable guess button and opacity of the map
        this.isClicked = true
        this.isSelected = true

        // Focus on the map
        this.mouseOverMap()

        this.$emit('selectLocation', this.selectedLatLng)
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
      },
      goToNextRound() {
        // Reset
        this.selectedLatLng = null
        this.isClicked = false
        this.isSelected = false

        this.removeMarkers()

        this.mouseOutMap()

        // Replace the streetview with the next one
        this.$emit('goToNextRound')
      },
      mouseOverMap() {
        // Focus on map
        document.getElementById('map').style.opacity = 1.0
      },
      mouseOutMap() {
        // Focus on map while the player selected a location
        // Otherwise set the opacity of the map
        if (this.isSelected == false) {
          document.getElementById('map').style.opacity = 0.7
        }
      },
    },
    watch: {
      isReady: function(newVal, oldVal) {
        // Enable click event when everyone is ready
        if (newVal == true) {
          const that = this
          that.map.addListener('click', function(e) {
            // Clear the previous marker when clicking the map
            that.removeMarkers()

            // Show the new marker
            that.putMarker(e.latLng)

            // Save latLng
            that.selectedLatLng = e.latLng
          })          
        }
      }
    },
    mounted() {
      this.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          scrollwheel: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,        
      })

      const that = this
      this.room = firebase.database().ref(this.roomName)
      this.room.on('value', function(snapshot) {
        // Check if the room is already removed
        if (snapshot.hasChild('Active')) {

          // Allow players to move on to the next round when every players guess locations
          if (snapshot.child('guesses').numChildren() == snapshot.child('size').val()) {

            // Put markers and draw polylines on the map

            // Remove guess node every time the round is done
            that.room.child('guesses').remove()

            if (that.round >= 5) {
              // Show summary button

            } else {
              // Show next button
              that.isNextButtonVisible = true
            }
          }

          // Allow other players to move on to the next round when the next street view is set
          if (snapshot.child('street_views').numChildren() == that.round + 1) {
            that.isNextStreetViewReady = true
          }
        }
      })
    },
  }
</script>

<style scoped>
  button {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 3;
    border: none;
    border-radius: 5px;
    opacity: 0.8;
    color: white;
    font-size: 16px;
    text-decoration: none;
    text-align: center;
    padding: 10px 60px;
    width: 360px;    
  }

  #map {
    position: absolute;
    bottom: 60px;
    left: 10px;
    z-index: 3;
    opacity: 0.7;
    height: 240px;
    width: 360px;
  }

  #guess-button {
    background-color: #212121;
  }

  #guess-button:hover {
    opacity: 1.0;
  }

  #next-button, #summary-button {
    background-color: #F44336;
  }

  @media (max-width: 900px) {
    button {
      width: 300px;
    }

    #map {
      height: 200px; 
      width: 300px;
    }
  }  
</style>
