export const MapMixin = {
   
    props: ['bbox'],
    watch: {
        bbox() {
            this.centerOnBbox();
        },
    },
    methods: {
        centerOnBbox() {
            if (this.map) {
                if (this.bbox) {
                    this.map.fitBounds({
                        east: this.bbox[2],
                        north: this.bbox[3],
                        south: this.bbox[1],
                        west: this.bbox[0],
                    });
                } else {
                    this.map.setZoom(0);
                    this.map.setCenter({lat: 0, lng: 0});
                }
            }
        },        
        drawPolyline() {},
        removePolylines() {},
    }
};

export default MapMixin;
