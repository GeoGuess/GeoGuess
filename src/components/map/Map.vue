<template>
    <div id="map">
        <GmapMap
            id="mapClassic"
            ref="mapRef"
            :center="{ lat: 37.86926, lng: -122.254811 }"
            :zoom="1"
            map-type-id="roadmap"
            :options="{
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                draggableCursor: 'crosshair',
                clickableIcons: false,
                styles: $vuetify.theme.dark ? $vuetify.theme.themes.dark.gmap : $vuetify.theme.themes.light.gmap
            }"
        />
    </div>
</template>
<script>
import { STROKE_COLORS } from '../../constants';
import MapMixin from './mixins/MapMixin';

export default {
    name: 'Map',
    mixins: [MapMixin],
    data() {
        return {
            map: null,
            marker: [],
            markers: [],
            polylines: [],
            strokeColors: STROKE_COLORS,
        };
    },
    async mounted() {
        await this.$gmapApiPromiseLazy();
        this.$refs.mapRef.$mapPromise.then((map) => {
            this.map = map;

            this.centerOnBbox();
        });
    },
    methods: {
        putMarker(position, isRandomLocation, label) {
            let info = {};
            if (isRandomLocation) {
                info = {
                    icon: {
                        url: window.location.origin + '/img/icons/favicon-16x16.png',
                        anchor: new google.maps.Point(8,8),
                    }
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
                    ': </b>' +
                    new Intl.NumberFormat(this.$i18n.locale, { style: "unit", unit:"meter" }).format(distance);
            } else {
                dataToDisplay +=
                    '<b>' +
                    this.$t('Maps.infoWindow.Distance') +
                    ': </b>' +
                    new Intl.NumberFormat(this.$i18n.locale, { style: "unit", unit:"kilometer" }).format(distance / 1000);
            }

            dataToDisplay +=
                '<br/><b>' +
                this.$t('Maps.infoWindow.Points') +
                ': </b>' +
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
            const lineSymbol = {
                path: "M 0,-1 0,1",
                strokeOpacity: 1,
                scale: 2,
            };
            const polyline = new google.maps.Polyline({
                path: [selectedLatLng, randomLatLng],
                strokeOpacity: 0,
                strokeColor: this.strokeColors[i % this.strokeColors.length],
                icons: [
                    {
                        icon: lineSymbol,
                        offset: "0",
                        repeat: "10px",
                    },
                ],
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
                this.centerOnBbox();
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
    background-color: var(--v-gmapBg-base);
}

.gm-style-iw {
  color: black;
}
</style>
