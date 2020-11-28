// Theme: Music Evolution Through Decades

// global variables
var width = 500;
var height = 300;
var padding = 60;

var innerRadius = 10;
var outerRadius = Math.min(width, height) / 2;  // goes from  the center to the border

var decades;
var artists;


// get decade dataset
d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV5.csv").then(function(data2) {
        decades = data1;
        artists = data2;

        gen_bar_chart();
    })
});


/**************************
 * gen_bar_chart()
 *  -creates a bar chart
 *************************/

function gen_bar_chart() {

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
                   .domain(filteredData.map(d => d.artist))
                   .range([padding, width - padding]);
    xScale.paddingInner(0.5);


    // create Y scale   => popularity
    var yScale = d3.scaleLinear()
              .domain([0, d3.max(filteredData, function(d) { return +d.popularitySpotify; })]) 
              .range([height - padding, padding]); 



    // create svg
    var svg = d3.select("#barchart")  // call id in div
                .append("svg")          // append svg to the "id" div
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + width + ",0)");


    // create bars
    svg.selectAll("rect")
       .data(filteredData)
       .join("rect")
       .attr("width", xScale.bandwidth())
       .attr("height", d => (height - padding - yScale(d.popularitySpotify)))
       .attr("fill", "red")
       .attr("x", function(d,i) { return xScale(d.artist); })
       .attr("y", function(d,i) { return yScale(d.popularitySpotify); })
       .append("text")
       .text(d => d.artist);
    
    
    // x Axis
    var xAxis = d3.axisBottom()
                  .scale(xScale);

    svg.append("g")
       .attr("transform", "translate(0," + (height - padding) + ")")
       .call(xAxis);
    
    svg.append("text")
       .attr("transform", "translate(" + width/2.6 + "," + (height -padding / 3) + ")")
       .text("Top 5 Artists");

    
    // y Axis
    var yAxis = d3.axisLeft()
                  .scale(yScale);
                //   .ticks(5);

    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis);

    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x", 0 - height / 1.5)
       .attr("dy", "1em")
       .text("Popularity");



    // Add bars
    // svg.append("g")
    //    .selectAll("path")
    //    .data(filteredData)
    //    .enter()
    //    .append("path")
    //    .attr("fill", "#69b3a2")
    //    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
    //                 .innerRadius(innerRadius)
    //                 // .outerRadius(function(d) { return y(d.popularitySpotify); })
    //                 .outerRadius(function(d) { return y(d.artist); })
    //                 .startAngle(function(d) { return xScale(d.artist); })
    //                 .endAngle(function(d) { return xScale(d.artist) + xScale.bandwidth(); })
    //                 .padAngle(0.01)
    //                 .padRadius(innerRadius));
    // console.log("cona");
}