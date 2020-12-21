// Theme: Music Evolution Through Decades

// events
import { dispatchClickBar_Lollipop } from "./main.js";
import { dispatchClickLine_Lollipop } from "./main.js";
import { dispatchClickMap_Lollipop } from "./main.js";
import { dispatchClickNet_Lollipop } from "./main.js";

// tooltip
import { toolTip } from "./main.js";

// global variables
var width = 600;
var height = 400;
var padding = 60;
var radius = 6;
var xScale;
var yScale;
var fullDataset;
var svg;
var yAxis;


// datasets variables
var artists;

var auxDec = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010];  // aux with all decades
var id_line = [0,1,2,3,4,5,6,7,8,9,10,11];  // id's for lollipop's lines
var id_circle = [12,13,14,15,16,17,18,19,20,21,22,23]; // id's for lollipop's circles ; + 12


d3.csv("dataset/artistV7.csv").then(function(data) {
   artists = data;
   gen_lollipop();
});


// update lollipop when clicking on barchart
dispatchClickBar_Lollipop.on("clickBar", function(artistSelected) {

   var flagVec = [0,0,0,0,0,0,0,0,0,0,0,0];    // couldn't find a better way again
    
   if (artistSelected.creationDate >= 1900 && artistSelected.creationDate < 1910) { flagVec[0]++; }
   if (artistSelected.creationDate >= 1910 && artistSelected.creationDate < 1920) { flagVec[1]++; }
   if (artistSelected.creationDate >= 1920 && artistSelected.creationDate < 1930) { flagVec[2]++; }
   if (artistSelected.creationDate >= 1930 && artistSelected.creationDate < 1940) { flagVec[3]++; }
   if (artistSelected.creationDate >= 1940 && artistSelected.creationDate < 1950) { flagVec[4]++; }
   if (artistSelected.creationDate >= 1950 && artistSelected.creationDate < 1960) { flagVec[5]++; }
   if (artistSelected.creationDate >= 1960 && artistSelected.creationDate < 1970) { flagVec[6]++; }
   if (artistSelected.creationDate >= 1970 && artistSelected.creationDate < 1980) { flagVec[7]++; }
   if (artistSelected.creationDate >= 1980 && artistSelected.creationDate < 1990) { flagVec[8]++; }
   if (artistSelected.creationDate >= 1990 && artistSelected.creationDate < 2000) { flagVec[9]++; }
   if (artistSelected.creationDate >= 2000 && artistSelected.creationDate < 2010) { flagVec[10]++; }
   if (artistSelected.creationDate >= 2010 && artistSelected.creationDate < 2020) { flagVec[11]++; }

   var idAux = flagVec.indexOf(1)

   // all lines black...
   svg.selectAll("line").attr("class", "lines-lollipop").style("stroke", "#606060");
   // ...except the one selected
   svg.select("#_" + idAux).attr("class", "lines-lollipop").style("stroke", "#A0A0A0");  //.style("stroke", "#444444");
   // all circles black...
   svg.selectAll("circle").attr("class", "circle-lollipop").style("stroke", "#606060").style("fill", "#606060");  //.style("stroke", "#a9a9a9").style("fill", "#a9a9a9");
   // ...except the one selected
   svg.select("#_" + (idAux + 12)).attr("class", "circle-lollipop").style("stroke", "#A0A0A0").style("fill", "#A0A0A0");    //.style("stroke", "#444444").style("fill", "#444444");

   // tooltip
   svg.select("#_" + idAux)
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
               .duration(500)
               .style("opacity", 0.9);
         var text = artistSelected.displayName + " Creation Date: " + artistSelected.creationDate;
         toolTip.html(text)
               .style("left", (x + width*2) + "px")
               .style("top", (y + 470) + "px");
      })
      .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

   svg.select("#_" + (idAux + 12))
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
               .duration(500)
               .style("opacity", 0.9);
         var text = artistSelected.displayName + " Creation Date: " + artistSelected.creationDate;
         toolTip.html(text)
               .style("left", (x + width*2) + "px")
               .style("top", (y + 470) + "px");
      })
      .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

});


// update lollipop when clicking on lineplot
dispatchClickLine_Lollipop.on("clickLine", function(genreSelected) {

   svg.selectAll("line").attr("class", "lines-lollipop").remove();
   svg.selectAll("circle").attr("class", "circle-lollipop").remove();

   var filteredDataUpdate = [];
   var i, j;
   // loop on artist dataset
   for(i = 0; i < Object.keys(artists).length-1; i++) {    
      var string = artists[i].genre; 
      var res = string.split(",");    // split genres it by commas
      for(j = 0; j < res.length; j ++) {  // loop the splitted string
         if(res[j] == genreSelected.genre) { 
               filteredDataUpdate.push(artists[i]);  // add to array 
         }
      }
   }  

   // get total artists per decade
   var getTotalArtists = [0,0,0,0,0,0,0,0,0,0,0,0];    // couldn't find a better way
   for(var i = 0; i < Object.keys(filteredDataUpdate).length; i++) {    
      if (filteredDataUpdate[i].creationDate >= 1900 && filteredDataUpdate[i].creationDate < 1910) { getTotalArtists[0]++; }
      if (filteredDataUpdate[i].creationDate >= 1910 && filteredDataUpdate[i].creationDate < 1920) { getTotalArtists[1]++; }
      if (filteredDataUpdate[i].creationDate >= 1920 && filteredDataUpdate[i].creationDate < 1930) { getTotalArtists[2]++; }
      if (filteredDataUpdate[i].creationDate >= 1930 && filteredDataUpdate[i].creationDate < 1940) { getTotalArtists[3]++; }
      if (filteredDataUpdate[i].creationDate >= 1940 && filteredDataUpdate[i].creationDate < 1950) { getTotalArtists[4]++; }
      if (filteredDataUpdate[i].creationDate >= 1950 && filteredDataUpdate[i].creationDate < 1960) { getTotalArtists[5]++; }
      if (filteredDataUpdate[i].creationDate >= 1960 && filteredDataUpdate[i].creationDate < 1970) { getTotalArtists[6]++; }
      if (filteredDataUpdate[i].creationDate >= 1970 && filteredDataUpdate[i].creationDate < 1980) { getTotalArtists[7]++; }
      if (filteredDataUpdate[i].creationDate >= 1980 && filteredDataUpdate[i].creationDate < 1990) { getTotalArtists[8]++; }
      if (filteredDataUpdate[i].creationDate >= 1990 && filteredDataUpdate[i].creationDate < 2000) { getTotalArtists[9]++; }
      if (filteredDataUpdate[i].creationDate >= 2000 && filteredDataUpdate[i].creationDate < 2010) { getTotalArtists[10]++; }
      if (filteredDataUpdate[i].creationDate >= 2010 && filteredDataUpdate[i].creationDate < 2020) { getTotalArtists[11]++; }
   }
   // join [decade, totalArtists]
   fullDataset = getTotalArtists.map(function(d, i) {
      return { 'decade' : auxDec[i], 'total' : getTotalArtists[i] };
   })

   // create Y scale
   var yscale = d3.scaleLinear()
              .domain([0, d3.max(fullDataset, function(d) { return +d.total; })]) 
              .range([height - padding, padding]);
   

   yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yscale));


   // Lines
   svg.selectAll("mylollipop")
      .data(fullDataset)
      .enter()
      .append("line")
      .attr("class", "lines-lollipop")
      .attr("x1", function(d) { return xScale(d.decade); })
      .attr("x2", function(d) { return xScale(d.decade); })
      .attr("y1", yscale(0))
      .attr("y2", yscale(0))
      .attr("id", function(d, i) { return "_" + id_line[i]; })
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
                .duration(500)
                .style("opacity", 0.9);
         var text = "Total Artists: " + d.total;
         toolTip.html(text)
                .style("left", (x + width*2) + "px")
                .style("top", (y + 470) + "px");
       })
       .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

   // Circles
   svg.selectAll("mycircle")
      .data(fullDataset)
      .enter()
      .append("circle")
      .attr("class", "circle-lollipop")
      .attr("cx", function(d) { return xScale(d.decade); })
      .attr("cy", yscale(0))
      .attr("r", radius)
      .attr("id", function(d, i) { return "_" + id_circle[i]; })
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
                .duration(500)
                .style("opacity", 0.9);
         var text = "Total Artists: " + d.total;
         toolTip.html(text)
                .style("left", (x + width*2) + "px")
                .style("top", (y + 470) + "px");
       })
       .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

   svg.selectAll(".lines-lollipop")
      .transition()
      .duration(1000)
      .attr("y1", function(d) { return yscale(d.total); });

  svg.selectAll(".circle-lollipop")
      .transition()
      .duration(1000)
      .attr("cy", function(d) { return yscale(d.total); });

});


// update lollipop when clicking on map
dispatchClickMap_Lollipop.on("clickMap", function(countrySelected) {

   svg.selectAll("line").attr("class", "lines-lollipop").remove();
   svg.selectAll("circle").attr("class", "circle-lollipop").remove();
   
   var filteredDataUpdate = [];
   // loop on artist dataset
   for(var i = 0; i < Object.keys(artists).length-1; i++) {    
      if(artists[i].country == countrySelected.properties.name) {   // get country
         filteredDataUpdate.push(artists[i]);  // add to array 
      }
   } 

   // 2 - buscar as datas de inicio
   // get total artists per decade
   var getTotalArtists = [0,0,0,0,0,0,0,0,0,0,0,0];    // couldn't find a better way
   for(var i = 0; i < Object.keys(filteredDataUpdate).length; i++) {  
      if (filteredDataUpdate[i].creationDate >= 1900 && filteredDataUpdate[i].creationDate < 1910) { getTotalArtists[0]++; }
      if (filteredDataUpdate[i].creationDate >= 1910 && filteredDataUpdate[i].creationDate < 1920) { getTotalArtists[1]++; }
      if (filteredDataUpdate[i].creationDate >= 1920 && filteredDataUpdate[i].creationDate < 1930) { getTotalArtists[2]++; }
      if (filteredDataUpdate[i].creationDate >= 1930 && filteredDataUpdate[i].creationDate < 1940) { getTotalArtists[3]++; }
      if (filteredDataUpdate[i].creationDate >= 1940 && filteredDataUpdate[i].creationDate < 1950) { getTotalArtists[4]++; }
      if (filteredDataUpdate[i].creationDate >= 1950 && filteredDataUpdate[i].creationDate < 1960) { getTotalArtists[5]++; }
      if (filteredDataUpdate[i].creationDate >= 1960 && filteredDataUpdate[i].creationDate < 1970) { getTotalArtists[6]++; }
      if (filteredDataUpdate[i].creationDate >= 1970 && filteredDataUpdate[i].creationDate < 1980) { getTotalArtists[7]++; }
      if (filteredDataUpdate[i].creationDate >= 1980 && filteredDataUpdate[i].creationDate < 1990) { getTotalArtists[8]++; }
      if (filteredDataUpdate[i].creationDate >= 1990 && filteredDataUpdate[i].creationDate < 2000) { getTotalArtists[9]++; }
      if (filteredDataUpdate[i].creationDate >= 2000 && filteredDataUpdate[i].creationDate < 2010) { getTotalArtists[10]++; }
      if (filteredDataUpdate[i].creationDate >= 2010 && filteredDataUpdate[i].creationDate < 2020) { getTotalArtists[11]++; }
   }
   // join [decade, totalArtists]
   fullDataset = getTotalArtists.map(function(d, i) {
      return { 'decade' : auxDec[i], 'total' : getTotalArtists[i] };
   })

   // 3 - construir lollipop 
   // create Y scale
   var yscale = d3.scaleLinear()
              .domain([0, d3.max(fullDataset, function(d) { return d.total; })]) 
              .range([height - padding, padding]);
   

   yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yscale));

   // Lines
   svg.selectAll("mylollipop")
      .data(fullDataset)
      .enter()
      .append("line")
      .attr("class", "lines-lollipop")
      .attr("x1", function(d) { return xScale(d.decade); })
      .attr("x2", function(d) { return xScale(d.decade); })
      .attr("y1", yscale(0))
      .attr("y2", yscale(0))
      .attr("id", function(d, i) { return "_" + id_line[i]; })
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
                .duration(500)
                .style("opacity", 0.9);
         var text = "Total Artists: " + d.total;
         toolTip.html(text)
                .style("left", (x + width*2) + "px")
                .style("top", (y + 470) + "px");
       })
       .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

   // Circles
   svg.selectAll("mycircle")
      .data(fullDataset)
      .enter()
      .append("circle")
      .attr("class", "circle-lollipop")
      .attr("cx", function(d) { return xScale(d.decade); })
      .attr("cy", yscale(0))
      .attr("r", radius)
      .attr("id", function(d, i) { return "_" + id_circle[i]; })
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
                .duration(500)
                .style("opacity", 0.9);
         var text = "Total Artists: " + d.total;
         toolTip.html(text)
                .style("left", (x + width*2) + "px")
                .style("top", (y + 470) + "px");
       })
       .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

   svg.selectAll(".lines-lollipop")
      .transition()
      .duration(1000)
      .attr("y1", function(d) { return yscale(d.total); });

  svg.selectAll(".circle-lollipop")
      .transition()
      .duration(1000)
      .attr("cy", function(d) { return yscale(d.total); });
})


// update lollipop when clicking on network
dispatchClickNet_Lollipop.on("clickNet", function(artistSelected) {

   // get artist from artists dataset
   var artist = [];
   for(var i = 0; i < Object.keys(artists).length-1; i++) {
      if(artists[i].artist == artistSelected.artist) {
         artist.push(artists[i]);
         break;
      }
   }

   var flagVec = [0,0,0,0,0,0,0,0,0,0,0,0];    // couldn't find a better way again
    
   if (artist[0].creationDate >= 1900 && artist[0].creationDate < 1910) { flagVec[0]++; }
   if (artist[0].creationDate >= 1910 && artist[0].creationDate < 1920) { flagVec[1]++; }
   if (artist[0].creationDate >= 1920 && artist[0].creationDate < 1930) { flagVec[2]++; }
   if (artist[0].creationDate >= 1930 && artist[0].creationDate < 1940) { flagVec[3]++; }
   if (artist[0].creationDate >= 1940 && artist[0].creationDate < 1950) { flagVec[4]++; }
   if (artist[0].creationDate >= 1950 && artist[0].creationDate < 1960) { flagVec[5]++; }
   if (artist[0].creationDate >= 1960 && artist[0].creationDate < 1970) { flagVec[6]++; }
   if (artist[0].creationDate >= 1970 && artist[0].creationDate < 1980) { flagVec[7]++; }
   if (artist[0].creationDate >= 1980 && artist[0].creationDate < 1990) { flagVec[8]++; }
   if (artist[0].creationDate >= 1990 && artist[0].creationDate < 2000) { flagVec[9]++; }
   if (artist[0].creationDate >= 2000 && artist[0].creationDate < 2010) { flagVec[10]++; }
   if (artist[0].creationDate >= 2010 && artist[0].creationDate < 2020) { flagVec[11]++; }

   var idAux = flagVec.indexOf(1)

   // all lines black...
   svg.selectAll("line").attr("class", "lines-lollipop").style("stroke", "#606060");
   // ...except the one selected
   svg.select("#_" + idAux).attr("class", "lines-lollipop").style("stroke", "#A0A0A0");  //.style("stroke", "#444444");
   // all circles black...
   svg.selectAll("circle").attr("class", "circle-lollipop").style("stroke", "#606060").style("fill", "#606060");  //.style("stroke", "#a9a9a9").style("fill", "#a9a9a9");
   // ...except the one selected
   svg.select("#_" + (idAux + 12)).attr("class", "circle-lollipop").style("stroke", "#A0A0A0").style("fill", "#A0A0A0");    //.style("stroke", "#444444").style("fill", "#444444");

   // tooltip
   svg.select("#_" + idAux)
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
               .duration(500)
               .style("opacity", 0.9);
         var text = artist[0].displayName + " Creation Date: " + artist[0].creationDate;
         toolTip.html(text)
               .style("left", (x + width*2) + "px")
               .style("top", (y + 470) + "px");
      })
      .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

   svg.select("#_" + (idAux + 12))
      .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
               .duration(500)
               .style("opacity", 0.9);
         var text = artist[0].displayName + " Creation Date: " + artist[0].creationDate;
         toolTip.html(text)
               .style("left", (x + width*2) + "px")
               .style("top", (y + 470) + "px");
      })
      .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

});


/**************************
 * gen_lollipop()
 *  -creates a lollipop chart
 *************************/
function gen_lollipop() {

    // create lollipop
    svg = d3.select("#lollipop")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

    // get total artists per decade
    var getTotalArtists = [0,0,0,0,0,0,0,0,0,0,0,0];    // couldn't find a better way
    for(var i = 0; i < Object.keys(artists).length-1; i++) {    
        if (artists[i].creationDate >= 1900 && artists[i].creationDate < 1910) { getTotalArtists[0]++; }
        if (artists[i].creationDate >= 1910 && artists[i].creationDate < 1920) { getTotalArtists[1]++; }
        if (artists[i].creationDate >= 1920 && artists[i].creationDate < 1930) { getTotalArtists[2]++; }
        if (artists[i].creationDate >= 1930 && artists[i].creationDate < 1940) { getTotalArtists[3]++; }
        if (artists[i].creationDate >= 1940 && artists[i].creationDate < 1950) { getTotalArtists[4]++; }
        if (artists[i].creationDate >= 1950 && artists[i].creationDate < 1960) { getTotalArtists[5]++; }
        if (artists[i].creationDate >= 1960 && artists[i].creationDate < 1970) { getTotalArtists[6]++; }
        if (artists[i].creationDate >= 1970 && artists[i].creationDate < 1980) { getTotalArtists[7]++; }
        if (artists[i].creationDate >= 1980 && artists[i].creationDate < 1990) { getTotalArtists[8]++; }
        if (artists[i].creationDate >= 1990 && artists[i].creationDate < 2000) { getTotalArtists[9]++; }
        if (artists[i].creationDate >= 2000 && artists[i].creationDate < 2010) { getTotalArtists[10]++; }
        if (artists[i].creationDate >= 2010 && artists[i].creationDate < 2020) { getTotalArtists[11]++; }
    }
    // join [decade, totalArtists]
    fullDataset = getTotalArtists.map(function(d, i) {
      return { 'decade' : auxDec[i], 'total' : getTotalArtists[i] };
    });

    // create X scale
    xScale = d3.scaleBand()
               .domain(auxDec)
               .range([padding, width - padding])
               .padding(1);

    // create X axis
    svg.append("g")
       .attr("class", "axisSubtitle")
       .attr("transform", "translate(0," + (height - padding) + ")")
       .call(d3.axisBottom(xScale));

    svg.append("text")
       .attr("class", "axisLabel")
       .attr("transform", "translate(" + width/2.2 + "," + (height -padding / 5) + ")")
       .text("Decades");

    // create Y scale
    yScale = d3.scaleLinear()
               .domain([0, d3.max(fullDataset, function(d) { return d.total; })])
               .range([height - padding, padding]);

    // create Y axis
    yAxis = svg.append("g")
               .attr("class", "axisSubtitle")
               .attr("transform", "translate(" + padding + ",0)")
               .call(d3.axisLeft(yScale));

    svg.append("text")
       .attr("class", "axisLabel")
       .attr("transform", "rotate(-90)")
       .attr("y", 0)
       .attr("x", 0 - height / 1.4)
       .attr("dy", "1em")
       .text("Total Number Of Artists");


    // Lines
    svg.selectAll("mylollipop")
       .data(fullDataset)
       .enter()
       .append("line")
       .attr("class", "lines-lollipop")
      //  .attr("transform", "translate(" + (-26) + ",0)")
       .attr("x1", function(d) { return xScale(d.decade); })
       .attr("x2", function(d) { return xScale(d.decade); })
       .attr("y1", yScale(0))
       .attr("y2", yScale(0))
       .attr("id", function(d, i) { return "_" + id_line[i]; })
       .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
                .duration(500)
                .style("opacity", 0.9);
         var text = "Total Artists: " + d.total;
         toolTip.html(text)
                .style("left", (x + width*2) + "px")
                .style("top", (y + 470) + "px");
       })
       .on("mouseout", function(event, d) {
         toolTip.transition()
                .duration(500)
                .style("opacity", 0);
      });

    // Circles
    svg.selectAll("mycircle")
       .data(fullDataset)
       .enter()
       .append("circle")
       .attr("class", "circle-lollipop")
      //  .attr("transform", "translate(" + (-26) + ",0)")
       .attr("cx", function(d) { return xScale(d.decade); })
       .attr("cy", yScale(0))
       .attr("r", radius)
       .attr("id", function(d, i) { return "_" + id_circle[i]; })
       .on("mouseover", function(event, d) {
         // tooltip
         const[x, y] = d3.pointer(event);
         toolTip.transition()
                .duration(500)
                .style("opacity", 0.9);
         var text = "Total Artists: " + d.total;
         toolTip.html(text)
                .style("left", (x + width*2) + "px")
                .style("top", (y + 470) + "px");
       })
       .on("mouseout", function(event, d) {
          toolTip.transition()
                 .duration(500)
                 .style("opacity", 0);
       });
      

   svg.selectAll(".lines-lollipop")
       .transition()
       .duration(2000)
       .attr("y1", function(d) { return yScale(d.total); });

   svg.selectAll(".circle-lollipop")
       .transition()
       .duration(2000)
       .attr("cy", function(d) { return yScale(d.total); });

}