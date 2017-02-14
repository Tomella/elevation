import { Extent2d } from "../domain/extent2d";
import { GridElevationLoader } from "../geotiff/gridelevationloader";

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
export class OpenStreetMapsLoader {
   private gridLoader: GridElevationLoader;

   constructor(public options: any) {
      this.gridLoader = new GridElevationLoader(options);
    }

   load(): Promise<number[][]> {
      return Promise.all( [this.gridLoader.load(), this.gridLoader.load()]).then(responseArr => {
         let response = [];
         /*
         let lastRow;
         responseArr.forEach((z, index) => {
            if (!(index % this.options.resolutionX)) {
               lastRow = [];
               response.push(lastRow);
            }
            lastRow.push(z);
         });*/
         return response;
      });
   }
}
