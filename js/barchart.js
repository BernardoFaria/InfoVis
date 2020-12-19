// Theme: Music Evolution Through Decades

// import colors from main
import { genreColor } from "./main.js";

// import tooltip
import { toolTip } from "./main.js";

// events
import { dispatchClickBar_Line } from "./main.js";
import { dispatchClickBar_Map } from "./main.js";
import { dispatchClickBar_Lollipop } from "./main.js";
import { dispatchClickMap_Bar } from "./main.js";
import { dispatchClickLine_Bar } from "./main.js";

// global variables
var width = 600;
var height = 400;
var padding = 60;

var decades;
var xAxis;
var yAxis;
var artists;
var svg;
var dropdown;

var opacityOn = 0.2;    // when mouseover, other bar's opacity lows down
var opacityOff = 1;     // when mouseover, THIS bar's opacity gets higher
var opacityNormal = 0.5;  // when mouseout, all bars return to normal


// get decade dataset
d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV7.csv").then(function(data2) {
        decades = data1;
        artists = data2;
        gen_bar_chart();
        // reset_button();
    })
});


// update barchart when clicking on map
dispatchClickMap_Bar.on("clickMap", function(countrySelected) {

    svg.selectAll("rect").attr("class", "bars-style").remove();

    var filteredDataUpdate = [];
    var i,j;
    // loop on artist dataset
    for(i = 0; i < Object.keys(artists).length-1; i++) {    
        var string = artists[i].country; 
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
    console.log(d3.max(filteredDataUpdate, function(d) { return +d.popularitySpotify; }));


    svg.selectAll("rect")
       .attr("class", "bars-style")
       .data(filteredDataUpdate)
       .join("rect")
       .attr("class", "bars-style")
       .attr("opacity", opacityNormal)
       .attr("height", 0)            //setting height 0 for the transition effect
       .attr("width", xscale.bandwidth())
       .attr("x", function(d, i) { return xscale(filteredDataUpdate[i].displayName); })
       .attr("y", height - padding)  //setting y at the bottom for the transition effect
       .on("mouseover", function(event) {
            // all bars on grey...
            d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
            // ...except the one selected
            d3.select(this).style("opacity", opacityOff);
        })
        .on("mouseout", function(event) {
            d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
        })
        .on("click", function(event, d) {
            // clean all bars => all grey
            if(d3.select(this) != null) {
                d3.select(this).style("opacity", opacityNormal);
            }
            // color selected bar
            d3.select(this).attr("opacity", opacityOff);
            
            dispatchClickBar_Map.call("clickBar", this, d);
            dispatchClickBar_Line.call("clickBar", this, d);
            dispatchClickBar_Lollipop.call("clickBar", this, d);
        })
        .transition()
        .duration(1000)
        // .attr("height", function(d, i) { return (height - padding - yscale(filteredDataUpdate[i].popularitySpotify)); });
        .attr("height", function(d,i) { return height - padding - yscale(filteredDataUpdate[i].popularitySpotify); })
        .attr("y", function(d,i) { return yscale(filteredDataUpdate[i].popularitySpotify); });
        
    xAxis.transition()
         .duration(1000)
         .call(d3.axisBottom(xscale));
    
    yAxis.transition()
         .duration(1000)
         .call(d3.axisLeft(yscale));
        
});

// uptade barchart when clicking on linechart
dispatchClickLine_Bar.on("clickLine", function(genreSelected) {

    svg.selectAll("rect").attr("class", "bars-style").remove();

    var filteredDataUpdate = [];
    var i,j;
    // loop on artist dataset
    for(i = 0; i < Object.keys(artists).length-1; i++) {    
        var string = artists[i].genre;  // get genre string
        var res = string.split(",");    // split it by commas
        for(j = 0; j < res.length; j ++) {  // loop the splitted string
            if(res[j] == genreSelected.genre) { 
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
       .attr("class", "bars-style")
       .data(filteredDataUpdate)
       .join("rect")
       .attr("class", "bars-style")
       .attr("opacity", opacityNormal)
       .attr("height", 0)            //setting height 0 for the transition effect
       .attr("width", xscale.bandwidth())
       .attr("x", function(d, i) { return xscale(filteredDataUpdate[i].displayName); })
       .attr("y", height - padding)  //setting y at the bottom for the transition effect
       .on("mouseover", function(event) {
            // all bars on gray...
            d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
            // ...except the one selected
            d3.select(this).style("opacity", opacityOff);
        })
        .on("mouseout", function(event) {
            d3.selectAll("rect").attr("class", "bars-style").attr("opacity", opacityNormal);
        })
        .on("click", function(event, d) {
            // clean all bars => all gray
            if(d3.select(this) != null) {
                d3.select(this).style("opacity", opacityNormal);
            }
            // color selected bar
            d3.select(this).style("opacity", opacityOff);
            
            dispatchClickBar_Map.call("clickBar", this, d);
            dispatchClickBar_Line.call("clickBar", this, d);
            dispatchClickBar_Lollipop.call("clickBar", this, d);
        })
        .transition()
        .duration(1000)
        // .attr("height", function(d, i) { return (height - padding - yscale(filteredDataUpdate[i].popularitySpotify)); });
        .attr("height", function(d,i) { return height - padding - yscale(filteredDataUpdate[i].popularitySpotify); })
        .attr("y", function(d,i) { return yscale(filteredDataUpdate[i].popularitySpotify); });
        
        
    xAxis.transition()
         .duration(1000)
         .call(d3.axisBottom(xscale));

    yAxis.transition()
         .duration(1000)
         .call(d3.axisLeft(yscale));

});


/**************************
 * gen_bar_chart()
 *  -creates a bar chart
 *************************/
function gen_bar_chart() {

    // filtering data
    var filteredData = [];
    // loop on artist dataset
    for(var i = 0; i < Object.keys(artists).length-1; i++) {    
        filteredData.push(artists[i]);  // to get a copy of the dataset artists
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
                .attr("height", height);
                // .attr("transform", "translate(" + 50 + ",0)");   // move svg to the right

    // x Axis
    xAxis = svg.append("g")
               .attr("class", "axisSubtitle")
               .attr("transform", "translate(0," + (height - padding) + ")")
               .call(d3.axisBottom(xScale));

    svg.append("text")
       .attr("class", "axisLabel")
       .attr("transform", "translate(" + width/2.2 + "," + (height - padding / 5) + ")")
       .text("Top Artists");

    
    // y Axis
    yAxis = svg.append("g")
               .attr("class", "axisSubtitle")
               .attr("transform", "translate(" + padding + ",0)")
               .call(d3.axisLeft(yScale));

    svg.append("text")
       .attr("class", "axisLabel")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x", 0 - height / 1.6)
       .attr("dy", "1em")
       .text("Popularity");

    // create bars
    svg.selectAll("rect")
       .attr("class", "bars-style")
       .data(filteredData)
       .join("rect")
       .attr("class", "bars-style")
       .attr("opacity", opacityNormal)
       .attr("y", height - padding)  //setting y at the bottom for the transition effect
       .attr("height", 0)            //setting height 0 for the transition effect
       .attr("width", xScale.bandwidth())
       .attr("x", function(d,i) { return xScale(d.displayName); })
    //    .attr("y", function(d,i) { return yScale(d.popularitySpotify); })
       .on("mouseover", function(event) {
            // all bars on gray...
            d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
            // ...except the one selected
            d3.select(this).style("opacity", opacityOff);
        })
        .on("mouseout", function(event) {
            d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
        })
        .on("click", function(event, d) {
            // clean all bars => all light gray
            if(d3.select(this) != null) {
                // d3.select(this).style("fill", "#a9a9a9");
                d3.select(this).style("opacity", opacityNormal);
            }
            // color selected bar
            // d3.select(this).style("fill", "#333333");
            d3.select(this).style("opacity", opacityOff);
            
            dispatchClickBar_Line.call("clickBar", this, d);
            dispatchClickBar_Map.call("clickBar", this, d)
            dispatchClickBar_Lollipop.call("clickBar", this, d);
        })
        .transition()
        .duration(2000)
        .attr("height", function(d,i) { return height - padding- yScale(d.popularitySpotify); })
        .attr("y", function(d,i) { return yScale(d.popularitySpotify); });
}


/**************************
 * reset_button()
 *  - resets bar chart
 *************************/
function reset_button() {

    d3.select("#reset").on("click", function() {
        
        // filtering data
        var filteredData = [];
        // loop on artist dataset
        for(var i = 0; i < Object.keys(artists).length-1; i++) {    
            filteredData.push(artists[i]);  // to get a copy of the dataset artists
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

        svg.selectAll("rect")
           .data(filteredData)
           .join("rect")
           .attr("width", xScale.bandwidth())
           .attr("height", function(d, i) { return (height - padding - yScale(filteredData[i].popularitySpotify)); })
           .attr("fill", "steelblue")
           .attr("x", function(d, i) { return xScale(filteredData[i].displayName); })
           .attr("y", function(d, i) { return yScale(filteredData[i].popularitySpotify); })
           .on("mouseover", function(event) {
                // if(d3.select(this) == null) console.log("entrei");
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
                
                dispatchClickBar_Map.call("clickBar", this, d);
                dispatchClickBar_Line.call("clickBar", this, d);
                dispatchClickBar_Lollipop.call("clickBar", this, d);
           })
           .transition()
           .duration(2000);
            
    xAxis.transition()
         .duration(2000)
         .call(d3.axisBottom(xScale));
    })
};