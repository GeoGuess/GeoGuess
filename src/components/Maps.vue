<template>
  <div id="container-map" 
      :class="[(($viewport.width >= 450 && (activeMap|| pinActive)) || isMakeGuessButtonClicked) ? 'container-map--active': '', `container-map--size-${size}`]"
      @mouseover="activeMap = true"
      @mouseleave="activeMap = false"
    >
    <div class="container-map_controls">
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
    <v-btn
      id="hide-map-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && isMakeGuessButtonClicked"
      fab
      x-small
      color="red"
      @click="hideMap">
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
    <div 
      id="map">
    </div>
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
        distance: null,
        isGuessButtonClicked: false,
        isMakeGuessButtonClicked: false,
        isSelected: false,
        dialogSummary: false,
        activeMap: false,
        size: 2,
        pinActive: false,
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

<style scoped lang="scss">
  #container-map{
    position: absolute;
    bottom: 80px;
    left: 10px;
    z-index: 3;
    opacity: 0.7;
    width: var(--width);
    height: var(--height);
    transform-origin: bottom left;
    transition: transform 0.3s;
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
        float: right;
        background-color: rgba(33,33,33);
        button {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0 0.5rem;
        }
        padding: 0.2rem;
    }
  }

  
  #make-guess-button, #guess-button, #next-button, #summary-button {
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
    width: 100%;
  }

  #next-button, #summary-button {
    width: 100%;
  }


  #map{
    width: 100%;
    height: 100%;
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
        height: 50vh;

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
