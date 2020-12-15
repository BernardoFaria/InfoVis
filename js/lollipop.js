// Theme: Music Evolution Through Decades

// global variables
var width = 600;
var height = 400;
var padding = 60;
var radius = 6;
var xScale;
var fullDataset;

// datasets variables
var artists;
var decades;


// o	artist selected -> color the line and dot of the respective birth date/creation date and adds label with the year;
// o	genre selected -> displays only the birth/creation date of artists of that genre;
// o	location selected -> displays only the birth/creation date of artists of that location.
// o	hover -> displays label with the year.


d3.csv("dataset/artistV6.csv").then(function(data1) {
    d3.csv("dataset/decade.csv").then(function(data2) {
        artists = data1;
        decades = data2;
        gen_lollipop();
    })
});


function gen_lollipop() {

    // create lollipop
    var svg = d3.select("#lollipop")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + 50 + ",0)");
    
    // get all decades
    var decAux = decades.map((a) => a.decade);  // get all decades
    var getDecades = [];    // aux
    decAux.forEach((c) => {     // forEach to remove duplicates, couldn't find another way
        if (!getDecades.includes(c)) {
            getDecades.push(c);
        }
    });
    getDecades.sort();  // sort from old to new

    // get total artists per decade
    var getTotalArtists = [0,0,0,0,0,0,0];    // aux
    for(var i = 0; i < Object.keys(decades).length-1; i++) {    
        if (decades[i].decade == 1950) { getTotalArtists[0]++; }
        if (decades[i].decade == 1960) { getTotalArtists[1]++; }
        if (decades[i].decade == 1970) { getTotalArtists[2]++; }
        if (decades[i].decade == 1980) { getTotalArtists[3]++; }
        if (decades[i].decade == 1990) { getTotalArtists[4]++; }
        if (decades[i].decade == 2000) { getTotalArtists[5]++; }
        if (decades[i].decade == 2010) { getTotalArtists[6]++; }
    }
    // join [decade, totalArtists]
    fullDataset = getDecades.map(function(d, i) {
      return { 'decade' : d, 'total' : getTotalArtists[i] };
    });


    // create X scale
    xScale = d3.scaleBand()
               .domain(getDecades)
               .range([padding, width - padding])
               .padding(1);

    // create X axis
    svg.append("g")
       .attr("class", "axisSubtitle")
       .style("font-size", "13px")
       .attr("transform", "translate(0," + (height - padding) + ")")
       .call(d3.axisBottom(xScale));

    svg.append("text")
       .attr("transform", "translate(" + width/2.2 + "," + (height -padding / 3) + ")")
       .text("Decades");

    // create Y scale
    var yScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([height - padding, padding]);

    // FIXME: TEMOS DE VER SE QUEREMOS O EIXO DO Y OU NÃO
    // create Y axis
    svg.append("g")
       .attr("class", "axisSubtitle")
       .style("font-size", "13px")
       .attr("transform", "translate(" + padding + ",0)")
       .call(d3.axisLeft(yScale));

    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x", 0 - height / 1.4)
       .attr("dy", "1em")
       .text("Total Number Of Artists");


    // Lines
    svg.selectAll("myline")
       .data(fullDataset)
       .enter()
       .append("line")
       .attr("x1", function(d) { return xScale(d.decade); })
       .attr("x2", function(d) { return xScale(d.decade); })
       .attr("y1", function(d) { return yScale(d.total); })
       .attr("y2", yScale(0))
       .attr("stroke", "grey");

// Circles
    svg.selectAll("mycircle")
       .data(fullDataset)
       .enter()
       .append("circle")
       .attr("cx", function(d) { return xScale(d.decade); })
       .attr("cy", function(d) { return yScale(d.total); })
       .attr("r", radius)
       .style("fill", "steelblue")
       .attr("stroke", "black")

}

// // A function that create / update the plot for a given variable:
// function update(selectedVar) {

//     var data = data1;

//     // X axis
//     x.domain(data.map(function(d) { return d.group; }))
//     xAxis.transition().duration(1000).call(d3.axisBottom(x))

//     // Add Y axis
//     y.domain([0, d3.max(data, function(d) { return +d[selectedVar] })]);
//     yAxis.transition().duration(1000).call(d3.axisLeft(y));

//     // variable u: map data to existing circle
//     var j = svg.selectAll(".myLine")
//         .data(data)
//         // update lines
//     j
//         .enter()
//         .append("line")
//         .attr("class", "myLine")
//         .merge(j)
//         .transition()
//         .duration(1000)
//         .attr("x1", function(d) { console.log(x(d.group)); return x(d.group); })
//         .attr("x2", function(d) { return x(d.group); })
//         .attr("y1", y(0))
//         .attr("y2", function(d) { return y(d[selectedVar]); })
//         .attr("stroke", "grey")


//     // variable u: map data to existing circle
//     var u = svg.selectAll("circle")
//         .data(data)
//         // update bars
//     u
//         .enter()
//         .append("circle")
//         .merge(u)
//         .transition()
//         .duration(1000)
//         .attr("cx", function(d) { return x(d.group); })
//         .attr("cy", function(d) { return y(d[selectedVar]); })
//         .attr("r", 8)
//         .attr("fill", "#69b3a2");


// };

// // Initialize plot
// update('var1')