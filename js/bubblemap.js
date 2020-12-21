// Theme: Music Evolution Through Decades

// events
import { dispatchClickMap_Bar } from "./main.js";
import { dispatchClickMap_Line } from "./main.js";
import { dispatchClickMap_Lollipop } from "./main.js";
import { dispatchClickMap_Net } from "./main.js";

import { dispatchClickNet_Map } from "./main.js";
import { dispatchClickBar_Map } from "./main.js";

// import countries
import { countries } from "./main.js";

// import tooltip
import { toolTip } from "./main.js";
import { tooltipDuration } from "./main.js";


// global variables
var width = 600;
var height = 400;
var padding = 60;

var r = 5;

var mapData;
var artists;
var svg;
var group;
var geojson;
var countryList = [];

var opacityOff = 1;
var opacityOn = 0.5;

// get map dataset
d3.json("dataset/countries-110m.json").then(function(data1) {
  d3.csv("dataset/artistV7.csv").then(function(data2) {
    mapData = data1;
    artists = data2;
    gen_bubble_map();
    addZoom();
  })
});

// update map when clicking on barchart
dispatchClickBar_Map.on("clickBar", function(artistSelected) {
  var id;

  // update map: all countries grey
  svg.selectAll(".circle-map").style("fill", "#000000");

  // loop to get the correspondent id
  for(var i = 0; i < countryList.length; i++) {
    if(countryList[i].properties.name == artistSelected.country) {
      id = countryList[i].id;
      break;
    }
  }

  // fill the selected country
  svg.select("#_" + id).attr("class", "circle-map").style("fill", "#808080");
});


// update map when clicking on network
dispatchClickNet_Map.on("clickNet", function(artistSelected) {

  // update map: all countries grey
  svg.selectAll(".circle-map").style("fill", "#000000");

  // get the artist from the artists dataset
  var artist = [];
  for(var i = 0; i < Object.keys(artists).length-1; i++) {
    if(artists[i].artist == artistSelected.artist) {
      artist.push(artists[i]);
    }
  }

  // loop to get the correspondent id
  var id;
  for(var i = 0; i < countryList.length; i++) {
    if(countryList[i].properties.name == artist[0].country) {
      id = countryList[i].id;
      break;
    }
  }

  // fill the selected country
  svg.select("#_" + id).attr("class", "circle-map").style("fill", "#808080");
});


/**************************
 * gen_bubble_map()
 *  -creates a bubble map
 *************************/

function gen_bubble_map() {

  // Map and projection
  var projection = d3.geoEquirectangular()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2]);

  // Define map path
  var path = d3.geoPath()
    .projection(projection);

  // Create svg
  svg = d3.select("#bubblemap")  // call id in div
    .append("svg")          // append svg to the "id" div
    .attr("width", width)
    .attr("height", height);

  // Our data
  geojson = topojson.feature(mapData, mapData.objects.countries).features;

  // Compute the projected centroid to get the country center coordinates
  geojson.forEach(function(d) {
    d.centroid = projection(d3.geoCentroid(d));
  });

  // Create a group to join paths and bubbles to zoom function
  group = svg.append("g");

  // Create paths
  group.selectAll(".paths-map")
    .data(geojson)
    .enter()
    .append("path")
    .attr("class", "paths-map")
    .style("opacity", opacityOn)
    .attr("d", path);

  // Get all countries from topojson
  countries.forEach(function(country) {
    var obj = getCountry(country);
    obj.properties.count = getTotalArt(obj.properties.name);
    countryList.push(obj);
  })

  function sort(array) {
    let swapped = true;
    do {
      swapped = false;
      for (let j = 0; j < array.length - 1; j++) {
        if (array[j].properties.count < array[j + 1].properties.count) {
          let temp = array[j]
          array[j] = array[j + 1];
          array[j + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);

    return array;
  }

  countryList = sort(countryList);

  // Create circles
  group.selectAll(".circle-map")
    .data(countryList)
    .enter()
    .append("circle")
    .attr("class", "circle-map")
    .attr("cx", function(d) { return d.centroid[0]; })
    .attr("cy", function(d) { return d.centroid[1]; })
    .attr("r", d => Math.sqrt(d.properties.count * 10)) //{console.log(d.properties.count)})
    .style("stroke", "gray")
    .style("opacity", 0.6)
    .attr("id", function(d, i) { return ("_" + d.id); })
    .on("mouseover", function(event, d) {
      // all countries on light grey...
      d3.selectAll(".circle-map").style("fill", opacityOff);
      // ...except the one selected
      d3.select(this).attr("class", "circle-map").style("fill", "#808080");
      // tooltip
      const[x, y] = d3.pointer(event);
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0.9)
        .style("visibility", "visible");
      var text = "Number Of Artists in " + this.__data__.properties.name + ": " + this.__data__.properties.count;
      toolTip.html(text)
        .style("left", (x + width*2) + "px")
        .style("top", (y + 50) + "px");
    })
    .on("mouseout", function(event) {
      d3.select(this).attr("class", "circle-map").style("fill", "#000000");
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      // clean entire map => all light grey
      d3.selectAll(".circle-map").style("opacity", opacityOff);
      // color selected country white
      d3.select(this).attr("class", "circle-map").style("fill", "#808080");

      dispatchClickMap_Bar.call("clickMap", this, d);
      dispatchClickMap_Line.call("clickMap", this, d);
      dispatchClickMap_Lollipop.call("clickMap", this, d);
      dispatchClickMap_Net.call("clickMap", this, d);
    });
}


/***************************************************************
 * getTotalArt()
 *  - Returns the total number of artists of a specific country
 **************************************************************/
function getTotalArt(location) {
  var count = 0;
  for(var i = 0; i < Object.keys(artists).length-1; i++) {
    if(artists[i].country == location) {
      count++;
    }
  }
  return count;
}


/***************************************************************
 * getCountry()
 *  - Returns the country object of topojson
 **************************************************************/
function getCountry(location) {
  for(var i = 0; i < Object.keys(geojson).length-1; i++) {
    if(geojson[i].properties.name == location) {
      return geojson[i];
    }
  }
}


/**************************
 * addZoom()
 *  - Adding zoom to the map
 *************************/
function addZoom() {
  svg.call(d3.zoom()
    .extent([
      [0,0],
      [1000,1000],
    ])
    .scaleExtent([1,8])
    .on("zoom", zoomed)
  );
}


/**************************
 * zoomed()
 *  - Apply zoom
 *************************/
function zoomed({ transform }) {
  svg.select("g")
    .attr("transform", transform);
}
