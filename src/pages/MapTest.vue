<template>
    <div>
        <div v-if="polygonSelect">
            <FlagIcon :isoName="polygonSelect.getFeatureById('feature').getProperty('iso_a2')"          />
            {{ polygonSelect.getFeatureById('feature').getProperty('name') }}
        </div>
        <div
            id="map"
            :style="'width:' + ($viewport.width - 100) + 'px ; height: 400px'"
        ></div>
    </div>
</template>

<script type="text/javascript">
import json from '../resources/countries.geo.json';
import FlagIcon from '@/components/shared/FlagIcon';

const google = window.google;
export default {
    components: {
        FlagIcon,
    },
    data() {
        return {
            map: null,
            polygonSelect: null,
        };
    },
    mounted() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 37.86926, lng: -122.254811 },
            zoom: 1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        });
        json.features.forEach((c) => {
            if (Array.isArray(c.geometry.coordinates)) {
                const p = new google.maps.Data({
                    style: {
                        strokeOpacity: 0,
                        fillOpacity: 0,
                        strokeColor: '#FF0000',
                        strokeWeight: 2,
                        fillColor: '#FF9900',
                    },
                });
                c.id = 'feature';
                p.addGeoJson(c);

                p.setMap(this.map);
                p.addListener('click', () => {
                    if (this.polygonSelect) {
                        this.polygonSelect.setStyle({
                            strokeOpacity: 0,
                            fillOpacity: 0,
                        });
                    }
                    if (Object.is(p, this.polygonSelect)) {
                        this.polygonSelect = null;
                    } else {
                        p.setStyle({
                            strokeOpacity: 0.9,
                            fillOpacity: 0.8,
                        });

                        this.polygonSelect = p;
                    }
                });
            }
        });
    },
};
</script>
