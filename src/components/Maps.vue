<template>
  <div>
    <div id="map">
    </div>
    <button
      id="guess-button"
      :disabled="selectedLatLng == null || isClicked == true"
      @click="selectLocation"
      >GUESS
    </button>
  </div>
</template>

<script>
  export default {
    props: [
      "randomLatLng",
    ],
    data() {
      return {
        markers: [],
        map: null,
        selectedLatLng: null,
        isClicked: false,
      }
    },
    methods: {
      selectLocation() {
        // Show the polyline
        var polyline = new google.maps.Polyline({
          path: [this.selectedLatLng, this.randomLatLng],
          strokeColor: '#FF0000',  
        })
        polyline.setMap(this.map)

        // Put the marker on the random location
        var randomMarker = new google.maps.Marker({
          position: this.randomLatLng,
          map: this.map,
        })

        // Clear the event
        google.maps.event.clearListeners(this.map, 'click')

        // Disable guess button
        this.isClicked = true

        this.$emit('selectLocation', this.selectedLatLng)
      },
    },
    mounted() {
      const that = this
      that.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          scrollwheel: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
      })

      that.map.addListener('click', function(e) {
        // Clear the previous marker when clicking the map 
        for (var i = 0; i < that.markers.length; i++) {
          that.markers[i].setMap(null)
        }

        // Show the new marker
        var marker = new google.maps.Marker({
          position: e.latLng,
          map: that.map,
        })
        that.markers.push(marker)

        // Save latLng
        that.selectedLatLng = e.latLng
      })
    },
  }
</script>

<style scoped>
  #map {
    position: absolute;
    bottom: 60px;
    left: 10px;
    z-index: 2;
    opacity: 0.7;
    height: 240px;
    width: 360px;
  }

  #map:hover {
    opacity: 1.0;
  }

  #guess-button {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 2;
    border: none;
    border-radius: 5px;
    background-color: #212121;
    opacity: 0.8;
    color: white;
    font-size: 16px;
    text-decoration: none;
    text-align: center;
    padding: 10px 60px;
  }

  #guess-button:hover {
    opacity: 1.0;
  }
</style>
