// Theme: Music Evolution Through Decades


d3.csv("dataset/decade.csv").then(function(data1) {
    d3.csv("dataset/artistV5.csv").then(function(data2) {
        d3.csv("dataset/genDecPop.csv").then(function(data3) {
            decades = data1;
            artists = data2;
            popularity = data3;
            buildOptions();
            var dropdown = d3.select("#mySelect");
            dropdown.on("change", function() {
                var selected = this.value;
                updateLinePlot(selected);
                //update_bar();
            });
        })
    })
})



function update_bar() {
    var myDiv = d3.select("#selectButton").select("#mySelect");
    console.log(myDiv);
    if (myDiv) {
        d3.select("#selectbutton").on("change", function() {
            var doc = document.getElementsByTagName("select");
            var selected = doc.value;
            console.log(selected);
            updateBarPlot(selected);
        });
    };
}


function buildOptions() {
    var myDiv = document.getElementById("selectbutton");
    //Create array of options to be added
    var array = getGenresFiltered();
    //Create and append select list
    var selectList = document.createElement("select");
    selectList.setAttribute("id", "mySelect");
    selectList.setAttribute("class", "mySelects");
    myDiv.appendChild(selectList);

    //Create and append the options
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", array[i]);
        option.text = array[i];
        selectList.appendChild(option);
    };
}

function getGenresFiltered() {
    var genres = popularity.map((a) => a.genre);
    var genresFiltered = [];
    genres.forEach((c) => { // forEach to remove duplicates, couldn't find another way
        if (!genresFiltered.includes(c)) {
            genresFiltered.push(c);
        };
    });
    genresFiltered.sort();
    return genresFiltered;
}

function updateLinePlot(selectedGenre) {
    // Create new data with selection
    var pop = []
    for (var i = 0; i < Object.keys(popularity).length - 1; i++) {

        if (popularity[i].genre === selectedGenre) {
            pop.push(popularity[i]);
        }
    }
    var dataFilter = pop.map(function(d) {

        return { time: d.decade, value: d.popularity * 100 };
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

                return yScale(+d.value)
            })
        )
        .attr("stroke", function(d) { return myColor(selectedGenre) })
}