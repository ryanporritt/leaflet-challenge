
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    19.767603, -47.973521
  ],
  zoom: 3,
});
  
// Define streetmap and darkmap layers
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
}).addTo(myMap);

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");

  return div;
};

// Adding legend to the map
legend.addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMarker(data.features);
});

function createMarker(earthquakeData) {

  console.log(earthquakeData);

  var earthquakeCountZero = 0;
  var earthquakeCountOne = 0;
  var earthquakeCountTwo = 0;
  var earthquakeCountThree = 0;
  var earthquakeCountFour = 0;
  var earthquakeCountFive = 0;

  earthquakeData.forEach((feature) => {

    var location = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]; 

    var earthquakeColor = "";

    if (feature.properties.mag < 1.0) {
      earthquakeolor = "#00ec86";
      earthquakeCountZero += 1;
    }
    else if (feature.properties.mag > .99 & feature.properties.mag < 2.0) {
      earthquakeColor = "#ecec2a";
      earthquakeCountOne += 1;
    }
    else if (feature.properties.mag > 1.99 & feature.properties.mag < 3.0) {
      earthquakeColor = "#ffbe13";
      earthquakeCountTwo += 1;
    }
    else if (feature.properties.mag > 2.99 & feature.properties.mag < 4.0) {
      earthquakeColor = "#ff9600";
      earthquakeCountThree += 1;
    }
    else if (feature.properties.mag > 3.99 & feature.properties.mag < 5.0) {
      earthquakeColor = "#ff4e00";
      earthquakeCountFour += 1;
    }
    else {
      earthquakeColor = "#ff0000";
      earthquakeCountFive += 1;
    }

    // Add circles to map
    L.circle(location, {
    fillOpacity: 0.80,
    color: "grey",
    weight: 1,
    fillColor: earthquakeColor,
    // Adjust radius
    radius: feature.properties.mag * 30000
    }).bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p>Magnitude : " + feature.properties.mag + "</p>").addTo(myMap);


  })

  // Update the legend's innerHTML with the last updated time and station count
  document.querySelector(".legend").innerHTML = [
    // "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    // "<h3>Earthquake Scale</h3>",
    //"<li style=\"background-color: #00ec86 \"></li>" + "<div class='zero'> 0-1 : " + earthquakeCountZero + "</div>",
    "<li style=\"background-color: #00ec86 \"> 0-1 : " + earthquakeCountZero + "</li><p></p>",
    "<li style=\"background-color: #ecec2a \"> 1-2 : " + earthquakeCountOne + "</li><p></p>",
    "<li style=\"background-color: #ffbe13 \"> 2-3 : " + earthquakeCountTwo + "</li><p></p>",
    "<li style=\"background-color: #ff9600 \"> 3-4 : " + earthquakeCountThree + "</li><p></p>",
    "<li style=\"background-color: #ff4e00 \"> 4-5 : " + earthquakeCountFour + "</li><p></p>",
    "<li style=\"background-color: #ff0000 \"> 5 + : " + earthquakeCountFive + "</li><p></p>",
  ].join("");
  
};



// Store our API endpoint inside faultLine sUrl
var faultLinesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the faultLines Url
d3.json(faultLinesUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFaultLines(data.features);
});

function createFaultLines(faultLineData) {
  
    faultLineData.forEach((feature) => {
      var fault = feature.geometry.coordinates;
      fault.forEach((array) => {
        var temp = array[0];
        array[0] = array[1];
        array[1] = temp;
      })
    
      var line = [fault];
      L.polyline(line, {
        color: "orange",
        weight: 2
      }).addTo(myMap);
    })
}
