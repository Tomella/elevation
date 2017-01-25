import { CswUrlOptions } from "./cswurloptions";
import { XyzElevationLoader } from "../geotiff/xyzelevationloader";

export class CswXyzLoader {
   constructor(public options: any) {
   }

   load(): Promise<number[][]> {
      let cswUrlOptions = new CswUrlOptions(this.options);
      let loader = new XyzElevationLoader(cswUrlOptions);
      return loader.load();
   }
}