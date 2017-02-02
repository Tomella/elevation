import { WcsUrlOptions } from "./wcsurloptions";
import { XyzElevationLoader } from "../geotiff/xyzelevationloader";

export class WcsXyzLoader {
   constructor(public options: any) {
   }

   load(): Promise<number[][]> {
      let wcsUrlOptions = new WcsUrlOptions(this.options);
      let loader = new XyzElevationLoader(wcsUrlOptions);
      return loader.load();
   }
}