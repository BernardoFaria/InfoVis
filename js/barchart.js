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
        // console.log(artists[1].genre);

        gen_bar_chart();
    })
});


/**************************
 * gen_bar_chart()
 *  -creates a bar chart
 *************************/

function gen_bar_chart() {

    // create svg
    var svg = d3.select("#barchart")  // call id in div
                .append("svg")          // append svg to the "id" div
                .attr("width", width)
                .attr("height", height)
                // .append("g")
                .attr("transform", "translate(" + width + ",0)");   // move svg


    // create X scale data => bands

    var xScaleDataFiltered = [];
    var i,j;
    for(i = 0; i < Object.keys(artists).length-1; i++) {    // loop on artist dataset
        var string = artists[i].genre;  // get genre string
        var res = string.split(",");    // split it by commas
        for(j = 0; j < res.length; j ++) {  // loop the splitted string
            if(res[j] == "Rock") { 
                xScaleDataFiltered.push(artists[i]); }  // add to array 
            }
    }   
    // console.log(xScaleDataFiltered);


    // create X scale   => artists
    var xScale = d3.scaleBand()
                   .domain(xScaleDataFiltered)
                   .range([0, 2*Math.PI]);


    // create Y scale => popularity
    var y = d3.scaleRadial()
              .range([innerRadius, outerRadius])   // Domain will be define later.
              .domain([0, d3.max(xScaleDataFiltered, function(d) { return +d.popularitySpotify; })]); // Domain of Y is from 0 to the max seen in the data


    // Add bars
    svg.append("g")
       .selectAll("path")
       .data(xScaleDataFiltered)
       .enter()
       .append("path")
       .attr("fill", "#69b3a2")
       .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d['popularitySpotify']); })
        .startAngle(function(d) { return xScale(d.artists); })
        .endAngle(function(d) { return xScale(d.artists) + xScale.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius));
    
}