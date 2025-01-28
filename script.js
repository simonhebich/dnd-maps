/*/ Layers /*/
// OSM
// var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
var osm = L.tileLayer('https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  maxZoom: 19
});

// Landcover WMS
options = {
  layers: 'clc5',
  transparent: true,
  format: 'image/png',
  opacity: 0.2
  //bbox: [290735, 5629103, 356803, 5646677].join(',')
}
var osm_nolabel = L.tileLayer('https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  maxZoom: 19
});
const wms = L.tileLayer.wms('https://sgx.geodatenzentrum.de/wms_clc5_2018', options);
const wms_map = L.layerGroup([osm_nolabel, wms])

const baseLayers = {
  "Open Street Map": osm,
  "Landcover": wms_map
}


// Overlays

// defining LayerGroups
const layers = {
  autobahn: L.layerGroup(),
  potentiell: L.layerGroup()
}

// GeoJsons
const geoJsons = [
  { url: './data/a4_map.json', layer: layers.autobahn, style: { color: '#2a3384', weight: 1, fillOpacity: 0 }},
  { url: './data/potentiell.json', layer: layers.potentiell, style: function(feature) {
        switch (feature.properties.potenzielle_flaeche) {
            case 0.0: return {color: "#d87b17", weight: 3, fillOpacity: 0.9};
            case 1.0: return {color: "#1c6b0a", weight: 3, fillOpacity: 0.9};
        }}
  }
];

geoJsons.forEach(({ url, layer, style }) => {
  fetch(url)
    .then(res => res.json())
    .then(data => L.geoJSON(data, { style }).addTo(layer))
    .catch(err => console.error(`Error loading ${url}`, err));
});

const overlayLayers = {
  "Autobahn 4": layers.autobahn,
  "Potential PV Regions": layers.potentiell
}

const map = L.map('map', { 
  center: [50.83478, 6.38052], 
  zoom: 13,
  scrollWheelZoom: false, // disable original zoom function
  smoothWheelZoom: true,  // enable smooth zoom 
  smoothSensitivity: 3,   // zoom speed. default is 1
  layers: [osm, layers.autobahn]
});


// Layer control
L.control.layers(baseLayers, overlayLayers, {collapsed: false}).addTo(map);
