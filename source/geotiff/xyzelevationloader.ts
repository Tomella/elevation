import { Extent2d } from "../domain/extent2d";
import { Loader } from "../loaders/loader";
import { TerrainLoader } from "./terrainloader";
import { positionWithinBbox, culledBbox } from "../utils/geojson2d";
import { immediateDefer } from "../utils/defer";

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
export class XyzElevationLoader extends Loader<any[]> {
   private childLoader: TerrainLoader;
   resolutionX: number = 500;
   extent: Extent2d = Extent2d.WORLD;

   constructor(public options: any) {
      super();
      this.childLoader = new TerrainLoader(options);
   }

   load(): Promise<any[]> {
      let options = this.options;
      let template = this.options.template;
      let bbox = options.bbox;
      let deltaX = (bbox[2] - bbox[0]) / (options.resolutionX - 1);
      let deltaY = (bbox[3] - bbox[1]) / (options.resolutionY - 1);

      let top = bbox[3];
      let left = bbox[0];

      return this.childLoader.load().then(responseArr => {
         return responseArr.map(function (z, index) {
            let x = index % options.resolutionX;
            let y = Math.floor(index / options.resolutionX);
            return {
               x: left + x * deltaX,
               y: top - y * deltaY,
               z: z
            };
         });
      });
   }
}
