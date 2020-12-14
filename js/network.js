// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("network")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV5.csv").then(function(data2) {
        d3.csv("dataset/genDecPop.csv").then(function(data3) {
            decades = data1;
            artists = data2;
            popularity = data3;
            gen_network_chart(build_nodes());




        })
    })
});

function build_nodes() {
    // o	artist selected ->central node is artist selected;
    // o	hover on the links -> displays what the link means;
    // o	click on node -> selects artist for the visualization;

    return "nodes"
}

function start() {
    // being populated with the top artist of the selected genre.
}

function gen_network_chart(data) {

    // Initialize the links
    var link = svg
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    var node = svg
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2")

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink() // This force provides links between nodes
            .id(function(d) { return d.id; }) // This provide  the id of a node
            .links(data.links) // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x + 6; })
            .attr("cy", function(d) { return d.y - 6; });
    }

};