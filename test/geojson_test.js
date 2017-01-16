var Elevation = require("../dist/elevation");

// console.log(Elevation);

// var extent = new Elevation.Extent2d(127, -45, 134, -31);

// console.log(extent.toBbox());
// console.log(Elevation.Extent2d.AUSTRALIA.toBbox());

let line = [[120, 0], [122, 0], [124, 0], [125, 0], [126, 0], [128, 0], [129, 0], [130, 0]];

let count = 500; // So ten segments

let result = Elevation.densify(line, count);
console.log(JSON.stringify(result));
console.log("****************************");




//console.log(Elevation.calculateSegmentDetails(line));
