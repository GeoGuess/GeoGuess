<template>
    <div id="mapNormal"></div>
</template>
<script>
const google = window.google;

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
    mounted() {
        this.map = new google.maps.Map(document.getElementById('mapNormal'), {
            center: { lat: 37.86926, lng: -122.254811 },
            zoom: 1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        });

        if (this.bbox) {
            this.map.fitBounds({
                east: this.bbox[2],
                north: this.bbox[3],
                south: this.bbox[1],
                west: this.bbox[0],
            });
        }
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
            var marker = new google.maps.Marker({
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
            var polyline = new google.maps.Polyline({
                path: [selectedLatLng, randomLatLng],
                strokeColor: this.strokeColors[i % this.strokeColors.length],
            });
            polyline.setMap(this.map);
            this.polylines.push(polyline);
        },
        removePolylines() {
            for (var i = 0; i < this.polylines.length; i++) {
                this.polylines[i].setMap(null);
            }
        },
        startNextRound() {
            this.map.addListener('click', (e) => {
                // Clear the previous marker when clicking the map
                this.removeMarkers();

                // Show the new marker
                this.putMarker(e.latLng);

                // Save latLng
                this.$emit('setSeletedPos', e.latLng);
            });
        },
        removeListener() {
            google.maps.event.clearListeners(this.map, 'click');
        },
    },
};
</script>
