// Theme: Music Evolution Through Decades

// import colors from main
import { genreColor } from "./main.js";

// import tooltip
import { toolTip } from "./main.js";

// import reset button
import { dispatchReset_Bar } from "./main.js";

// events
import { dispatchClickBar_Line } from "./main.js";
import { dispatchClickBar_Map } from "./main.js";
import { dispatchClickBar_Lollipop } from "./main.js";
import { dispatchClickBar_Net } from "./main.js";

import { dispatchClickMap_Bar } from "./main.js";
import { dispatchClickLine_Bar } from "./main.js";
import { dispatchClickNet_Bar } from "./main.js";
import { tooltipDuration } from "./main.js";

// global variables
var width = 600;
var height = 400;
var padding = 60;

var xAxis;
var yAxis;
var svg;

// dataset
var artists;

// bars id
var ids = [1,2,3,4,5];

// flag to see if a bar is clicked
var isClicked = 0;

var opacityOff = 1;         // when mouseover, THIS bar's opacity gets higher
var opacityNormal = 0.5;    // when mouseout, all bars return to normal


// get decade dataset
d3.csv("dataset/artistV7.csv").then(function(data) {
  artists = data;
  gen_bar_chart();
});


// update barchart when clicking on map
dispatchClickMap_Bar.on("clickMap", function(countrySelected) {

  svg.selectAll("rect").attr("class", "bars-style").remove();

  // reset the clicked bar if needed
  isClicked = 0;

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


  svg.selectAll("rect")
    .attr("class", "bars-style")
    .data(filteredDataUpdate)
    .join("rect")
    .attr("class", "bars-style")
    .attr("id", function(d, i) { return "_" + ids[i]; })
    .attr("opacity", opacityNormal)
    .attr("height", 0)            //setting height 0 for the transition effect
    .attr("width", xscale.bandwidth())
    .attr("x", function(d, i) { return xscale(filteredDataUpdate[i].displayName); })
    .attr("y", height - padding)  //setting y at the bottom for the transition effect
    .on("mouseover", function(event, d) {
      // all bars on grey...
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // ...except the one selected
      d3.select(this).style("opacity", opacityOff);
      // ...and the one clicked, if clicked
      if(isClicked != 0) { 
        d3.select("#" + isClicked).style("opacity", opacityOff); 
      }
      // tooltip
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0.9)
        .style("visibility", "visible");
      var text = "Popularity: " + d.popularitySpotify;
      toolTip.html(text)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 35) + "px");
    })
    .on("mousemove", function(event, d){
      return toolTip.style("top", (event.pageY-35)+"px")
        .style("left",(event.pageX)+"px");})
    .on("mouseout", function(event) {
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // if any bar clicked, keep clicked
      if(isClicked != 0) {
        d3.select("#" + isClicked).style("opacity", opacityOff);
      }      
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      // clean all bars => all grey
      if(d3.select(this) != null) {
        d3.select(this).style("opacity", opacityNormal);
      }
      // color selected bar
      d3.select(this).attr("opacity", opacityOff);
      // keep the ID of the clicked bar
      isClicked = this.id;

      dispatchClickBar_Map.call("clickBar", this, d);
      dispatchClickBar_Line.call("clickBar", this, d);
      dispatchClickBar_Lollipop.call("clickBar", this, d);
      dispatchClickBar_Net.call("clickBar", this, d);
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

  // reset the clicked bar if needed
  isClicked = 0;

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
    .attr("id", function(d, i) { return "_" + ids[i]; })
    .attr("opacity", opacityNormal)
    .attr("height", 0)            //setting height 0 for the transition effect
    .attr("width", xscale.bandwidth())
    .attr("x", function(d, i) { return xscale(filteredDataUpdate[i].displayName); })
    .attr("y", height - padding)  //setting y at the bottom for the transition effect
    .on("mouseover", function(event, d) {
      // all bars on gray...
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // ...except the one selected
      d3.select(this).style("opacity", opacityOff);
      // ...and the one clicked, if clicked
      if(isClicked != 0) { 
        d3.select("#" + isClicked).style("opacity", opacityOff); 
      }
      // tooltip
      const[x, y] = d3.pointer(event);
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0.9)
        .style("visibility", "visible");
      var text = "Popularity: " + d.popularitySpotify;
      toolTip.html(text)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 35) + "px");
    })
    .on("mousemove", function(event, d){
      return toolTip.style("top", (event.pageY-35)+"px")
        .style("left",(event.pageX)+"px");})
    .on("mouseout", function(event) {
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // if any bar clicked, keep clicked
      if(isClicked != 0) {
        d3.select("#" + isClicked).style("opacity", opacityOff);
      }
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      // clean all bars => all gray
      if(d3.select(this) != null) {
        d3.select(this).style("opacity", opacityNormal);
      }
      // color selected bar
      d3.select(this).style("opacity", opacityOff);
      // keep the ID of the clicked bar
      isClicked = this.id;

      dispatchClickBar_Map.call("clickBar", this, d);
      dispatchClickBar_Line.call("clickBar", this, d);
      dispatchClickBar_Lollipop.call("clickBar", this, d);
      dispatchClickBar_Net.call("clickBar", this, d);
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

// update barchart when clicking on network
dispatchClickNet_Bar.on("clickNet", function(artistSelected) {

  // reset the clicked bar if needed
  isClicked = 0;

  // get artist info
  var artist = [];
  for(var i = 0; i < Object.keys(artists).length-1; i++) {
    if(artists[i].artist == artistSelected.artist) {
      artist.push(artists[i]);
    }
  }

  // Create X scale with the artist
  var xscale = d3.scaleBand()
    .domain(artist.map(d => d.displayName))
    .range([padding, width - padding]);
  xscale.paddingInner(0.5);

  // Create Y scale
  var yscale = d3.scaleLinear()
    .domain([0, artist[0].popularitySpotify])
    .range([height - padding, padding]);

  svg.selectAll("rect")
    .attr("class", "bars-style")
    .data(artist)
    .join("rect")
    .attr("class", "bars-style")
    .attr("id", function(d, i) { return "_" + ids[i]; })
    .attr("opacity", opacityNormal)
    .attr("height", 0)            //setting height 0 for the transition effect
    .attr("width", xscale.bandwidth())
    .attr("x", xscale(artist[0].displayName))
    .attr("y", height - padding)  //setting y at the bottom for the transition effect
    .on("mouseover", function(event, d) {
      // all bars on grey...
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // ...except the one selected
      d3.select(this).style("opacity", opacityOff);
      // ...and the one clicked, if clicked
      if(isClicked != 0) { 
        d3.select("#" + isClicked).style("opacity", opacityOff); 
      }
      // tooltip
      const[x, y] = d3.pointer(event);
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0.9)
        .style("visibility", "visible");
      var text = "Popularity: " + d.popularitySpotify;
      toolTip.html(text)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 35) + "px");
    })
    .on("mousemove", function(event, d){
      return toolTip.style("top", (event.pageY-35)+"px")
        .style("left",(event.pageX)+"px");})
    .on("mouseout", function(event) {
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // if any bar clicked, keep clicked
      if(isClicked != 0) {
        d3.select("#" + isClicked).style("opacity", opacityOff);
      }      
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      // clean all bars => all grey
      if(d3.select(this) != null) {
        d3.select(this).style("opacity", opacityNormal);
      }
      // color selected bar
      d3.select(this).attr("opacity", opacityOff);
      // keep the ID of the clicked bar
      isClicked = this.id;

      dispatchClickBar_Map.call("clickBar", this, d);
      dispatchClickBar_Line.call("clickBar", this, d);
      dispatchClickBar_Lollipop.call("clickBar", this, d);
      dispatchClickBar_Net.call("clickBar", this, d);
    })
    .transition()
    .duration(1000)
    .attr("height", function(d) { return height - padding - yscale(artist[0].popularitySpotify); })
    .attr("y", yscale(artist[0].popularitySpotify));

  xAxis.transition()
    .duration(1000)
    .call(d3.axisBottom(xscale));

  yAxis.transition()
    .duration(1000)
    .call(d3.axisLeft(yscale));

});

// reset button
dispatchReset_Bar.on("reset", function() {
  svg.selectAll("rect").attr("class", "bars-style").remove();

  // reset the clicked bar if needed
  isClicked = 0;

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

  // create bars
  svg.selectAll("rect")
    .attr("class", "bars-style")
    .data(filteredData)
    .join("rect")
    .attr("class", "bars-style")
    .attr("id", function(d, i) { return "_" + ids[i]; })
    .attr("opacity", opacityNormal)
    .attr("y", height - padding)  //setting y at the bottom for the transition effect
    .attr("height", 0)            //setting height 0 for the transition effect
    .attr("width", xScale.bandwidth())
    .attr("x", function(d,i) { return xScale(d.displayName); })
    .on("mouseover", function(event, d) {
      // all bars on gray...
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // ...except the one selected
      d3.select(this).style("opacity", opacityOff);
      // ...and the one clicked, if clicked
      if(isClicked != 0) { 
        d3.select("#" + isClicked).style("opacity", opacityOff); 
      }
      // tooltip
      const[x, y] = d3.pointer(event);
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0.9)
        .style("visibility", "visible");
      var text = "Popularity: " + d.popularitySpotify;
      toolTip.html(text)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 35) + "px");
    })
    .on("mousemove", function(event, d){
      return toolTip.style("top", (event.pageY-35)+"px")
        .style("left",(event.pageX)+"px");})
    .on("mouseout", function(event) {
      // all bars gray
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // if any bar clicked, keep clicked
      if(isClicked != 0) {
        d3.select("#" + isClicked).style("opacity", opacityOff);
      }
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      // clean all bars => all light gray
      if(d3.select(this) != null) {
        d3.select(this).style("opacity", opacityNormal);
      }
      // color selected bar
      d3.select(this).style("opacity", opacityOff);
      // keep the ID of the clicked bar
      isClicked = this.id;

      dispatchClickBar_Line.call("clickBar", this, d);
      dispatchClickBar_Map.call("clickBar", this, d)
      dispatchClickBar_Lollipop.call("clickBar", this, d);
      dispatchClickBar_Net.call("clickBar", this, d);
    })
    .transition()
    .duration(2000)
    .attr("height", function(d,i) { return height - padding- yScale(d.popularitySpotify); })
    .attr("y", function(d,i) { return yScale(d.popularitySpotify); });

  xAxis.transition()
    .duration(1000)
    .call(d3.axisBottom(xScale));

  yAxis.transition()
    .duration(1000)
    .call(d3.axisLeft(yScale));
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
    .attr("id", function(d, i) { return "_" + ids[i]; })
    .attr("opacity", opacityNormal)
    .attr("y", height - padding)  //setting y at the bottom for the transition effect
    .attr("height", 0)            //setting height 0 for the transition effect
    .attr("width", xScale.bandwidth())
    .attr("x", function(d,i) { return xScale(d.displayName); })
    .on("mouseover", function(event, d) {
      // all bars on gray...
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // ...except the one selected...
      d3.select(this).style("opacity", opacityOff);
      // ...and the one clicked, if clicked
      if(isClicked != 0) { 
        d3.select("#" + isClicked).style("opacity", opacityOff); 
      }
      // tooltip
      const[x, y] = d3.pointer(event);
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0.9)
        .style("visibility", "visible");
      var text = "Popularity: " + d.popularitySpotify;
      toolTip.html(text)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 35) + "px");
    })
    .on("mousemove", function(event, d){
      return toolTip.style("top", (event.pageY-35)+"px")
        .style("left",(event.pageX)+"px");})
    .on("mouseout", function(event) {
      // all bars gray
      d3.selectAll("rect").attr("class", "bars-style").style("opacity", opacityNormal);
      // if any bar clicked, keep clicked
      if(isClicked != 0) {
        d3.select("#" + isClicked).style("opacity", opacityOff);
      }
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      // clean all bars => all light gray
      if(d3.select(this) != null) {
        d3.select(this).style("opacity", opacityNormal);
      }
      // color selected bar
      d3.select(this).style("opacity", opacityOff);
      // keep the ID of the clicked bar
      isClicked = this.id;

      dispatchClickBar_Line.call("clickBar", this, d);
      dispatchClickBar_Map.call("clickBar", this, d)
      dispatchClickBar_Lollipop.call("clickBar", this, d);
      dispatchClickBar_Net.call("clickBar", this, d);
    })
    .transition()
    .duration(2000)
    .attr("height", function(d,i) { return height - padding- yScale(d.popularitySpotify); })
    .attr("y", function(d,i) { return yScale(d.popularitySpotify); });
}
