// events when clicking bar chart
export var dispatchClickBar_Map = d3.dispatch("clickBar");
export var dispatchClickBar_Line = d3.dispatch("clickBar");
export var dispatchClickBar_Lollipop = d3.dispatch("clickBar");

// events when clicking map
export var dispatchClickMap_Bar = d3.dispatch("clickMap");
export var dispatchClickMap_Line = d3.dispatch("clickMap");

// events when clicking linechart
export var dispatchClickLine_Bar = d3.dispatch("clickLine");

// color scheme for each genre
export const genreColor = {
    "Avant-garde": "#ff0000", // light grey
    "Blues": "#ae0000", // brown

    "Caribbean and Caribbean-influenced": "#ffae00", // bright dark blue
    "Comedy": "#ba7f00",    // greenish blue

    "Country": "#fffb06",   // sand color
    "Easy listening": "#b0ad00",    // skin color

    "Electronic": "#6cff00",    // dark blue
    "Folk": "#3f9500",  // redish purple

    "Heavy metal": "#00fff7",   // green
    "Hip hop": "#009e99",   // orange

    "House": "#0061ff", // bright green
    "Jazz": "#003995",  // light purple

    "Latin": "#ff00f3", // light magenta
    "Pop": "#9a0093",   // magenta

    "Punk rock": "#ff009b", // greyish blue
    "R&B and soul": "#830050",  // purple

    "Rock": "#000000",  // black
};