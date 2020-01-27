<template>
  <div id="app-map">
    <div id="controls">
        <div>
          <button @click="deleteMarkers">Delete Markers</button>
        </div>
        <div>
          <button @click="addRandomMarkers">Add Random Markers</button>
          <input v-model="numRandomMarkers">
        </div>
    </div>
    <div id="map">
      <l-map :zoom="zoom" :center="center" @click="onMapClick" >
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker
            v-for="(marker, index) in markers"
            :key="marker.id"
            :visible="marker.visible"
            :draggable="marker.draggable"
            :lat-lng="marker.position"
            @click="onMarkerClick(index)"
        />
      </l-map>
    </div>
  </div>
</template>

<script>
var { LMap, LTileLayer, LMarker, LPolygon } = Vue2Leaflet;

// https://stackoverflow.com/a/36481059/417133
// Standard Normal variate using Box-Muller transform.
function randn_bm() {
  var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default {
    components: {
        LMap,
        LTileLayer,
        LMarker
    },
    data() {
        return {
            numRandomMarkers: 100,
            zoom: 13,
            center: L.latLng(47.413220, 16.219482),
            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            markers: [],
        }
    },
    beforeCreate: function() {},
    methods: {
        onMapClick: function(event) {
            this.addMarker(event.latlng);
        },
        onMarkerClick: function(index) {
            this.removeMarker(index);
        },
        addMarker: function(obj) {
            let newMarker = {
                id: null,
                position: {lat: obj.lat, lng: obj.lng},
                draggable: false,
                visible: true,
            };
            this.markers.push(newMarker);
        },
        removeMarker: function(index) {
            this.markers.splice(index, 1);
        },
        deleteMarkers: function() {
            this.markers = [];
        },
        addRandomMarkers: function() {
            for (let i = 0; i < this.numRandomMarkers; i++) {
                let pos = {
                    lat: 47 + randn_bm(),
                    lng: 16 + randn_bm(),
                }
                this.addMarker(pos);
            }
        }
    }
};
</script>

<style scoped>
#app-map {
  height: 100%;
  width: 100%;
}

#controls {
  margin-bottom: 2em;
}

#map {
  height: 50%;
  /* width: 100%; */
}
</style>