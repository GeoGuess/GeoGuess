<template>
  <div id="game-page">
    <div id="street-view-container">
      
        <HeaderGame 
          :score="score"
          :round="round" />
      <div id="game-interface">
        <div id="street-view">
        </div>
        <div id="game-interface--overlay">
        <Maps
          :randomLatLng="randomLatLng"
          :round="round"
          :score="score"
          @resetLocation="resetLocation"
          @calculateDistance="updateScore"
          @goToNextRound="goToNextRound"
          @playAgain="playAgain" />
        </div>
      </div>
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="2"/>
      
    <v-alert type="warning" dismissible class="warning-alert" v-model="isVisibleDialog" tile>
     <b>Nearby Position</b> : Unfortunately, we were unable to find a random position in the defined location. However, we have found one nearby 😉
    </v-alert>
  </div>
</template>

<script>
  import HeaderGame from '@/components/HeaderGame'
  import Maps from '@/components/Maps'
  
  import randomPointsOnPolygon from 'random-points-on-polygon'
  import axios from 'axios'
  import * as turfModel from '@turf/helpers'
  import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
  import biggestCities from '../data/biggestCities.json'
  import getRandomInt from '../utils/functions'

  export default {
    components: {
      HeaderGame,
      Maps,
    },
    props: ["place"],
    data() {
      return {
        placeGeoJson: null,
        randomLatLng: null,
        score: 0,
        round: 1,
        overlay: false,
        cptNotFoundLocation: 0,
        isVisibleDialog: false,
        mode: 1
      }
    },
    methods: {
      getPlaceGeoJSON(place) {
          axios.get(`https://nominatim.openstreetmap.org/search/${encodeURIComponent(place)}?format=geojson&limit=1&polygon_geojson=1`)
          .then((res) => {
            if(res && res.status === 200 && res.data.features.length > 0){
              this.placeGeoJson = res.data.features[0];

              this.loadStreetView()
            }
          }).catch((e) => { console.err(e) })
      },
      loadStreetView() {
        var service = new google.maps.StreetViewService()
        service.getPanorama({
          location: this.getRandomLatLng(),
          preference: 'nearest',
          radius: 100000,
          source: 'outdoor',
        }, this.checkStreetView)
        
      },
      getRandomLatLng() {
        if(this.placeGeoJson != null){
          let point = randomPointsOnPolygon(1, this.placeGeoJson)[0];
          return new google.maps.LatLng(point.geometry.coordinates[1], point.geometry.coordinates[0]);
        }
          
        // Generate a random latitude and longitude
        let lat = (Math.random() * 170) - 85;
        let lng = (Math.random() * 360) - 180;
        
        return new google.maps.LatLng(lat, lng);
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
          
          if(this.placeGeoJson != null && this.cptNotFoundLocation < 3 && !booleanPointInPolygon(turfModel.point([data.location.latLng.lng(), data.location.latLng.lat()]), this.placeGeoJson)){
            this.loadStreetView()
            this.cptNotFoundLocation++;
          }else{
            if(this.placeGeoJson != null && !booleanPointInPolygon(turfModel.point([data.location.latLng.lng(), data.location.latLng.lat()]), this.placeGeoJson)) {
              this.isVisibleDialog = true;
            }
            // Save the location's latitude and longitude
            this.randomLatLng = data.location.latLng
            this.cptNotFoundLocation = 0;
          }
        } else {
          this.loadStreetView()
        }
      },
      resetLocation(){
        var service = new google.maps.StreetViewService()
        service.getPanorama({
          location: this.randomLatLng,
          preference: 'nearest',
          radius: 100000,
          source: 'outdoor',
        }, this.checkStreetView)
      },
      updateScore(distance) {
        this.score += distance
        this.overlay = true
      },
      goToNextRound() {
        // Reset
        this.randomLatLng = null
        this.overlay = false
        this.isVisibleDialog = false

        // Update the round
        this.round += 1

        
        if (this.mode ==1){
          let city = biggestCities[getRandomInt(biggestCities.length)];
          this.getPlaceGeoJSON(city.City+','+city.Country);
        }

        // Replace streetview with new one
        this.loadStreetView()
      },
      playAgain() {
        // Reset
        this.randomLatLng = null
        this.distance = null
        this.score = 0
        this.round = 1
        this.overlay = false

        if (this.mode ==1){
          let city = biggestCities[getRandomInt(biggestCities.length)];
          this.getPlaceGeoJSON(city.City+','+city.Country);
        }

        // Load streetview
        this.loadStreetView()
      }
    },
    mounted() {
      if (this.mode ==1){
        let city = biggestCities[getRandomInt(biggestCities.length)];
        this.getPlaceGeoJSON(city.City+','+city.Country);
      }else if(this.place != undefined && this.place != ''){
        this.getPlaceGeoJSON(this.place);
      }else{
        this.loadStreetView()
      }
    },
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
  #game-interface{
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

  .warning-alert{
    z-index: 1;
    margin-top: 56px;
  }

  @media (max-width: 450px) {
    #street-view {
      position: fixed;
      min-height: 100%;
      height: 92%;
    }

  }

</style>
