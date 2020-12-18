// // Theme: Music Evolution Through Decades


// // all genres; they never change
// const genres= ["Avant-garde", "Blues", "Caribbean and Caribbean-influenced", "Comedy",
// "Country", "Easy listening", "Electronic", "Folk", "Heavy metal", "Hip hop", "House",
// "Jazz", "Latin", "Pop", "Punk rock", "R&B and soul", "Rock"];

// // global variables
// var width = 600;
// var height = 400;
// var padding = 60;

// var tags;
// var node;       // Node
// var link;       // link between nodes
// var R = 20;     // Radius of bigger node
// var r = 10;     // All other radius
// var svg;

// var toolTip;    // tooltip

// var opacityOn = 0.3;    // when mouseover, other bars's opacity lows down
// var opacityOff = 2;     // when mouseover, THIS bar's opacity gets higher
// var opacityNormal = 1;  // when mouseout, all bars return to normal



// // get decade dataset
// // d3.json("dataset/tags.json").then(function(data1) {
//     d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then(function(data1){
//     // d3.csv("dataset/artistV7.csv").then(function(data2) {
//         // d3.csv("dataset/genDecPop.csv").then(function(data3) {
//             tags = data1;
//             // artists = data2;
//             // popularity = data3;
//             gen_network();
//         // })
//     // })
// });


// function gen_network() {

//     // append the svg object to the body of the page
//     svg = d3.select("#network")
//             .append("svg")
//             .attr("width", width)
//             .attr("height", height);

//     // Initialize the links
//     link = svg.selectAll("line")
//               .attr("class", "network-link")
//               .data(tags.links)
//               .enter();
//                 //   .append("line")
//                 //   .attr("class", "network-link");

//     // Initialize the nodes
//     node = svg.selectAll("circle")
//               .attr("class", "network-node")
//               .data(tags.nodes)
//               .enter()
//               .append("circle")
//               .attr("class", "network-node")
//               .attr("r", r);

//     // console.log(tags.nodes[0].artist);
//     // Let's list the force we wanna apply on the network
//     var simulation = d3.forceSimulation(tags.nodes)                 // Force algorithm is applied to data.nodes
//                        .force("link", d3.forceLink().id(function(d) { return d.id; })                               
//                                                     .links(tags.links))
//                        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
//                        .force("center", d3.forceCenter(width/2, height/2))     // This force attracts nodes to the center of the svg area
//                        .on("end", ticked);

// }


// // This function is run at each iteration of the force algorithm, updating the nodes position.
// function ticked() {
//     link.attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });

//     node.attr("cx", function (d) { return d.x+6; })
//         .attr("cy", function(d) { return d.y-6; });
//   }





































// // set the dimensions and margins of the graph
// var margin = { top: 10, right: 30, bottom: 30, left: 40 },
//     width = 400 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("network")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("dataset/decade.csv").then(function(data1) {
//     d3.csv("dataset/artistV7.csv").then(function(data2) {
//         d3.csv("dataset/genDecPop.csv").then(function(data3) {
//             decades = data1;
//             artists = data2;
//             popularity = data3;
//             gen_network_chart(build_nodes());




//         })
//     })
// });

// function build_nodes() {
//     // o	artist selected ->central node is artist selected;
//     // o	hover on the links -> displays what the link means;
//     // o	click on node -> selects artist for the visualization;

//     return "nodes"
// }

// function start() {
//     // being populated with the top artist of the selected genre.
// }

// function gen_network_chart(data) {

//     // Initialize the links
//     var link = svg
//         .selectAll("line")
//         .data(data.links)
//         .enter()
//         .append("line")
//         .style("stroke", "#aaa")

//     // Initialize the nodes
//     var node = svg
//         .selectAll("circle")
//         .data(data.nodes)
//         .enter()
//         .append("circle")
//         .attr("r", 20)
//         .style("fill", "#69b3a2")

//     // Let's list the force we wanna apply on the network
//     var simulation = d3.forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
//         .force("link", d3.forceLink() // This force provides links between nodes
//             .id(function(d) { return d.id; }) // This provide  the id of a node
//             .links(data.links) // and this the list of links
//         )
//         .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
//         .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
//         .on("end", ticked);

//     // This function is run at each iteration of the force algorithm, updating the nodes position.
//     function ticked() {
//         link
//             .attr("x1", function(d) { return d.source.x; })
//             .attr("y1", function(d) { return d.source.y; })
//             .attr("x2", function(d) { return d.target.x; })
//             .attr("y2", function(d) { return d.target.y; });

//         node
//             .attr("cx", function(d) { return d.x + 6; })
//             .attr("cy", function(d) { return d.y - 6; });
//     }

// };