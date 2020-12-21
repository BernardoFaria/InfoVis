// Theme: Music Evolution Through Decades

// import reset button
import { dispatchReset_Bar } from "./main.js";
import { dispatchReset_Line } from "./main.js";
import { dispatchReset_Lollipop } from "./main.js";
import { dispatchReset_Map } from "./main.js";
import { dispatchReset_Network } from "./main.js";

// get reset button
document.getElementById("reset").addEventListener("click", function() {
    callResetDispatch();
  });

// function to call dispatches
function callResetDispatch(){
    //alert grouped bars to change
    dispatchReset_Bar.call("reset");
    dispatchReset_Line.call("reset");
    dispatchReset_Lollipop.call("reset");
    dispatchReset_Map.call("reset");
    dispatchReset_Network.call("reset");
}
