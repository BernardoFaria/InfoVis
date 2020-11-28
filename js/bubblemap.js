// Theme: Music Evolution Through Decades

// global variables
var width = 600;
var height = 400;
var padding = 60;

var innerRadius = 10;
var outerRadius = Math.min(width, height) / 2;  // goes from  the center to the border

var artists;
var mapData; 
var dispatch; 
var selectedCountry;  
var context = 0;
var svg;

// get datasets
d3.csv("dataset/artistV5.csv").then(function(data1) {
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data2) {
        artists = data1;
        mapData = data2;

        gen_bubble_map();
        prepare_event();
    })
});


/**************************
 * gen_bubble_map()
 *  -creates a bubble map
 *************************/

function gen_bubble_map() {

    // create svg
    svg = d3.select("#bubblemap")  // call id in div
                .append("svg")          // append svg to the "id" div
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + width / 2 + ",0)");

    // Map and projection
    var projection = d3.geoNaturalEarth()
                       .scale(width / 1.3 / Math.PI)
                       .translate([width / 2, height / 2]);


    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(mapData.features)
        .enter()
        .append("path")
        .attr("fill", "steelblue")
        .attr("d", d3.geoPath()
                     .projection(projection))
                     .style("stroke", "#000000");
}

function prepare_event() {
    dispatch = d3.dispatch("highlight");
      
    svg.selectAll("path").on("mouseover", function (event, d) {
        dispatch.call("highlight", this, d);
    });
  
    dispatch.on("highlight", function(country){
  
        if(selectedCountry != null) {
            selectedCountry.attr("fill", function(d) {
                return context == 0 ? "steelblue" : context == 1 ? "purple" : "red";
            });
        }
  
        selectedCountry = d3.selectAll("path").filter(function(d){
            return d.properties.id == country.properties.id;
        })
  
        selectedCountry.attr("fill", "green");
    });
}