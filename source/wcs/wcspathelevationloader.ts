import { Loader } from "../loaders/loader";
import { Event } from "../domain/event";
import { positionWithinBbox, densify, createBboxFromPoints, culledBbox } from "../utils/geojson2d";
import { WcsUrlOptions } from "./wcsurloptions";
import { Extent2d } from "../domain/extent2d";
import { TerrainLoader } from "../geotiff/terrainloader";

// A bit like a stream loader but it is all or nothing. It's up to the composer to turn it into a 2d array.
export class WcsPathElevationLoader extends Loader<GeoJSON.FeatureCollection<GeoJSON.Point>> {

   constructor(public options: any = {}) {
      super();
   }

   set path(path: number[]) {
      this.options.path = path;
   }

   load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>> {
      let bbox = createBboxFromPoints(this.options.path, this.options.buffer);
      let extent = this.options.extent ? this.options.extent : Extent2d.WORLD;
      // Better constrain it to the bounds. We expect others further down the food chain to check as well
      // But they don't return the culled value and we need to map our points.
      bbox = culledBbox(extent.toBbox(), bbox);
      let options = Object.assign({
         bbox: bbox,
         extent: extent,
         count: (this.options.count ? this.options.count : 500)
      },
         this.options
      );

      let densePath = densify(options.path, options.count ? options.count : 500);
      let lngMin = bbox[0];
      let latMax = bbox[3];
      let dx = bbox[2] - lngMin;
      let dy = latMax - bbox[1];

      let sideResolution = calcSides(options.count, dx / dy);

      options.resolutionX = sideResolution.x;
      options.resolutionY = sideResolution.y;

      return new TerrainLoader(new WcsUrlOptions(options))
         .load()
         .then((loaded: number[]) => {
            if (options.line) {
               return {
                  type: "Feature",
                  geometry: {
                     type: "LineString",
                     coordinates: densePath.map(pt => [pt[0], pt[1], toHeight(pt)])
                  }
               };
            }

            return {
               type: "FeatureCollection",
               features: densePath.map(pt => {
                  return {
                     type: "Feature",
                     geometry: {
                        type: "Point",
                        coordinates: [pt[0], pt[1], toHeight(pt)]
                     }
                  };
               })
            };


            function toHeight(coord) {
               let x = coord[0], y = coord[1], zeroX = lngMin, zeroY = latMax,
                  cellY = Math.round((zeroY - y) / dy * (sideResolution.y - 1)),
                  cellX = Math.round((x - zeroX) / dx * (sideResolution.x - 1)),
                  index = cellY * sideResolution.x + cellX;
                console.log("Cell x = " + cellX + ", y = " + cellY + " Index = " + index + ", value = " + loaded[index]);
               return loaded[index];
            }
         });
   }
}


function calcSides(diagonal, ar) {
   // x * x + ar * ar * x * x = diagonal * diagonal
   // (1 + ar * ar) * x * x = diagonal * diagonal
   // x * x = diagonal * diagonal / (1 + ar * ar)
   let y = Math.sqrt(diagonal * diagonal / (1 + ar * ar));
   return { y: Math.ceil(y), x: Math.ceil(y * ar) };
}