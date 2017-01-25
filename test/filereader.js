var Elevation = require("../dist/elevation");

var loader = Elevation.FileLoader("filereader.js");

loader.addEventListener("data", (data) => {
   console.log(data);
});