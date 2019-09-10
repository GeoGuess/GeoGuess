<template>
  <div>
    <div id="map">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedLatLng: null,
      }
    },
    methods: {
      selectLocation() {
        this.$emit('selectLocation', this.selectedLatLng)
      },
    },
    mounted() {
      const that = this
      var markers = []
      var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          scrollwheel: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
      })

      map.addListener('click', function(e) {
        // Clear the previous marker when clicking the map 
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null)
        }

        // Show the new marker
        var marker = new google.maps.Marker({
          position: e.latLng,
          map: map,
        })
        markers.push(marker)

        // Save latLng
        that.selectedLatLng = e.latLng
        that.selectLocation()
      })
    },
  }
</script>

<style scoped>
  #map {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 2;
    opacity: 0.7;
    height: 240px;
    width: 360px;
  }

  #map:hover {
    opacity: 1.0;
  }
</style>
