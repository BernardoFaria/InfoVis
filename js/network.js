// Theme: Music Evolution Through Decades

// import events
import { dispatchClickNet_Line } from "./main.js";
import { dispatchClickNet_Bar } from "./main.js";
import { dispatchClickNet_Map } from "./main.js";
import { dispatchClickNet_Lollipop } from "./main.js";

import { dispatchClickBar_Net } from "./main.js";
import { dispatchClickMap_Net } from "./main.js";
import { dispatchClickLine_Net } from "./main.js";

import { dispatchReset_Network } from "./main.js";

// import tooltip
import { toolTip } from "./main.js";
import { tooltipDuration } from "./main.js";

// all genres; they never change
const genres= ["Avant-garde", "Blues", "Caribbean and Caribbean-influenced", "Comedy",
"Country", "Easy listening", "Electronic", "Folk", "Heavy metal", "Hip hop", "House",
"Jazz", "Latin", "Pop", "Punk rock", "R&B and soul", "Rock"];

// global variables
var width = 600;
var height = 400 * 2;
var padding = 60;

var nodes = [];       // Node
var links = [];       // link between nodes
var link;
var node;
var force;      //
var R = 20;     // Radius of bigger node
var r = 15;     // All other radius
var svg = null;
var net;

// datasets
var artists;
var data;

// get datasets
d3.json("dataset/newTagsV5.json").then(function(data1) {
  d3.csv("dataset/artistV7.csv").then(function(data2) {
    data = data1;
    artists = data2;

    // filtering data
    var filteredData = [];
    // loop on artist dataset
    for(var i = 0; i < Object.keys(artists).length-1; i++) {
      filteredData.push(artists[i]);  // to get a copy of the dataset artists
    }
    // sort data by popularity => bigger to smaller
    filteredData.sort(function(a, b) { return b.popularitySpotify - a.popularitySpotify; });
    // first 5 elements
    filteredData.splice(1, filteredData.length);
    //most popular of everywhere
    var artist = filteredData[0].artist;

    gen_network(artist);
  })
});


// update network when clicking on barchart
dispatchClickBar_Net.on("clickBar", function(artistSelected) {
  gen_network(artistSelected.artist);
});


// update network when clicking on map
dispatchClickMap_Net.on("clickMap", function(countrySelected) {
  // get the most popular artist from this country
  var filteredDataUpdate = [];
  var i,j;
  // loop on artist dataset
  for(i = 0; i < Object.keys(artists).length-1; i++) {
    if(artists[i].country == countrySelected.properties.name) {
      filteredDataUpdate.push(artists[i]);
    }
  }
  // sort data by popularity => bigger to smaller
  filteredDataUpdate.sort(function(a, b) { return b.popularitySpotify - a.popularitySpotify; });
  // get the first
  filteredDataUpdate.splice(1, filteredDataUpdate.length);

  gen_network(filteredDataUpdate[0].artist);
});


// update network when clicking on lineplot
dispatchClickLine_Net.on("clickLine", function(genreSelected) {
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
  // most popular artist
  filteredDataUpdate.splice(1, filteredDataUpdate.length);

  gen_network(filteredDataUpdate[0].artist);
});


// reset button
dispatchReset_Network.on("reset", function() {

  svg.selectAll(".network-link").remove();
  svg.selectAll(".network-node").remove();

  // filtering data
  var filteredData = [];
  // loop on artist dataset
  for(var i = 0; i < Object.keys(artists).length-1; i++) {
    filteredData.push(artists[i]);  // to get a copy of the dataset artists
  }
  // sort data by popularity => bigger to smaller
  filteredData.sort(function(a, b) { return b.popularitySpotify - a.popularitySpotify; });
  // first 5 elements
  filteredData.splice(1, filteredData.length);
  //most popular
  var artist = filteredData[0].artist;


  gen_network(artist);
});



function gen_subgraph(artist){
  nodes = [];
  links = [];
  // sorry whoever reads this, dont judge, no time for recursives
  //gets the links and nodes, depth of 2
  var copy = JSON.parse(JSON.stringify(data));

  //aux to find duplicate link
  // artist = artist;
  function isDuplicate(links, link){
    for (var i = 0; i < links.length; i++){
      var entry = links[i];
      if (link.source === entry.target && link.target === entry.source){
        return true;
      }
    }
  }

  var centralArtist = null;
  for (var i = 0; i < copy.nodes.length; i++){
    if (copy.nodes[i].artist === artist){
      centralArtist = copy.nodes[i];
      centralArtist.radius = 30;
      break;
    }
  }
  nodes.push(centralArtist);


  // vai busvar todos os links que tem o central como edge
  var temp = [];
  for (var i = 0; i < copy.links.length; i++){
    var link = copy.links[i];
    if ((link.source === artist || link.target === artist) && !isDuplicate(links, link)){
      temp.push(link);
    }
  }


  // primeiros vizinhos do central
  var firstNeig = [];
  for (var i = 0; i < temp.length; i++){
    if (!firstNeig.includes(temp[i].source) && temp[i].source !== artist){
      firstNeig.push(temp[i].source);
    }

    if (!firstNeig.includes(temp[i].target) && temp[i].target !== artist){
      firstNeig.push(temp[i].target);
    }
  }

  // mete os objectos dos primeiros vizinhos no nodes
  for (var i = 0; i < copy.nodes.length; i++){
    if (firstNeig.includes(copy.nodes[i].artist)){
      var n = copy.nodes[i];
      n.radius = 20;
      nodes.push(n);
    }
  }



  //links dos primeiros vizinhos tanto na source como no target
  for (var i = 0; i < firstNeig.length; i++){
    for (var j = 0; j < copy.links.length; j++){
      var link = copy.links[j];
      if ((link.source === firstNeig[i] || link.target === firstNeig[i]) && !isDuplicate(links, link)){
        links.push(link);
      }
    }
  }

  var secondNeig = [];
  for (var i = 0; i < links.length; i++){
    var s = links[i].source;
    var t = links[i].target;
    if (!secondNeig.includes(s) && !firstNeig.includes(s) && s != artist)
      secondNeig.push(s);
    if (!secondNeig.includes(t) && !firstNeig.includes(t) && t != artist)
      secondNeig.push(t);
  }

  for (var i = 0; i < copy.nodes.length; i++){
    var n = copy.nodes[i];
    if (secondNeig.includes(n.artist)){
      n.radius = 10;
      nodes.push(n);
    }
  }

}



function gen_network(artist){
  if(svg)
    svg.remove();

  gen_subgraph(artist);

  svg = d3.select("#network")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  // Let's list the force we wanna apply on the network
  force = d3.forceSimulation(nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink(links).id(function(d) { return d.artist; }))
    .force("charge", d3.forceManyBody().strength(-400).distanceMax(300))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width/2, height/2))     // This force attracts nodes to the center of the svg area
    .force("bounds", boxingForce)
    .on("tick", ticked);

  // join links and nodes in one element
  net = svg.append("g");

  // Initialize the links
  link = net.selectAll(".network-link")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", d => Math.sqrt(d.weight))
    .attr("class", "network-link")
    .attr("stroke-dasharray", 30000)
    .attr("stroke-dashoffset", 30000);

  link.transition().attr("stroke-dashoffset", 0).duration(8000);

  // Initialize the nodes
  node = net.selectAll(".network-node")
    .data(nodes)
    .enter()
    .append("g")
    .call(drag(force));

  var defs = node.append("defs");

  defs.append('pattern')
    .attr("id", function(d,i){return "my_image" + i})
    .attr("width", 1)
    .attr("height", 1)
    .append("svg:image")
    .attr("xlink:href", function(d) {return "/img/res/"+d.picture})
    .attr("height", d => 2 * d.radius)
    .attr("width", d => 2 * d.radius)
    .attr("x", 0)
    .attr("y", 0);

  node = node.append("circle")
    .attr("class", "network-node")
    .attr("r",0)
    .attr("fill",function(d,i){ return "url(#my_image" + i + ")"})
    .attr("cx", width/2)
    .attr("cy", height/2)
    .style("stroke", "gray");

  node.transition().attr("r",  d => d.radius).duration(2000);

  node.on("mouseover", function(event, d) {
    //tooltip
    toolTip.transition()
      .duration(tooltipDuration)
      .style("opacity", 0.9)
      .style("visibility", "visible");
    var text = "Artist: " + d.displayName;
    toolTip.html(text)
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 35) + "px");
  })
    .on("mouseout", function(event, d) {
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })
    .on("mousemove", function(event, d){return toolTip.style("top", (event.pageY-35)+"px").style("left",(event.pageX)+"px");})
    .on("click", function(event, d) {
      dispatchClickNet_Line.call("clickNet", this, d);
      dispatchClickNet_Bar.call("clickNet", this, d);
      dispatchClickNet_Map.call("clickNet", this, d);
      dispatchClickNet_Lollipop.call("clickNet", this, d);
      gen_network(d.artist);
    });

  link.on("mouseover", function(event, d) {
    //tooltip
    toolTip.transition()
      .duration(tooltipDuration)
      .style("opacity", 0.9)
      .style("visibility", "visible");
    var text = "Common tags: " + d.tags.join(", ");
    toolTip.html(text)
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 35) + "px");
  })
    .on("mousemove", function(event, d){
      return toolTip.style("top", (event.pageY-35)+"px")
        .style("left",(event.pageX)+"px");})
    .on("mouseout", function(event, d) {
      // tooltip off
      toolTip.transition()
        .duration(tooltipDuration)
        .style("opacity", 0)
        .style("visibility", "hidden");
    })

  addZoom();
}


function drag(simulation){
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

// This function is run at each iteration of the force algorithm, updating the nodes position.
function ticked() {
  nodes[0].x = width/2;
  nodes[0].y = height/2;
  link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });


  node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
}

function boxingForce() {
  for (let node of nodes) {
    // Of the positions exceed the box, set them to the boundary position.
    // You may want to include your nodes width to not overlap with the box.
    const pad = padding/4
    node.x = Math.max(r + pad, Math.min(width - pad- r, node.x));
    node.y = Math.max(r + pad, Math.min(height - pad- r, node.y));
  }
}

// Adding zoom to the network
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
  svg.select("g")
    .attr("transform", transform);
}
