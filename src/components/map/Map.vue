<template>
    <div id="map">
        <GmapMap
            :center="{ lat: 37.86926, lng: -122.254811 }"
            :zoom="1"
            ref="mapRef"
            id="mapClassic"
            map-type-id="roadmap"
            :options="{
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
            }"
        >
        </GmapMap>
    </div>
</template>
<script>
export default {
    name: 'Map',
    props: ['bbox'],
    data() {
        return {
            map: null,
            marker: [],
            markers: [],
            polylines: [],
            strokeColors: [
                '#F44336',
                '#76FF03',
                '#FFEB3B',
                '#FF4081',
                '#18FFFF',
            ],
        };
    },
    watch: {
        bbox() {
            this.centerOnBbox();
        },
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        this.$refs.mapRef.$mapPromise.then((map) => {
            this.map = map;

            this.centerOnBbox();
        });
    },
    methods: {
        centerOnBbox() {
            if (this.map && this.bbox) {
                this.map.fitBounds({
                    east: this.bbox[2],
                    north: this.bbox[3],
                    south: this.bbox[1],
                    west: this.bbox[0],
                });
            }
        },
        putMarker(position, isRandomLocation, label) {
            let info = {};
            if (isRandomLocation) {
                info = {
                    icon:
                        window.location.origin + '/img/icons/favicon-16x16.png',
                };
            }
            if (label) {
                info = {
                    label,
                };
            }
            const marker = new google.maps.Marker({
                ...info,
                position: position,
                map: this.map,
            });
            this.markers.push(marker);
        },
        removeMarkers() {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers = [];
        },
        setInfoWindow(playerName, distance, points, endGame = false) {
            let dataToDisplay = '';
            if (playerName !== null)
                dataToDisplay += '<b>' + playerName + '</b>' + ' : <br/>';

            if (distance < 1000) {
                dataToDisplay +=
                    '<b>' +
                    this.$t('Maps.infoWindow.Distance') +
                    ' : </b>' +
                    distance +
                    ' m';
            } else {
                dataToDisplay +=
                    '<b>' +
                    this.$t('Maps.infoWindow.Distance') +
                    ' : </b>' +
                    distance / 1000 +
                    ' km';
            }

            dataToDisplay +=
                '<br/><b>' +
                this.$t('Maps.infoWindow.Points') +
                ' : </b>' +
                points;

            const infoWindow = new google.maps.InfoWindow({
                content: dataToDisplay,
            });
            infoWindow.open(
                this.map,
                this.markers[
                    playerName || endGame ? this.markers.length - 1 : 0
                ]
            );
        },
        drawPolyline(selectedLatLng, i = 0, randomLatLng) {
            const polyline = new google.maps.Polyline({
                path: [selectedLatLng, randomLatLng],
                strokeColor: this.strokeColors[i % this.strokeColors.length],
            });
            polyline.setMap(this.map);
            this.polylines.push(polyline);
        },
        removePolylines() {
            for (let i = 0; i < this.polylines.length; i++) {
                this.polylines[i].setMap(null);
            }
        },
        startNextRound() {
            this.$refs.mapRef.$mapPromise.then(() => {
                this.map.addListener('click', (e) => {
                    // Clear the previous marker when clicking the map
                    this.removeMarkers();

                    // Show the new marker
                    this.putMarker(e.latLng);

                    // Save latLng
                    this.$emit('setSeletedPos', e.latLng);
                });
            });
        },
        removeListener() {
            google.maps.event.clearListeners(this.map, 'click');
        },
        fitBounds() {
            const bounds = new google.maps.LatLngBounds();

            for (let i = 0; i < this.markers.length; i++) {
                if (this.markers[i].getVisible()) {
                    bounds.extend(this.markers[i].getPosition());
                }
            }

            this.map.fitBounds(bounds);
        },
    },
};
</script>
<style lang="scss" scoped>
#mapClassic {
    width: 100%;
    height: 100%;
}
</style>
