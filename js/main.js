// predicates of the events
export var dispatchClickBar = d3.dispatch("clickBar");
export var dispatchClickMap = d3.dispatch("clickMap");


// global variables
var width = 600;
var height = 400;
var padding = 60;

var decades;
var artists;
var svg_bar;
var svg_map
var dispatch;
var selectedBar;
var context = 0; // 0 - Reset; 1 - New; 2 - Old.
var dropdown;
var mapData;
var selectedCountry;  

// dispatch = d3.dispatch("click_bar", "click_map");

// get decade dataset
d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV6.csv").then(function(data2) {
        d3.json("dataset/countries-110m.json").then(function(data3) {
            decades = data1;
            artists = data2;
            mapData = data3;

            // gen_bar_chart();
            // gen_bubble_map();
            // addZoom();
            // prepare_event();
        })
    })
});

// Adding zoom to the map
// function addZoom() {
//     svg_map.call(d3.zoom()
//                .extent([
//                    [0,0], 
//                    [1000,1000],
//                 ])
//                 .scaleExtent([1,8])
//                 .on("zoom", zoomed)
//             );
// }

// // Applying the zoom
// function zoomed({ transform }) {
//     svg_map.selectAll("path")
//        .attr("transform", transform);
// }





/**************************
 * gen_bar_chart()
 *  -creates a bar chart
 *************************/

// function gen_bar_chart() {

//     // dropdown = d3.select("#selectbutton").select("#mySelect");
//     // dropdown.on("change", function(){
//     //     var selected = this.value;
//     //     updateBarPlot(selected);
//     // });

//     // filtering data
//     var filteredData = [];
//     var i,j;
//     // loop on artist dataset
//     for(i = 0; i < Object.keys(artists).length-1; i++) {    
//         var string = artists[i].genre;  // get genre string
//         var res = string.split(",");    // split it by commas
//         for(j = 0; j < res.length; j ++) {  // loop the splitted string
//             if(res[j] == "Pop") { 
//                 filteredData.push(artists[i]); }  // add to array 
//             }
//     }   
//     // sort data by popularity => bigger to smaller
//     filteredData.sort(function(a, b) { return b.popularitySpotify - a.popularitySpotify; });
//     // first 5 elements
//     filteredData.splice(5, filteredData.length);

//     // create X scale   => artists
//     var xScale = d3.scaleBand()
//                    .domain(filteredData.map(d => d.displayName))
//                    .range([padding, width - padding]);
//     xScale.paddingInner(0.5);


//     // create Y scale   => popularity
//     var yScale = d3.scaleLinear()
//               .domain([0, d3.max(filteredData, function(d) { return +d.popularitySpotify; })]) 
//               .range([height - padding, padding]); 


//     // create svg
//     svg_bar = d3.select("#barchart")  // call id in div
//                 .append("svg")          // append svg to the "id" div
//                 .attr("width", width)
//                 .attr("height", height)
//                 .attr("transform", "translate(" + width + "," + (-height) +")");   // move svg to the right

//     svg_bar.append("text")
//            .attr("x", (width / 2))             
//            .attr("y", height / 7 )
//            .attr("class", "title")  // para posterior CSS (se houver tempo eheh)
//            .attr("text-anchor", "middle")  
//            .style("font-size", "20px") 
//            .style("text-decoration", "underline")  
//            .text("Most Popular Bands");

//     var xAxis = d3.axisBottom()
//                   .scale(xScale);
  
//     svg_bar.append("g")
//            .attr("transform", "translate(0," + (height - padding) + ")")
//            .call(xAxis);

//     svg_bar.append("text")
//            .attr("transform", "translate(" + width/2.6 + "," + (height -padding / 3) + ")")
//            .text("Top Artists");

    
//     // y Axis
//     var yAxis = d3.axisLeft()
//                     .scale(yScale);

//     svg_bar.append("g")
//            .attr("transform", "translate(" + padding + ",0)")
//            .call(yAxis);

//     svg_bar.append("text")
//            .attr("transform", "rotate(-90)")
//            .attr("y", 0)
//            .attr("x", 0 - height / 1.5)
//            .attr("font-size", "16px")
//            .attr("dy", "1em")
//            .text("Popularity");

//     // create bars
//     svg_bar.selectAll("rect")
//        .data(filteredData)
//        .join("rect")
//        .attr("width", xScale.bandwidth())
//        .attr("height", d => (height - padding - yScale(d.popularitySpotify)))
//        .attr("fill", "steelblue")
//        .attr("x", function(d,i) { return xScale(d.displayName); })
//        .attr("y", function(d,i) { return yScale(d.popularitySpotify); })
//     //    .append("text")
//     //    .text(d => d.displayName)
//        .on("mouseover", function(event) {
//             // all bars on blue...
//             d3.selectAll("rect").attr("fill", "steelblue");
//             // ...except the one selected
//             d3.select(this).attr("fill", "green");
//         })
//         .on("mouseout", function(event) {
//             d3.selectAll("rect").attr("fill", "steelblue");
//         });
// }



/**************************
 * gen_bubble_map()
 *  -creates a bubble map
 *************************/

// function gen_bubble_map() {

//     // Map and projection
//     var projection = d3.geoEquirectangular()
//                        .scale(width / 1.3 / Math.PI)
//                        .translate([width / 2, height / 2]);

//     // Define map path
//     var path = d3.geoPath()
//                  .projection(projection);

//     // create svg
//     svg_map = d3.select("#bubblemap")  // call id in div
//             .append("svg")          // append svg to the "id" div
//             .attr("width", width)
//             .attr("height", height)
//             .attr("transform", "translate(" + (width*2) + "," + (-60 -  height) +")");

//     svg_map.selectAll("path")
//        .data(topojson.feature(mapData, mapData.objects.countries).features)
//        .enter()
//        .append("path")
//        .attr("fill", "steelblue")
//        .attr("d", path)
//        .attr("id", function(d, i) { return d.properties.name; })
//        .on("mouseover", function(event) {
//             // all countries on blue...
//             d3.select("path").attr("fill", "steelblue");
//             // ...except the one selected
//             d3.select(this).attr("fill", "green");
//         })
//         .on("mouseout", function(event) {
//             d3.select("path").attr("fill", "steelblue");
//         });
// }


function updateBarChart() {
}


function updateMap() {

}



// function prepare_event() {
//     dispatch = d3.dispatch("hover_bars", "hover_maps", "click_bar", "click_map");
    
//     // hovering bars
//     svg_bar.selectAll("rect").on("mouseover", function (event, d) {
//         dispatch.call("hover_bars", this, d);
//     });

//     // hovering maps
//     svg_map.selectAll("path").on("mouseover", function (event, d, i) {
//         dispatch.call("hover_maps", this, d);
//     });

//     // click bar
//     svg_bar.selectAll("rect").on("click", function(event, d) {
//         dispatch.call("click_bar", this, d);
//     })

//     // click map
//     svg_map.selectAll("path").on("click", function (event, d, i) {
//         dispatch.call("click_map", this, d);
//     });

//     // hover bar chart
//     dispatch.on("hover_bars", function(band){

//         if(selectedBar != null) {
//             selectedBar.attr("fill", "steelblue");
//         }

//         selectedBar = svg_bar.selectAll("rect").filter(function(d){
//             return d.displayName == band.displayName;
//         })

//         selectedBar.attr("fill", "green");

//     });

//     // hover map 
//     dispatch.on("hover_maps", function(country){
  
//         if(selectedCountry != null) {
//             selectedCountry.attr("fill", "steelblue");
//         }

//         selectedCountry = svg_map.selectAll("path").filter(function(d, i){
//             return d.properties.name == country.properties.name;
//         })
  
//         selectedCountry.attr("fill", "green");
//     });


//     // click bar
//     // dispatch.on("click_bar", function(artist) {

//     //     // put bar red
//     //     if(selectedBar != null) {
//     //         selectedBar.attr("fill", "steelblue")
//     //     }
        
//     //     selectedBar = svg_bar.selectAll("rect").filter(function(d){
//     //         return d.displayName == artist.displayName;
//     //     })

//     //     selectedBar.attr("fill", "red");

//     //     // update map: put the country
//     //     if(selectedCountry != null) {
//     //         selectedCountry.style("fill", "steelblue");
//     //     }

//     //     var country = artist.country;
//     //     console.log(artist.country);
//     //     svg_map.select("path#" + country).style("fill", "red");

//     // });



//     // click map
//     dispatch.on("click_map", function(country) {

//         updateMap();

//         // put map red
//         if(selectedCountry != null) {
//             selectedCountry.attr("fill", "steelblue");
//         }

//         selectedCountry = svg_map.selectAll("path").filter(function(d, i){
//             return d.properties.name == country.properties.name;
//         })

//         selectedCountry.attr("fill", "red");

//         // update bar chart
//         var filteredDataUpdate = [];
//         var i,j;
//         // loop on artist dataset
//         for(i = 0; i < Object.keys(artists).length-1; i++) {    
//             var string = artists[i].country;  // get genre string
//             var res = string.split(",");    // split it by commas
//             for(j = 0; j < res.length; j ++) {  // loop the splitted string
//                 if(res[j] == country.properties.name) { 
//                     filteredDataUpdate.push(artists[i]); }  // add to array 
//                 }
//         }   
//         // sort data by popularity => bigger to smaller
//         filteredDataUpdate.sort(function(a, b) { return b.popularitySpotify - a.popularitySpotify; });
//         // first 5 elements
//         if(filteredDataUpdate.length >= 5) {
//             filteredDataUpdate.splice(5, filteredDataUpdate.length);
//         }
//         else{
//             filteredDataUpdate.splice(filteredDataUpdate.length, filteredDataUpdate.length)
//         }

//         // create X scale   => artists
//         var xscale = d3.scaleBand()
//                     .domain(filteredDataUpdate.map(d => d.displayName))
//                     .range([padding, width - padding]);
//                     xscale.paddingInner(0.5);


//         // create Y scale   => popularity
//         var yscale = d3.scaleLinear()
//                 .domain([0, d3.max(filteredDataUpdate, function(d) { return +d.popularitySpotify; })]) 
//                 .range([height - padding, padding]); 

//         selectedBar = filteredDataUpdate.filter(function(d){
//             return d.country == country.properties.name;
//         });
        
//         // console.log(filteredData);

//         selectedBar = svg_bar.selectAll("rect")
//                              .data(filteredDataUpdate)
//                              .join("rect")
//                              .transition()
//                              .duration(1000)
//                              .attr("width", xscale.bandwidth())
//                              .attr("height", function(d, i) { return (height - padding - yscale(filteredDataUpdate[i].popularitySpotify)); })
//                              .attr("fill", "steelblue")
//                              .attr("x", function(d, i) { return xscale(selectedBar[i].displayName); })
//                              .attr("y", function(d, i) { return yscale(selectedBar[i].popularitySpotify); })

    
//         xAxis.transition()
//              .duration(1000)
//              .call(d3.axisBottom(xscale));
                            
//     });
// }