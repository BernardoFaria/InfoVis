// Theme: Music Evolution Through Decades

import { dispatchClickBar } from "./main.js";

// global variables
var width = 600;
var height = 400;
var padding = 60;

var innerRadius = 10;
var outerRadius = Math.min(width, height) / 2;  // goes from  the center to the border

var mapData; 
var svg;

// get map dataset
d3.json("dataset/countries-110m.json").then(function(data) {
    mapData = data;

    gen_bubble_map();
    addZoom();
});


// Adding zoom to the map
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

// Applying the zoom
function zoomed({ transform }) {
    svg.selectAll("path")
       .attr("transform", transform);
}

//FIXME: mudar o nome do event
dispatchClickBar.on("clickBar", function(event) {
    
    var id;
    var jData = topojson.feature(mapData, mapData.objects.countries).features;
    
    // update map: all countries blue
    svg.selectAll(".paths-map").style("fill", "steelblue");

    // loop to get the correspondent id 
    for(var i = 0; i < jData.length; i++) {
        if(jData[i].properties.name == event.country) {
            id = jData[i].id;
            break;
        }
    }

    // fill the selected country
    svg.select("#_" + id).style("fill", "red");
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

    // create svg
    svg = d3.select("#bubblemap")  // call id in div
            .append("svg")          // append svg to the "id" div
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + (width*2) + "," + (-60 -  height) +")");

    svg.selectAll("path")
       .data(topojson.feature(mapData, mapData.objects.countries).features)
       .enter()
       .append("path")
       .attr("class", "paths-map")
       .attr("d", path)
       .attr("id", function(d, i) { return ("_" + d.id); })
       .on("mouseover", function(event) {
            // all countries on blue...
            d3.selectAll(".paths-map").style("fill", "steelblue");
            // ...except the one selected
            d3.select(this).style("fill", "green");
        })
        .on("mouseout", function(event) {
            //TODO: escolher se metemos ou não
            // d3.select(this).attr("fill", "steelblue");
        });
}
