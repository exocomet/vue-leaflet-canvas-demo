
<template>
  <div id="app-canvas">
    <div id="map-canvas" ref="mapElement"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import MockLatLng from 'mock-latlng';

export default {
    components: {},
    data() {return {}},
    mounted() {
        var canvasRenderer = L.canvas();
        var mymap = L.map(this.$refs['mapElement'], {
            renderer: canvasRenderer,
            // preferCanvas: true,
        });
        let mapCenter = {lat: 48.19, lng: 16.3};
        mymap.setView(mapCenter, 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mymap);;

        let points = MockLatLng.random_coordinates(1000, mapCenter);
        points.forEach(function (pos, index) {
            L.circleMarker(pos, {
                renderer: canvasRenderer
            }).addTo(mymap).bindPopup('marker ' + JSON.stringify(pos));
        });
    },
}
</script>

<style scoped>
#app-canvas {
  height: 40%;
  width: 100%;
}

#map-canvas {
  height: 100%;
}
</style>