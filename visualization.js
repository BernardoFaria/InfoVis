// Theme: Music Evolution Through Decades

// global variables
var width = 500;
var height = 300;
var padding = 60;

// get decade dataset
d3.csv("decade.csv").then(function(data1) {
    d3.csv("artistV5.csv").then(function(data2) {
        decades = data1;
        artists = data2;

        gen_line_chart();
    })
});

/**************************
 * gen_line_chart() 
 *  -creates a line chart 
 *************************/

 function gen_line_chart() {

    // create svg
    var svg = d3.select("#line_chart")  // call id in div
                .append("svg")          // append svg to the "id" div
                .attr("width", width)
                .attr("height", height)
                // .append("g")
                .attr("transform", "translate(" + width + ",0)");   // move svg to the right
    
    // genre scale
    var genreScale = artists.map((a) => a.genre);
    var rockScale = [];
    genreScale.forEach((c) => {
        if(!rockScale.includes(c)) {
            rockScale.push(c);
        }
    });
    console.log(rockScale);

    // create X scale data
    var xScaleData = decades.map((a) => a.decade);  // get all decades
    var xScaleDataFiltered = [];    // aux
    xScaleData.forEach((c) => {     // forEach to remove duplicates, couldn't find another way
        if (!xScaleDataFiltered.includes(c)) {
            xScaleDataFiltered.push(c);
        }
    });
    xScaleDataFiltered.sort();  // sort from old to new

    // create X scale
    var xScale = d3.scaleBand()
                   .domain(xScaleDataFiltered)
                   .range([padding, width - padding]);
    xScale.paddingInner(0.5);   // separate elements

    // create X axis
    svg.append("g")
       .attr("transform", "translate(0," + (height - padding) + ")")
       .call(d3.axisBottom(xScale));


    // create Y scale
    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(artists, function(d) { return +d.popularitySpotify; })])  // the + sign adds 100 to the axis
                   .range([height - padding, padding]);
    
    // create Y axis
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(d3.axisLeft(yScale));


    // Add one line
    svg.append("path")
      .datum(artists, decades)   // the population is on this dataset
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return xScale(d.decade) })
        .y(function(d) { return yScale(d.popularitySpotify) })
        );
}
