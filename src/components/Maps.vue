<template>
  <div>
    <div
      id="map"
      @mouseover="mouseOverMap"
      @mouseleave="mouseOutMap">
    </div>
    <v-btn
      id="hide-map-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && isMakeGuessButtonClicked"
      fab
      x-small
      color="red"
      @click="hideMap">
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
    <button
      id="make-guess-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && !isMakeGuessButtonClicked"
      @click="showMap">
      MAKE GUESS
    </button>
    <button
      id="guess-button"
      :disabled="selectedLatLng == null || isGuessButtonClicked"
      v-if="!isGuessButtonClicked && ($viewport.width > 450 || isMakeGuessButtonClicked)"
      @click="selectLocation"
      >GUESS
    </button>
    <button
      id="next-button"
      v-if="isGuessButtonClicked && round < 5"
      @click="goToNextRound"
      >NEXT ROUND
    </button>
    <button
      id="summary-button"
      v-if="isGuessButtonClicked && round >= 5"
      @click="dialogSummary = true"
      >VIEW SUMMARY
    </button>
    <DialogSummary
      :dialogSummary="dialogSummary"
      :score="score"
      @playAgain="playAgain" />
  </div>
</template>

<script>
  import DialogSummary from '@/components/widgets/dialog/DialogSummary'

  export default {
    props: [
      "randomLatLng",
      "round",
      "score",
    ],
    components: {
      DialogSummary,
    },
    data() {
      return {
        markers: [],
        map: null,
        polyline: null,
        selectedLatLng: null,
        distance: null,
        isGuessButtonClicked: false,
        isMakeGuessButtonClicked: false,
        isSelected: false,
        dialogSummary: false,
      }
    },
    methods: {
      showMap() {
        document.getElementById('map').style.transform = "translateY(-300px)"
        this.isMakeGuessButtonClicked = true
      },
      hideMap() {
        document.getElementById('map').style.transform = "translateY(300px)"
        this.isMakeGuessButtonClicked = false
      },
      selectLocation() {
        // Calculate the distance
        this.calculateDistance()

        // Show the polyline
        this.drawPolyline()

        // Put the marker on the random location
        this.putMarker(this.randomLatLng)

        // Set info window
        this.setInfoWindow()

        // Clear the event
        google.maps.event.clearListeners(this.map, 'click')

        // Disable guess button and opacity of the map
        this.isGuessButtonClicked = true
        this.isSelected = true

        // Focus on the map
        this.mouseOverMap()
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
        this.distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(this.randomLatLng, this.selectedLatLng) / 1000)
        this.$emit('calculateDistance', this.distance)
      },
      setInfoWindow() {
        var infoWindow = new google.maps.InfoWindow({
          content: '<b>' + this.distance + '</b> km away!'
        })
        infoWindow.open(this.map, this.markers[0])
      },
      drawPolyline() {
        this.polyline = new google.maps.Polyline({
          path: [this.selectedLatLng, this.randomLatLng],
          strokeColor: '#FF0000',
        })
        this.polyline.setMap(this.map)
      },
      goToNextRound() {
        // Reset
        this.selectedLatLng = null
        this.polyline.setMap(null)
        this.isGuessButtonClicked = false
        this.isSelected = false

        if (this.$viewport.width < 450) {
          // Hide the map if the player is on mobile
          this.hideMap()
        } else {
          // Set the opacity of the map again if the player is on pc
          this.mouseOutMap()
        }

        this.removeMarkers()

        // Replace the streetview with new one
        this.$emit('goToNextRound')
      },
      playAgain() {
        // Reset
        this.selectedLatLng = null
        this.polyline.setMap(null)
        this.isGuessButtonClicked = false
        this.isSelected = false
        this.dialogSummary = false

        if (this.$viewport.width < 450) {
          this.hideMap()
        } else {
          this.mouseOutMap()
        }

        // Remove markers
        this.removeMarkers()

        this.$emit('playAgain')
      },
      mouseOverMap() {
        // Focus on map
        if (this.$viewport.width > 450) {
          document.getElementById('map').style.opacity = 1.0
          document.getElementById('map').style.transform = 'scale(1)'
        }
      },
      mouseOutMap() {
        // Focus on map while the player selected a location
        // Otherwise set the opacity of the map
        if (this.isSelected == false && this.$viewport.width > 450) {
          document.getElementById('map').style.opacity = 0.7
          document.getElementById('map').style.transform = 'scale(0.75)'
        }
      }
    },
    watch: {
      randomLatLng: function(newVal, oldVal) {
        // Enable click event when a random streetview is set
        if (newVal != null) {
          const that = this
          that.map.addListener('click', (e) => {
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
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
      })
    },
  }
</script>

<style scoped>
  #make-guess-button, #guess-button, #next-button, #summary-button {
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
  }

  #make-guess-button, #guess-button {
    width: 360px;
  }

  #next-button, #summary-button {
    width: 480px;
  }

  #map {
    position: absolute;
    bottom: 60px;
    left: 10px;
    z-index: 3;
    opacity: 0.7;
    height: 320px;
    width: 480px;
    transform-origin: bottom left;
    transform: scale(0.75);
    transition: transform 0.3s;
  }

  #make-guess-button, #guess-button {
    background-color: #212121;
  }

  #guess-button:hover {
    opacity: 1.0;
  }

  #next-button, #summary-button {
    background-color: #F44336;
  }

  @media (max-width: 900px) {
    #make-guess-button, #guess-button {
      width: 300px;
    }

    #next-button, #summary-button {
      width: 375px;
    }

    #map {
      height: 265px;
      width: 400px;
    }
  }

  @media (max-width: 450px) {
    #make-guess-button, #guess-button, #next-button, #summary-button {
      bottom: -50px;
    }

    #next-button, #summary-button {
      width: 300px;
    }

    #map {
      bottom: -280px;
      height: 200px;
      width: 300px;
      opacity: 1.0;
      transition: transform 1s;
    }

    #hide-map-button {
      position: absolute;
      bottom: 210px;
      left: 300px;
      z-index: 3;
    }
  }
</style>
