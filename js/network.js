// Theme: Music Evolution Through Decades


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
var svg;
var net;
var selectedIndex;
var artist;

// datasets
var artists;
var data;


// var toolTip;    // tooltip

// get datasets
d3.json("dataset/newTagsV2.json").then(function(data1) {
  d3.csv("dataset/artistV7.csv").then(function(data2) {
    data = data1;
    artists = data2;
    gen_network();
    addZoom();
  })
});



function gen_subgraph(artist){
  nodes = [];
  links = [];
  // sorry whoever reads this, dont judge, no time for recursives
  //gets the links and nodes, depth of 2

  //aux to find duplicate link
  artist = artist;
  function isDuplicate(links, link){
    for (var i = 0; i < links.length; i++){
      var entry = links[i];
      if (link.source == entry.target && link.target == entry.source){
        return true;
      }
    }
  }

  var centralArtist;
  for (var i = 0; i < data.nodes.length; i++){
    if (data.nodes[i].artist == artist){
      centralArtist = data.nodes[i];
      centralArtist.radius = 30;
      break;
    }
  }
  nodes.push(centralArtist);

  var temp = [];
  for (var i = 0; i < data.links.length; i++){
    var link = data.links[i];
    if ((link.source == artist || link.target == artist) && !isDuplicate(links, link)){
      temp.push(link);
    }
  }


  // primeiros vizinhos do central
  var firstNeig = [];
  for (var i = 0; i < temp.length; i++){
    if (!firstNeig.includes(temp[i].source) && temp[i].source != artist){
      firstNeig.push(temp[i].source);
    }

    if (!firstNeig.includes(temp[i].target) && temp[i].target != artist){
      firstNeig.push(temp[i].target);
    }
  }

  // mete os objectos dos primeiros vizinhos no nodes
  for (var i = 0; i < data.nodes.length; i++){
    if (firstNeig.includes(data.nodes[i].artist)){
      var n = data.nodes[i];
      n.radius = 20;
      nodes.push(n);
    }
  }



  //links dos primeiros vizinhos tanto na source como no target
  for (var i = 0; i < firstNeig.length; i++){
    for (var j = 0; j < data.links.length; j++){
      var link = data.links[j];
      if ((link.source == firstNeig[i] || link.target == firstNeig[i]) && !isDuplicate(links, link)){
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

  for (var i = 0; i < data.nodes.length; i++){
    var n = data.nodes[i];
    if (secondNeig.includes(n.artist)){
      n.radius = 10;
      nodes.push(n);
    }
  }

}



function gen_network(){
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

  gen_subgraph(artist);
  //console.log(links)

  svg = d3.select("#network")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  // Let's list the force we wanna apply on the network
  force = d3.forceSimulation(nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink(links).id(function(d) { return d.artist; }))
    .force("charge", d3.forceManyBody().strength(-500))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
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
    .attr("stroke-dasharray", 2000)
    .attr("stroke-dashoffset", 2000);

  link.transition().attr("stroke-dashoffset", 0).duration(6000);

  // Initialize the nodes
  node = net.selectAll(".network-node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "network-node")
    .attr("r",0)
    .attr("cx", width/2)
    .attr("cy", height/2)
    .style("stroke", "gray")
    .call(drag(force));


  node.transition().attr("r",  d => d.radius).duration(3000);

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
// FIXME
// node = svg.selectAll(".network-node").data(nodes, function(d) { return d.artist; });
// var nodeEnter = node.enter().append("g");

// var defs = nodeEnter.append("defs");

// defs.append('pattern')
//       .attr("id", function(d) { return "image"+ d.artist;}  )
//       .attr("width", 1)
//       .attr("height", 1)
//       .append("image")
//       .attr("xlink:href", function(d) { return d.picture;})
//       .attr("width", 100)
//       .attr("height", 150);

//       nodeEnter.append("circle")
//       .attr("cx", 50)
//       .attr("cy", 50)
//       .attr("fill",function(d) { return "url("+ d.picture +")" }  )
//       .attr("r", 60);

// console.log(nodes[0].displayName);
