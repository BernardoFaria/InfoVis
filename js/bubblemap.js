// Theme: Music Evolution Through Decades

// global variables
var width = 600;
var height = 400;
var padding = 60;

var innerRadius = 10;
var outerRadius = Math.min(width, height) / 2;  // goes from  the center to the border

var mapData; 
var dispatch; 
var selectedCountry;  
var context = 0;
var svg;

// get datasets
// d3.json("https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json").then(function(data) {
d3.json("dataset/countries-110m.json").then(function(data) {
    mapData = data;

    gen_bubble_map();
    addZoom();
    prepare_event();
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
       .attr("fill", "steelblue")
       .attr("d", path)
       .attr("id", function(d, i) { return d.properties.name; });
    
    // svg.select("path#Portugal").style("fill", "red");

    // //Bind data and create one path per GeoJSON feature ; draw a path for each feature/country
    // var countriesGroup = svg.append("g")
    //                         .attr("id", "map")
    //                         .selectAll("path")
    //                         .data(mapData.features)
    //                         .enter()
    //                         .append("path")
    //                         .attr("fill", "steelblue")
    //                         .style("stroke", "#000000")
    //                         .attr("d", path)
    //                         .attr("id", function(d, i) {
    //                             console.log(d.properties.iso_a3)
    //                             return "country" + d.properties.iso_a3;
    //                         })
    //                         // add a mouseover action to show name label for feature/country
    //                         .on("mouseover", function(d, i) {
    //                             d3.select(d.properties.iso_a3).style("display", "block");
    //                         })
    //                         .on("mouseout", function(d, i) {
    //                             d3.select(d.properties.iso_a3).style("display", "none");
    //                         });



}

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



function prepare_event() {

    dispatch = d3.dispatch("highlight");
      
    svg.selectAll("path")
       .on("mouseover", function (event, d, i) {
           console.log(d);
            dispatch.call("highlight", this, d);
    });

    dispatch.on("highlight", function(country){

  
        if(selectedCountry != null) {
            selectedCountry.attr("fill", "steelblue");
            // selectedCountry.attr("fill", function(d) {
                // return "steelblue";
                // return context == 0 ? "steelblue" : context == 1 ? "purple" : "red";
            // });
        }

        selectedCountry = svg.selectAll("path").filter(function(d, i){
            return d.properties.name == country.properties.name;
        })
  
        selectedCountry.attr("fill", "green");
    });
}