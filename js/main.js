// reset button
export var dispatchReset_Bar = d3.dispatch("reset");
export var dispatchReset_Line = d3.dispatch("reset");
export var dispatchReset_Lollipop = d3.dispatch("reset");
export var dispatchReset_Map = d3.dispatch("reset");
export var dispatchReset_Network = d3.dispatch("reset");

// events names: dispatch[where it comes]_[where it goes]
// events when clicking bar chart
export var dispatchClickBar_Map = d3.dispatch("clickBar");
export var dispatchClickBar_Line = d3.dispatch("clickBar");
export var dispatchClickBar_Lollipop = d3.dispatch("clickBar");
export var dispatchClickBar_Net = d3.dispatch("clickBar");

// events when clicking map
export var dispatchClickMap_Bar = d3.dispatch("clickMap");
export var dispatchClickMap_Line = d3.dispatch("clickMap");
export var dispatchClickMap_Lollipop = d3.dispatch("clickMap");
export var dispatchClickMap_Net = d3.dispatch("clickMap");

// events when clicking linechart
export var dispatchClickLine_Bar = d3.dispatch("clickLine");
export var dispatchClickLine_Lollipop = d3.dispatch("clickLine");
export var dispatchClickLine_Net = d3.dispatch("clickLine");
export var dispatchClickLine_Map = d3.dispatch("clickLine");

// events when clicking network
export var dispatchClickNet_Line = d3.dispatch("clickNet");
export var dispatchClickNet_Bar = d3.dispatch("clickNet");
export var dispatchClickNet_Map = d3.dispatch("clickNet");
export var dispatchClickNet_Lollipop = d3.dispatch("clickNet");

export var tooltipDuration = 150;
// Helps to select the div for the tooltip
export const toolTip = d3.select("body")
                         .append("div")
                         .attr("class", "tooltip")
                         .style("opacity", 0)
                          .style("visibility", "hidden");


// color scheme for each genre
export const genreColor = {
    "Avant-garde": "#ff0000", // bright red
    "Blues": "#ae0000", // dark red

    "Caribbean and Caribbean-influenced": "#ffae00", // bright orange
    "Comedy": "#ba7f00",    // dark orange

    "Country": "#fffb06",   // bright yellow
    "Easy listening": "#b0ad00",    // dark yellow

    "Electronic": "#6cff00",    // bright green
    "Folk": "#3f9500",  // dark green

    "Heavy metal": "#00fff7",   // bright water blue
    "Hip hop": "#009e99",   // water blue

    "House": "#0061ff", // bright blue
    "Jazz": "#003995",  // dark blue

    "Latin": "#ff00f3", // brigh purple
    "Pop": "#9a0093",   // dark purple

    "Punk rock": "#ff009b", // bright magenta
    "R&B and soul": "#830050",  // dark magenta

    "Rock": "#ffffff",  // white
};

export const countries = ["Australia", "Austria", /*"Barbados",*/ "Canada", "Colombia", "Cuba", "Denmark", "France", "Germany", "India", "Ireland",
                            "Italy", "Jamaica", "Japan", "Netherlands", "Norway", "Puerto Rico", "Russia", "South Korea", "Spain", "Sweden",
                            "Trinidad and Tobago", "Tunisia", "United Kingdom", "United States of America"];
