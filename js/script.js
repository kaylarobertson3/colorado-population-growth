// add base map tiles
var layer = new L.StamenTileLayer('terrain');

var map = new L.Map('map').fitBounds([
    [35, -108],
    [42, -103.010]
]);
map.addLayer(layer);

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<h4>Projected population change 2015 - 2025</h4>' +  (props ?
    '<p><b></p>' + props.name + '</b><br />' + props.Workbook1_percentPpopulationChange + ' percent change'
    : '<p>Hover over a county</hp>');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
  return d > 50 ? '#800026' :
      d > 33  ? '#BD0026' :
      d > 23  ? '#E31A1C' :
      d > 13  ? '#FC4E2A' :
      d > 6   ? '#FD8D3C' :
      d > .1   ? '#FEB24C' :
      d > -.5   ? '#FED976' :
      d > -1.1   ? '#FED976' :
      d > -2   ? '#FED976' :
      d > -2.9   ? '#FED976' :


            '#FFEDA0';
}


function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.Workbook1_percentPpopulationChange)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
}

geojson = L.geoJson(countiesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('');

// legend that won't work !!!!!!
var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [-2.9, -2, -1.1, -.5, .1, 6, 13, 23, 33, 50],
    labels = ['<h4>Legend</h4>'],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? ' &ndash;  ' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);
