// Theme: Music Evolution Through Decades

// import colors from main
import { genreColor } from "./main.js";

// import tooltip
import { toolTip } from "./main.js";

// import reset button
import { dispatchReset } from "./main.js";

// events
import { dispatchClickLine_Bar } from "./main.js";
import { dispatchClickLine_Lollipop } from "./main.js";
import { dispatchClickLine_Net } from "./main.js";

import { dispatchClickMap_Line } from "./main.js";
import { dispatchClickNet_Line } from "./main.js";
import { dispatchClickBar_Line } from "./main.js";


// all genres; they never change
const genres= ["Avant-garde", "Blues", "Caribbean and Caribbean-influenced", "Comedy",
"Country", "Easy listening", "Electronic", "Folk", "Heavy metal", "Hip hop", "House",
"Jazz", "Latin", "Pop", "Punk rock", "R&B and soul", "Rock"];

// global variables
var width = 600;
var height = 400;
var padding = 60;
var decades;    // dataset 1
var artists;    // dataset 2
var popularity; // dataset 3
var xScale;     // x scale
var yScale      // y scale
var lines;      // lines of line chart
var xScaleDataFiltered;

var svg;
var xAxis;
var yAxis;

var opacityOn = 0.2;    // when mouseover, other lines's opacity lows down
var opacityOff = 1;     // when mouseover, THIS line's opacity gets higher
var opacityNormal = 0.5;  // when mouseout, all lines return to normal


// all the lines
var lineAvant, lineBlues, lineCarib, lineComedy, lineCountry, lineEasy, lineElec, lineFolk, 
lineHeavy, lineHip, lineHouse, lineJazz, lineLatin, linePop, linePunk, lineRB, lineRock;

// get decade dataset
d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV7.csv").then(function(data2) {
        d3.csv("dataset/genDecPop.csv").then(function(data3) {
            decades = data1;
            artists = data2;
            popularity = data3;
            gen_line_chart();
        })
    })
});

// update lineplot when clicking on barchart
dispatchClickBar_Line.on("clickBar", function(artistSelected) {

    svg.selectAll("path").attr("class", "line-lineplot").remove();

    // get artist genres
    var artist;
    var genres;
    for(var i = 0; i < Object.keys(artists).length-1; i++) {
        if(artists[i].artist == artistSelected.artist) {
            artist = artists[i];
        }
    }
    genres = artist.genre.split(",");

    // get all popularities from the genres
    var aux = [];
    genres.forEach(function(genre) {
        for(var i = 0; i < Object.keys(popularity).length-1; i++) {
            if(popularity[i].genre == genre) {
                aux.push(popularity[i].popularity); // get all popularities on the array
            }
        }
    });

    // create Y scale
    var yscale = d3.scaleLinear()
                   .domain([0, d3.max(aux, function(d) { return d*100; })])
                   .range([height - padding, padding]);

    // get artists genres
    var genres = artistSelected.genre.split(",");

    lineAvant = lineBlues = lineCarib = lineComedy = lineCountry = 
    lineEasy = lineElec = lineFolk = lineHeavy = lineHip = lineHouse =
    lineJazz = lineLatin = linePop = linePunk = lineRB = lineRock = 
        d3.line()
          .x(d => xScale(d.decade))
          .y(d => yscale(d.popularity*100));

    // to draw the lines
    lines = svg.append("g");
    // animation
    var path;

    genres.forEach(function(genre){
        var genreArray = [];
        genreArray = getEvolution(genre);
        path = lines.append("path")
                    .data(genreArray)
                    .attr("class", "line-lineplot")
                    .attr("transform", "translate(" + 18 + ",0)")   // move lines to the right
                    .attr("d", function(d) {
                        if(genre === "Avant-garde") { return lineAvant(genreArray); }
                        if(genre === "Blues") { return lineBlues(genreArray); }
                        if(genre === "Caribbean and Caribbean-influenced") { return lineCarib(genreArray); }
                        if(genre === "Comedy") { return lineComedy(genreArray); }
                        if(genre === "Country") { return lineCountry(genreArray); }
                        if(genre === "Easy listening") { return lineEasy(genreArray); }
                        if(genre === "Electronic") { return lineElec(genreArray); }
                        if(genre === "Folk") { return lineFolk(genreArray); }
                        if(genre === "Heavy metal") { return lineHeavy(genreArray); }
                        if(genre === "Hip hop") { return lineHip(genreArray); }
                        if(genre === "House") { return lineHouse(genreArray); }
                        if(genre === "Jazz") { return lineJazz(genreArray); }
                        if(genre === "Latin") { return lineLatin(genreArray); }
                        if(genre === "Pop") { return linePop(genreArray); }
                        if(genre === "Punk rock") { return linePunk(genreArray); }
                        if(genre === "R&B and soul") { return lineRB(genreArray); }
                        if(genre === "Rock") { return lineRock(genreArray); }
                    })
                    .style("stroke", genreColor[genre])
                    .style("opacity", 0.5)
                    .on("mouseover", function(event, d) { 
                        // fade all lines...
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityOn);
                        // ...except the current one
                        d3.select(this)
                        .style("opacity", opacityOff);
                        // tooltip
                        const[x, y] = d3.pointer(event);
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0.9);
                        var text = genre;
                        toolTip.html(text)
                               .style("left", (x + width) + "px")
                               .style("top", (y + 40) + "px");
                    })
                    .on("mouseout", function(d) {
                        //return all bars' opacity to normal
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityNormal);
                        // tooltip off
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0);
                    })
                    .on("click", function(event, d) {  
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityOn);
                        // ...except the current one
                        d3.select(this)
                        .style("opacity", opacityOff);                  
                        dispatchClickLine_Bar.call("clickLine", this, d);
                        dispatchClickLine_Lollipop.call("clickLine", this, d);
                        dispatchClickLine_Net.call("clickLine", this, d);
                    });
        // animation
        path.attr("stroke-dasharray", width + " " + width)
            .attr("stroke-dashoffset", width)
            .transition()
            .duration(1000)
            .attr("stroke-dashoffset", 0);
    });
    xAxis.transition()
         .duration(1000)
         .call(d3.axisBottom(xScale));

    yAxis.transition()
         .duration(1000)
         .call(d3.axisLeft(yscale).ticks(5));
});


// update lineplot when clicking on map
dispatchClickMap_Line.on("clickMap", function(countrySelected) {

    svg.selectAll("path").attr("class", "line-lineplot").remove();

    // 1 - get all artists from countrySelected.properties.name
    var filteredDataUpdate = [];
    var i;
    // loop on artist dataset
    for(i = 0; i < Object.keys(artists).length-1; i++) {    
        var string = artists[i].country;  // get genre string
        if(string == countrySelected.properties.name) { 
            filteredDataUpdate.push(artists[i]);  // add to array 
        }
    }   

    // 2 - get all genres from each artists and put them in an array
    var selectedGenres = [];
    for(i = 0; i < filteredDataUpdate.length; i++) {
        var string = filteredDataUpdate[i].genre;
        var res = string.split(",");    // split it by commas
        for(var j = 0; j < res.length; j++) {
            if(!selectedGenres.includes(res[j])) {  // delete duplicated genres
                selectedGenres.push(res[j]);
            }
        }
    }

    // get all popularities from the genres
    var aux = [];
    genres.forEach(function(genre) {
        for(var i = 0; i < Object.keys(popularity).length-1; i++) {
            if(popularity[i].genre == genre) {
                aux.push(popularity[i].popularity); // get all popularities on the array
            }
        }
    });

    // create Y scale
    var yscale = d3.scaleLinear()
                   .domain([0, d3.max(aux, function(d) { return d*100; })])
                   .range([height - padding, padding]);


    lineAvant = lineBlues = lineCarib = lineComedy = lineCountry = 
    lineEasy = lineElec = lineFolk = lineHeavy = lineHip = lineHouse =
    lineJazz = lineLatin = linePop = linePunk = lineRB = lineRock = 
        d3.line()
          .x(d => xScale(d.decade))
          .y(d => yscale(d.popularity*100));
    
    // to draw all lines
    lines = svg.append("g");
    // animation
    var path;
    
    selectedGenres.forEach(function(genre){
        var genreArray = [];
        genreArray = getEvolution(genre);
        path = lines.append("path")
                    .data(genreArray)
                    .attr("class", "line-lineplot")
                    .attr("transform", "translate(" + 18 + ",0)")   // move lines to the right
                    .attr("d", function(d) {
                        if(genre === "Avant-garde") { return lineAvant(genreArray); }
                        if(genre === "Blues") { return lineBlues(genreArray); }
                        if(genre === "Caribbean and Caribbean-influenced") { return lineCarib(genreArray); }
                        if(genre === "Comedy") { return lineComedy(genreArray); }
                        if(genre === "Country") { return lineCountry(genreArray); }
                        if(genre === "Easy listening") { return lineEasy(genreArray); }
                        if(genre === "Electronic") { return lineElec(genreArray); }
                        if(genre === "Folk") { return lineFolk(genreArray); }
                        if(genre === "Heavy metal") { return lineHeavy(genreArray); }
                        if(genre === "Hip hop") { return lineHip(genreArray); }
                        if(genre === "House") { return lineHouse(genreArray); }
                        if(genre === "Jazz") { return lineJazz(genreArray); }
                        if(genre === "Latin") { return lineLatin(genreArray); }
                        if(genre === "Pop") { return linePop(genreArray); }
                        if(genre === "Punk rock") { return linePunk(genreArray); }
                        if(genre === "R&B and soul") { return lineRB(genreArray); }
                        if(genre === "Rock") { return lineRock(genreArray); }
                    })
                    .style("stroke", genreColor[genre])
                    .style("opacity", 0.5)
                    .on("mouseover", function(event, d) { 
                        // fade all lines...
                        d3.selectAll(".line-lineplot")
                            .style("opacity", opacityOn);
                        // ...except the current one
                        d3.select(this)
                            .style("opacity", opacityOff);
                        // tooltip
                        const[x, y] = d3.pointer(event);
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0.9);
                               var text = genre;
                        toolTip.html(text)
                               .style("left", (x + width) + "px")
                               .style("top", (y + 40) + "px");
                    })
                    .on("mouseout", function(d) {
                        //return all bars' opacity to normal
                        d3.selectAll(".line-lineplot")
                            .style("opacity", opacityNormal);
                        // tooltip off
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0);
                    })
                    .on("click", function(event, d) {  
                        d3.selectAll(".line-lineplot")
                            .style("opacity", opacityOn);
                            // ...except the current one
                        d3.select(this)
                            .style("opacity", opacityOff);                  
                        dispatchClickLine_Bar.call("clickLine", this, d);
                        dispatchClickLine_Lollipop.call("clickLine", this, d);
                        dispatchClickLine_Net.call("clickLine", this, d);
                    });
        // animation
        path.attr("stroke-dasharray", width + " " + width)
            .attr("stroke-dashoffset", width)
            .transition()
            .duration(1000)
            .attr("stroke-dashoffset", 0);
    });
    xAxis.transition()
            .duration(1000)
            .call(d3.axisBottom(xScale));

    yAxis.transition()
            .duration(1000)
            .call(d3.axisLeft(yscale).ticks(5));

});


// update lineplot when clicking on network
dispatchClickNet_Line.on("clickNet", function(artistSelected) {

    svg.selectAll("path").attr("class", "line-lineplot").remove();

    // get artists genres
    var artist;
    var genres;
    for(var i = 0; i < Object.keys(artists).length-1; i++) {
        if(artists[i].artist == artistSelected.artist) {
            artist = artists[i];
        }
    }
    genres = artist.genre.split(",");

    // get all popularities from the genres
    var aux = [];
    genres.forEach(function(genre) {
        for(var i = 0; i < Object.keys(popularity).length-1; i++) {
            if(popularity[i].genre == genre) {
                aux.push(popularity[i].popularity); // get all popularities on the array
            }
        }
    });

    // create Y scale
    var yscale = d3.scaleLinear()
                   .domain([0, d3.max(aux, function(d) { return d*100; })])
                   .range([height - padding, padding]);

    lineAvant = lineBlues = lineCarib = lineComedy = lineCountry = 
    lineEasy = lineElec = lineFolk = lineHeavy = lineHip = lineHouse =
    lineJazz = lineLatin = linePop = linePunk = lineRB = lineRock = 
        d3.line()
          .x(d => xScale(d.decade))
          .y(d => yscale(d.popularity*100));

          // to draw the lines
    lines = svg.append("g");
    // animation
    var path;

    genres.forEach(function(genre){
        var genreArray = [];
        genreArray = getEvolution(genre);
        path = lines.append("path")
                    .data(genreArray)
                    .attr("class", "line-lineplot")
                    .attr("transform", "translate(" + 18 + ",0)")   // move lines to the right
                    .attr("d", function(d) {
                        if(genre === "Avant-garde") { return lineAvant(genreArray); }
                        if(genre === "Blues") { return lineBlues(genreArray); }
                        if(genre === "Caribbean and Caribbean-influenced") { return lineCarib(genreArray); }
                        if(genre === "Comedy") { return lineComedy(genreArray); }
                        if(genre === "Country") { return lineCountry(genreArray); }
                        if(genre === "Easy listening") { return lineEasy(genreArray); }
                        if(genre === "Electronic") { return lineElec(genreArray); }
                        if(genre === "Folk") { return lineFolk(genreArray); }
                        if(genre === "Heavy metal") { return lineHeavy(genreArray); }
                        if(genre === "Hip hop") { return lineHip(genreArray); }
                        if(genre === "House") { return lineHouse(genreArray); }
                        if(genre === "Jazz") { return lineJazz(genreArray); }
                        if(genre === "Latin") { return lineLatin(genreArray); }
                        if(genre === "Pop") { return linePop(genreArray); }
                        if(genre === "Punk rock") { return linePunk(genreArray); }
                        if(genre === "R&B and soul") { return lineRB(genreArray); }
                        if(genre === "Rock") { return lineRock(genreArray); }
                    })
                    .style("stroke", genreColor[genre])
                    .style("opacity", 0.5)
                    .on("mouseover", function(event, d) { 
                        // fade all lines...
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityOn);
                        // ...except the current one
                        d3.select(this)
                        .style("opacity", opacityOff);
                        // tooltip
                        const[x, y] = d3.pointer(event);
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0.9);
                        var text = genre;
                        toolTip.html(text)
                               .style("left", (x + width) + "px")
                               .style("top", (y + 40) + "px");
                    })
                    .on("mouseout", function(d) {
                        //return all bars' opacity to normal
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityNormal);
                        // tooltip off
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0);
                    })
                    .on("click", function(event, d) {  
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityOn);
                        // ...except the current one
                        d3.select(this)
                        .style("opacity", opacityOff);                  
                        dispatchClickLine_Bar.call("clickLine", this, d);
                        dispatchClickLine_Lollipop.call("clickLine", this, d);
                        dispatchClickLine_Net.call("clickLine", this, d);
                    });
        // animation
        path.attr("stroke-dasharray", width + " " + width)
            .attr("stroke-dashoffset", width)
            .transition()
            .duration(1000)
            .attr("stroke-dashoffset", 0);
    });
    xAxis.transition()
         .duration(1000)
         .call(d3.axisBottom(xScale));

    yAxis.transition()
         .duration(1000)
         .call(d3.axisLeft(yscale).ticks(5));
});


/**************************
 * gen_line_chart()
 *  -creates a line chart
 *************************/

function gen_line_chart() {

    // create svg
    svg = d3.select("#lineplot")  // call id in div
            .append("svg")        // append svg to the "id" div
            .attr("width", width)
            .attr("height", height);

    // create X scale data
    var xScaleData = decades.map((a) => a.decade);  // get all decades
    xScaleDataFiltered = [];    // aux
    xScaleData.forEach((c) => {     // forEach to remove duplicates, couldn't find another way
        if (!xScaleDataFiltered.includes(c)) {
            xScaleDataFiltered.push(c);
        }
    });
    xScaleDataFiltered.sort();  // sort from old to new

    // create X scale
    xScale = d3.scaleBand()
                    .domain(xScaleDataFiltered)
                    .range([padding, width - padding])
    xScale.paddingInner(0.5);   // separate elements


    // create X axis
    xAxis = svg.append("g")
        .attr("class", "axisSubtitle")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(d3.axisBottom(xScale));
    
    svg.append("text")
       .attr("class", "axisLabel")
       .attr("transform", "translate(" + width/2.2 + "," + (height -padding / 5) + ")")
       .text("Decades");

    // create Y scale
    yScale = d3.scaleLinear()
                    .domain([0, d3.max(popularity, function(d) { return d.popularity*100; })])
                    .range([height - padding, padding]);

    // create Y axis
    yAxis = svg.append("g")
               .attr("class", "axisSubtitle")
               .attr("transform", "translate(" + padding + ",0)")
               .call(d3.axisLeft(yScale).ticks(5));

    svg.append("text")
       .attr("class", "axisLabel")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x", 0 - height / 1.6)
       .attr("dy", "1em")
       .text("Popularity");

    // creating lines
    lineAvant = lineBlues = lineCarib = lineComedy = lineCountry = 
    lineEasy = lineElec = lineFolk = lineHeavy = lineHip = lineHouse =
    lineJazz = lineLatin = linePop = linePunk = lineRB = lineRock = 
        d3.line()
          .x(d => xScale(d.decade))
          .y(d => yScale(d.popularity*100));    // * 100 because we only have percentage 
    
    // for drawing all lines
    lines = svg.append("g");
    // for drawing animation
    var path;

    // adding lines
    genres.forEach(function (genre){
        var genreArray = [];
        genreArray = getEvolution(genre);
        path = lines.append("path")
                    .data(genreArray)
                    .attr("class", "line-lineplot")
                    .attr("transform", "translate(" + 18 + ",0)")   // move lines to the right
                    .attr("d", function(d) {
                        if(genre === "Avant-garde") { return lineAvant(genreArray); }
                        if(genre === "Blues") { return lineBlues(genreArray); }
                        if(genre === "Caribbean and Caribbean-influenced") { return lineCarib(genreArray); }
                        if(genre === "Comedy") { return lineComedy(genreArray); }
                        if(genre === "Country") { return lineCountry(genreArray); }
                        if(genre === "Easy listening") { return lineEasy(genreArray); }
                        if(genre === "Electronic") { return lineElec(genreArray); }
                        if(genre === "Folk") { return lineFolk(genreArray); }
                        if(genre === "Heavy metal") { return lineHeavy(genreArray); }
                        if(genre === "Hip hop") { return lineHip(genreArray); }
                        if(genre === "House") { return lineHouse(genreArray); }
                        if(genre === "Jazz") { return lineJazz(genreArray); }
                        if(genre === "Latin") { return lineLatin(genreArray); }
                        if(genre === "Pop") { return linePop(genreArray); }
                        if(genre === "Punk rock") { return linePunk(genreArray); }
                        if(genre === "R&B and soul") { return lineRB(genreArray); }
                        if(genre === "Rock") { return lineRock(genreArray); }
                    })
                    .style("stroke", genreColor[genre])
                    .style("opacity", 0.5)
                    .on("mouseover", function(event, d) { 
                        // fade all lines...
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityOn);
                        // ...except the current one
                        d3.select(this)
                        .style("opacity", opacityOff);
                        // tooltip
                        const[x, y] = d3.pointer(event);
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0.9);
                        var text = genre;
                        toolTip.html(text)
                               .style("left", (x + width) + "px")
                               .style("top", (y + 40) + "px");
                    })
                    .on("mouseout", function(d) {
                        //return all bars' opacity to normal
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityNormal);
                        // tooltip off
                        toolTip.transition()
                               .duration(500)
                               .style("opacity", 0);
                    })
                    .on("click", function(event, d) {  
                        d3.selectAll(".line-lineplot")
                        .style("opacity", opacityOn);
                        // ...except the current one
                        d3.select(this)
                        .style("opacity", opacityOff);                  
                        dispatchClickLine_Bar.call("clickLine", this, d);
                        dispatchClickLine_Lollipop.call("clickLine", this, d);
                        dispatchClickLine_Net.call("clickLine", this, d);
                    });
        // animation
        path.attr("stroke-dasharray", width + " " + width)
            .attr("stroke-dashoffset", width)
            .transition()
            .duration(2000)
            .attr("stroke-dashoffset", 0);
    });
}


/**************************
 * getEvolution()
 *  - returns the popularity of a specific genre though decades
 *************************/
function getEvolution(genreName) {
    var popArray = [];
    for(var i = 0; i < Object.keys(popularity).length-1; i++) {
        if(popularity[i].genre == genreName) {
        popArray.push(popularity[i]);
        }
    }
    return popArray;
}



// function reset_button() {
// dispatchReset.on("reset", function() {

//     d3.select("#reset").on("click", function() {

//         svg.selectAll("path").attr("class", "line-lineplot").remove();

//         // create X scale data
//         var xScaleData = decades.map((a) => a.decade);  // get all decades
//         var xScaleDataFiltered = [];    // aux
//         xScaleData.forEach((c) => {     // forEach to remove duplicates, couldn't find another way
//             if (!xScaleDataFiltered.includes(c)) {
//                 xScaleDataFiltered.push(c);
//             }
//         });
//         xScaleDataFiltered.sort();  // sort from old to new

//         // create X scale
//         xScale = d3.scaleBand()
//                         .domain(xScaleDataFiltered)
//                         .range([padding, width - padding])
//                         // .padding(1);
//         xScale.paddingInner(0.5);   // separate elements


//         // create X axis
//         xAxis = svg.append("g")
//             .attr("class", "axisSubtitle")
//             .style("font-size", "13px")
//             .attr("transform", "translate(0," + (height - padding) + ")")
//             .call(d3.axisBottom(xScale));


//         // create Y scale
//         yScale = d3.scaleLinear()
//                    .domain([0, 30])
//                    .range([height - padding, padding]);

//         // create Y axis
//         yAxis = svg.append("g")
//                    .attr("class", "axisSubtitle")
//                    .style("font-size", "13px")
//                    .attr("transform", "translate(" + padding + ",0)")
//                    .call(d3.axisLeft(yScale).ticks(5));   
                   
                   

//         // creating lines
//         lineAvant = lineBlues = lineCarib = lineComedy = lineCountry = 
//         lineEasy = lineElec = lineFolk = lineHeavy = lineHip = lineHouse =
//         lineJazz = lineLatin = linePop = linePunk = lineRB = lineRock = 
//             d3.line()
//             .x(d => xScale(d.decade))
//             .y(d => yScale(d.popularity*100));    // * 100 because we only have percentage 

//             // Tooltip
//         // const toolTip = svg.append("g")
//         //                   .attr("class", "tooltip")
//         //                   .style("opacity", 0);
            
//         lines = svg.append("g");

//         // adding lines
//         genres.forEach(function (genre){
//             var genreArray = [];
//             genreArray = getEvolution(genre);
//             lines.append("path")
//                     .data(genreArray)
//                     .attr("class", "line-lineplot")
//                     .attr("d", function(d) {
//                         if(genre === "Avant-garde") { return lineAvant(genreArray); }
//                         if(genre === "Blues") { return lineBlues(genreArray); }
//                         if(genre === "Caribbean and Caribbean-influenced") { return lineCarib(genreArray); }
//                         if(genre === "Comedy") { return lineComedy(genreArray); }
//                         if(genre === "Country") { return lineCountry(genreArray); }
//                         if(genre === "Easy listening") { return lineEasy(genreArray); }
//                         if(genre === "Electronic") { return lineElec(genreArray); }
//                         if(genre === "Folk") { return lineFolk(genreArray); }
//                         if(genre === "Heavy metal") { return lineHeavy(genreArray); }
//                         if(genre === "Hip hop") { return lineHip(genreArray); }
//                         if(genre === "House") { return lineHouse(genreArray); }
//                         if(genre === "Jazz") { return lineJazz(genreArray); }
//                         if(genre === "Latin") { return lineLatin(genreArray); }
//                         if(genre === "Pop") { return linePop(genreArray); }
//                         if(genre === "Punk rock") { return linePunk(genreArray); }
//                         if(genre === "R&B and soul") { return lineRB(genreArray); }
//                         if(genre === "Rock") { return lineRock(genreArray); }
//                     })
//                     .style("stroke", genreColor[genre])
//                     .on("mouseover", function(d) { 
//                         // fade all lines...
//                         d3.selectAll(".line-lineplot")
//                         .style("opacity", opacityOn);
//                         // ...except the current one
//                         d3.select(this)
//                         .style("opacity", opacityOff);
//                         // tooltip
//                         // toolTip.transition()
//                         //        .style("opacity", 0.9);
//                         //        var text = "Genre: " + genre;
//                         // toolTip.html(text);
//                             //    .style("left", (event.pageX) + "px")
//                             //    .style("top", (event.pageY - 28) + "px");
//                     })
//                     .on("mouseout", function(d) {
//                         //return all bars' opacity to normal
//                         d3.selectAll(".line-lineplot")
//                         .style("opacity", opacityNormal);
//                         // tooltip off
//                         // toolTip.transition()
//                         //        .duration(500)
//                         //        .style("opacity", 0);
//                     })
//                     .on("click", function(event, d) {  
//                         d3.selectAll(".line-lineplot")
//                         .style("opacity", opacityOn);
//                         // ...except the current one
//                         d3.select(this)
//                         .style("opacity", opacityOff);                  
//                         dispatchClickLine_Bar.call("clickLine", this, d);
//                         dispatchClickLine_Lollipop.call("clickLine", this, d);
//                     });
//         });
//     });
// });