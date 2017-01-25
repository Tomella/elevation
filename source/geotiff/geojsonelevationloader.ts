import { Extent2d } from "../domain/extent2d";
import { Loader } from "../loaders/loader";
import { XyzElevationLoader } from "./xyzelevationloader";
import { positionWithinBbox, culledBbox } from "../utils/geojson2d";
import { immediateDefer } from "../utils/defer";

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
export class GeojsonElevationLoader extends Loader<GeoJSON.FeatureCollection<GeoJSON.Point>> {
   private childLoader: XyzElevationLoader;

   constructor(public options: any) {
      super();
      this.childLoader = new XyzElevationLoader(options);
   }

   load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>> {
      let options = this.options;
      let bbox = options.bbox;
      let deltaX = (bbox[2] - bbox[0]) / (options.resolutionX - 1);
      let deltaY = (bbox[3] - bbox[1]) / (options.resolutionY - 1);

      let bottom = bbox[1];
      let left = bbox[0];

      return this.childLoader.load().then(responseArr => {
         let response: GeoJSON.FeatureCollection<GeoJSON.Point> = {
            type: "FeatureCollection",
            bbox: [bbox[0], bbox[1], bbox[2], bbox[3]], // Quick clone
            features: responseArr.map((entry: any): GeoJSON.Feature<GeoJSON.Point> => {
               return {
                  type: "Feature",
                  properties: [],
                  geometry: {
                     type: "Point",
                     coordinates: [
                        entry.x,
                        entry.y,
                        entry.z
                     ]
                  }
               };
            })
         };
         return response;
      });
   }

   private calculateResolutionY(bbox: number[], resolutionX, resolutionY ?) {
      return resolutionY ? resolutionY : Math.round(resolutionX * (bbox[3] - bbox[1]) / (bbox[2] - bbox[0]));
   }
}
