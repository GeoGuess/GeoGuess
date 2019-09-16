<template>
  <div>
    <div 
      id="map"
      @mouseover="mouseOverMap" 
      @mouseleave="mouseOutMap">
    </div>
    <button
      id="guess-button"
      :disabled="selectedLatLng == null || isClicked == true"
      v-if="isClicked == false"
      @click="selectLocation"
      >GUESS
    </button>
    <button
      id="next-button"
      v-if="isClicked == true && round < 5"
      @click="goToNextRound"
      >NEXT ROUND
    </button>
    <button
      id="summary-button"
      v-if="isClicked == true && round >= 5"
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
  import DialogSummary from '@/components/DialogSummary'

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
        isClicked: false,
        isSelected: false,
        dialogSummary: false,
      }
    },
    methods: {
      selectLocation() {
        // Show the polyline
        this.drawPolyline()

        // Put the marker on the random location
        this.putMarker(this.randomLatLng)

        // Clear the event
        google.maps.event.clearListeners(this.map, 'click')

        // Disable guess button and opacity of the map
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
        this.isClicked = false
        this.isSelected = false

        this.removeMarkers()

        // Set the opacity of the map again
        this.mouseOutMap()

        // Replace the streetview with new one
        this.$emit('goToNextRound')
      },
      playAgain() {
        // Reset
        this.selectedLatLng = null
        this.polyline.setMap(null)
        this.isClicked = false
        this.isSelected = false
        this.dialogSummary = false

        // Remove markers
        this.removeMarkers()

        this.$emit('playAgain')
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
      }
    },
    watch: {
      randomLatLng: function(newVal, oldVal) {
        // Enable click event when a random streetview is set
        if (newVal != null) {
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
