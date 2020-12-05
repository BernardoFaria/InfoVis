// Theme: Music Evolution Through Decades

// events
import { dispatchClickBar } from "./main.js";
import { dispatchClickMap } from "./main.js";

// global variables
var width = 600;
var height = 400;
var padding = 60;

var innerRadius = 10;
var outerRadius = Math.min(width, height) / 2;  // goes from  the center to the border

var decades;
var xAxis;
var artists;
var svg;
var dropdown;


// get decade dataset
d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV6.csv").then(function(data2) {
        decades = data1;
        artists = data2;

        gen_bar_chart();
    })
});


dispatchClickMap.on("clickMap", function(countrySelected) {

    // console.log(countrySelected);
    var filteredDataUpdate = [];
    var i,j;
    // loop on artist dataset
    for(i = 0; i < Object.keys(artists).length-1; i++) {    
        var string = artists[i].country;  // get genre string
        var res = string.split(",");    // split it by commas
        for(j = 0; j < res.length; j ++) {  // loop the splitted string
            if(res[j] == countrySelected.properties.name) { 
                filteredDataUpdate.push(artists[i]); }  // add to array 
            }
    }   
    // sort data by popularity => bigger to smaller
    filteredDataUpdate.sort(function(a, b) { return b.popularitySpotify - a.popularitySpotify; });
    // first 5 elements
    if(filteredDataUpdate.length >= 5) {
        filteredDataUpdate.splice(5, filteredDataUpdate.length);
    }
    else{
        filteredDataUpdate.splice(filteredDataUpdate.length, filteredDataUpdate.length)
    }

    // create X scale   => artists
    var xscale = d3.scaleBand()
                .domain(filteredDataUpdate.map(d => d.displayName))
                .range([padding, width - padding]);
    xscale.paddingInner(0.5);

    // create Y scale   => popularity
    var yscale = d3.scaleLinear()
            .domain([0, d3.max(filteredDataUpdate, function(d) { return +d.popularitySpotify; })]) 
            .range([height - padding, padding]); 


    svg.selectAll("rect")
       .data(filteredDataUpdate)
       .join("rect")
       .transition()
       .duration(1000)
       .attr("width", xscale.bandwidth())
       .attr("height", function(d, i) { return (height - padding - yscale(filteredDataUpdate[i].popularitySpotify)); })
       .attr("fill", "steelblue")
       .attr("x", function(d, i) { return xscale(filteredDataUpdate[i].displayName); })
       .attr("y", function(d, i) { return yscale(filteredDataUpdate[i].popularitySpotify); });
        
    xAxis.transition()
         .duration(1000)
         .call(d3.axisBottom(xscale));
        
});

/**************************
 * gen_bar_chart()
 *  -creates a bar chart
 *************************/
function gen_bar_chart() {

    // dropdown = d3.select("#selectbutton").select("#mySelect");
    // dropdown.on("change", function(){
    //     var selected = this.value;
    //     updateBarPlot(selected);
    // });

    // filtering data
    var filteredData = [];
    var i,j;
    // loop on artist dataset
    for(i = 0; i < Object.keys(artists).length-1; i++) {    
        var string = artists[i].genre;  // get genre string
        var res = string.split(",");    // split it by commas
        for(j = 0; j < res.length; j ++) {  // loop the splitted string
            if(res[j] == "Pop") { 
                filteredData.push(artists[i]); }  // add to array 
            }
    }   
    // sort data by popularity => bigger to smaller
    filteredData.sort(function(a, b) { return b.popularitySpotify - a.popularitySpotify; });
    // first 5 elements
    filteredData.splice(5, filteredData.length);

    // create X scale   => artists
    var xScale = d3.scaleBand()
                   .domain(filteredData.map(d => d.displayName))
                   .range([padding, width - padding]);
    xScale.paddingInner(0.5);


    // create Y scale   => popularity
    var yScale = d3.scaleLinear()
              .domain([0, d3.max(filteredData, function(d) { return +d.popularitySpotify; })]) 
              .range([height - padding, padding]); 


    // create svg
    svg = d3.select("#barchart")  // call id in div
                .append("svg")          // append svg to the "id" div
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + width + "," + (-height) +")");   // move svg to the right

    svg.append("text")
           .attr("x", (width / 2))             
           .attr("y", height / 7 )
           .attr("class", "title")  // para posterior CSS (se houver tempo eheh)
           .attr("text-anchor", "middle")  
           .style("font-size", "20px") 
           .style("text-decoration", "underline")  
           .text("Most Popular Bands");

    // x Axis
    xAxis = svg.append("g")
               .attr("transform", "translate(0," + (height - padding) + ")")
               .call(d3.axisBottom(xScale));

    svg.append("text")
        .attr("transform", "translate(" + width/2.6 + "," + (height -padding / 3) + ")")
        .text("Top Artists");

    
    // y Axis
    var yAxis = d3.axisLeft()
                    .scale(yScale);

    svg.append("g")
           .attr("transform", "translate(" + padding + ",0)")
           .call(yAxis);

    svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 0)
           .attr("x", 0 - height / 1.5)
           .attr("font-size", "16px")
           .attr("dy", "1em")
           .text("Popularity");

    // create bars
    svg.selectAll("rect")
       .data(filteredData)
       .join("rect")
       .attr("width", xScale.bandwidth())
       .attr("height", d => (height - padding - yScale(d.popularitySpotify)))
       .attr("fill", "steelblue")
       .attr("x", function(d,i) { return xScale(d.displayName); })
       .attr("y", function(d,i) { return yScale(d.popularitySpotify); })
       .on("mouseover", function(event) {
            // all bars on blue...
            d3.selectAll("rect").attr("fill", "steelblue");
            // ...except the one selected
            d3.select(this).attr("fill", "green");
        })
        .on("mouseout", function(event) {
        //     d3.selectAll("rect").attr("fill", "steelblue");
        })
        .on("click", function(event, d) {
            // clean all bars => all blue
            if(d3.select(this) != null) {
                d3.select(this).attr("fill", "steelblue");
            }
            // color selected bar
            d3.select(this).attr("fill", "red");
            
            dispatchClickBar.call("clickBar", this, d);
        });
}
