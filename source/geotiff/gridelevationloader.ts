import { Extent2d } from "../domain/extent2d";
import { TerrainLoader } from "./terrainloader";

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
export class GridElevationLoader {
   private childLoader: TerrainLoader;

   constructor(public options: any) {
      this.childLoader = new TerrainLoader(options);
    }

   load(): Promise<number[][]> {
      return this.childLoader.load().then(responseArr => {
         let response = [];
         let lastRow;
         responseArr.forEach((z, index) => {
            if (!(index % this.options.resolutionX)) {
               lastRow = [];
               response.push(lastRow);
            }
            lastRow.push(z);
         });
         return response;
      });
   }
}
