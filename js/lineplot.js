// Theme: Music Evolution Through Decades

// global variables
var width = 500;
var height = 300;
var padding = 60;
var decades;
var artists;
var popularity;
var popArray = [];
var xScale;
var yScale
var line;



// get decade dataset
d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV5.csv").then(function(data2) {
        d3.csv("dataset/genDecPop.csv").then(function(data3) {
            decades = data1;
            artists = data2;
            popularity = data3;
            buildOptions();
            gen_line_chart();
           
            
            
            
        })
    })
});

function buildOptions(){
    var myDiv = document.getElementById("selectbutton");
    //Create array of options to be added
    var array = getGenresFiltered();
    //Create and append select list
    var selectList = document.createElement("select");
    selectList.setAttribute("id", "mySelect");
    myDiv.appendChild(selectList);

    //Create and append the options
    for (var i = 0; i < array.length; i++) {
        
        var option = document.createElement("option");
        option.setAttribute("value", array[i]);
        option.text = array[i];
        selectList.appendChild(option);
    }
}

function getGenresFiltered(){
    var genres = popularity.map((a) => a.genre)
    var genresFiltered = [];
    genres.forEach((c) => {     // forEach to remove duplicates, couldn't find another way
        if (!genresFiltered.includes(c)) {
            genresFiltered.push(c);
        }
    });
    genresFiltered.sort();
    return genresFiltered
}

/**************************
 * gen_line_chart()
 *  -creates a line chart
 *************************/

function gen_line_chart() {
    var dropdown = d3.select("#mySelect");
    dropdown.on("change", function(){
        var selected = this.value;
        updateLinePlot(selected);
     });

  // create svg
  var svg = d3.select("#lineplot")  // call id in div
              .append("svg")          // append svg to the "id" div
              .attr("width", width)
              .attr("height", height)
              .attr("transform", "translate(" + width + ",0)");   // move svg to the right

  svg.append("text")
     .attr("x", (width / 2))             
     .attr("y", height / 5 )
     .attr("class", "title")  // para posterior CSS (se houver tempo eheh)
     .attr("text-anchor", "middle")  
     .style("font-size", "20px") 
     .style("text-decoration", "underline")  
     .text("Genre Evolution");

  // // filtering data
  // var filteredData = [];
  // var i,j;
  // // loop on artist dataset
  // for(i = 0; i < Object.keys(artists).length-1; i++) {    
  //     var string = artists[i].genre;  // get genre string
  //     var res = string.split(",");    // split it by commas
  //     for(j = 0; j < res.length; j ++) {  // loop the splitted string
  //         if(res[j] == "Pop") { 
  //             filteredData.push(artists[i]); }  // add to array 
  //         }
  // }  

  // var popArtists = [];  // tem os artistas pop com décadas
  // var artistsName = filteredData.map((a) => a.artist);
  // for(i = 0; i < Object.keys(decades).length-1; i++) {
  //   for(j = 0; j < artistsName.length; j++) {
  //     if(decades[i].artist == artistsName[j]) {
  //       popArtists.push(decades[i]);
  //     }
  //   }
  // }
  // console.log(popArtists);

  // var popPopularity = [];
  // for(i = 0; i < popArtists.length; i++) {
  //   var name = popArtists[i].artist;
  //   for(j = 0; j < Object.keys(artists).length-1; j++) {
  //     if(artists[j].artist == name)
  //       popPopularity[i] = artists[j].popularitySpotify;
  //   }
  // }

  var popArray = [];
  console.log(popularity);
  for(var i = 0; i < Object.keys(popularity).length-1; i++) {
    if(popularity[i].genre == "Country") {
      popArray.push(popularity[i]);
    }
  }
  // console.log(popArray);
  // var finalArray = popularity.map(function(d){
  //   return { 'decade' : d.decade, 'popularity' : d.popularity*100 };
  // });

  // console.log(finalArray);
  


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
  xScale = d3.scaleBand()
                  .domain(xScaleDataFiltered)
                  .range([padding, width - padding]);
  xScale.paddingInner(0.5);   // separate elements

  // create X axis
  svg.append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(d3.axisBottom(xScale));
  
  svg.append("text")
      .attr("transform", "translate(" + width/2.2 + "," + (height -padding / 3) + ")")
      .text("Decades");


  // create Y scale
  yScale = d3.scaleLinear()
                 .domain([0, 40])
                  // .domain([0, d3.max(artists, function(d) { return +d.popularitySpotify; })])  // the + sign adds 100 to the axis
                  .range([height - padding, padding]);

  // create Y axis
  svg.append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(d3.axisLeft(yScale));

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - height / 1.5)
      .attr("dy", "1em")
      .text("Popularity");

  // Add one line
  line = svg.append("path")
     .datum(popArray)   // the population is on this dataset
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 1.5)
     .attr("d", d3.line()
     .x(function(d) { 
        return xScale(d.decade); })
     .y(function(d) { 
         return yScale(d.popularity*100); }));
    
     
     
}

function updateLinePlot(selectedGenre){
    // Create new data with selection
    var pop = []
    for(var i = 0; i < Object.keys(popularity).length-1; i++) {
            
        if(popularity[i].genre === selectedGenre) {
            pop.push(popularity[i]);
        }
    }
    var dataFilter = pop.map(function(d){
        console.log(pop)
        return {time: d.decade, value: d.popularity*100 };
    });
    var myColor = d3.scaleOrdinal()
   .domain(popularity)
   .range(d3.schemeSet2);
    // Give these new data to update line 
    line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return xScale(+d.time) })
            .y(function(d) { 
                
                return yScale(+d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGenre) })
    }



   
    
    

    
    

