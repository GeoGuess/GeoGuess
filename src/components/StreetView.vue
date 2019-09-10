<template>
  <div id="street-view-container">
    <div id="street-view">
      <Maps @selectLocation="calcurateDistance" />
    </div>
    <span>{{ distance }} m</span>
  </div>
</template>

<script>
  import Maps from '@/components/Maps'

  export default {
    components: {
      Maps,
    },
    data() {
      return {
        latLng: null,
        selectedLatLng: null,
        distance: null,
      }
    },
    methods: {
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
          })
          panorama.setPano(data.location.pano)
          panorama.setPov({
            heading: 270,
            pitch: 0,
          })

          // Save the location's latitude and longitude
          this.latLng = data.location.latLng
        } else {
          var service = new google.maps.StreetViewService()
          service.getPanorama({location: this.getRandomLatLng()}, this.checkStreetView)
        }
      },
      calcurateDistance(selectedLatLng) {
        this.selectedLatLng = selectedLatLng
        this.distance = google.maps.geometry.spherical.computeDistanceBetween(this.latLng, this.selectedLatLng)
      },
    },
    mounted() {
      // Generate the first streetview and check if it's valid
      const that = this
      var panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'))
      var service = new google.maps.StreetViewService()
      service.getPanorama({location: that.getRandomLatLng()}, that.checkStreetView)
    },
  }
</script>

<style scoped>
  #street-view-container {
    height: 100%; 
    width: 100%; 
    top: 0; 
    left: 0; 
    position: fixed;
  }

  #street-view {
    position: relative;
    min-height: 85%;
    width: 100%;
  }
</style>
