// Theme: Music Evolution Through Decades


// all genres; they never change
const genres= ["Avant-garde", "Blues", "Caribbean and Caribbean-influenced", "Comedy",
"Country", "Easy listening", "Electronic", "Folk", "Heavy metal", "Hip hop", "House",
"Jazz", "Latin", "Pop", "Punk rock", "R&B and soul", "Rock"];

// global variables
var width = 600;
var height = 400;
var padding = 60;

var nodes = [];       // Node
var links = [];       // link between nodes
var link;
var node;
var force;      //
var R = 20;     // Radius of bigger node
var r = 10;     // All other radius
var svg;
var net;

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
    // sorry whoever reads this, dont judge, no time for recursives
    //gets the links and nodes, depth of 2
  
    //aux to find duplicate link
    function isDuplicate(links, link){
      for (var i = 0; i < links.length; i++){
        var entry = links[i];
        if (link.source == entry.target && link.target == entry.source){
          return true;
        }
      }
    }
  
    var temp = [];
    for (var i = 0; i < data.links.length; i++){
      var link = data.links[i];
      if ((link.source == artist || link.target == artist) && !isDuplicate(links, link)){
        temp.push(link);
      }
    }
  
  
    var arts = [];
    for (var i = 0; i < temp.length; i++){
      if (!arts.includes(temp[i].source))
        arts.push(temp[i].source);
      if (!arts.includes(temp[i].target))
        arts.push(temp[i].target);
    }
  
  
    for (var i = 0; i < arts.length; i++){
      for (var j = 0; j < data.links.length; j++){
        var link = data.links[j];
        if ((link.source == arts[i] || link.target == arts[i]) && !isDuplicate(links, link)){
          links.push(link);
        }
      }
    }
  
  
    arts = [];
    for (var i = 0; i < links.length; i++){
      if (!arts.includes(links[i].source))
        arts.push(links[i].source);
      if (!arts.includes(links[i].target))
        arts.push(links[i].target);
    }
  
  
    for (var i = 0; i < data.nodes.length; i++){
      if (arts.includes(data.nodes[i].artist))
        nodes.push(data.nodes[i])
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

    svg = d3.select("#network")
            .append("svg")
            .attr("width", width)
            .attr("height", height*2);


    // Let's list the force we wanna apply on the network
    force = d3.forceSimulation(nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink().id(function(d) { return d.artist; })                               
                                    .links(links))
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width/2, height))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // join links and nodes in one element
    net = svg.append("g");

    // Initialize the links
    link = net.selectAll(".network-link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "network-link");

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
    // Initialize the nodes
    node = net.selectAll(".network-node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", r);
}
  


// This function is run at each iteration of the force algorithm, updating the nodes position.
function ticked() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function (d) { return d.x+6; })
        .attr("cy", function(d) { return d.y-6; });
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
