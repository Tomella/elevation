import { Loader } from "../loaders/loader";
import { PointElevationLoader } from "../geotiff/pointelevationloader";
import { WcsPointOptions } from "./wcspointoptions";

export class WcsPointElevationLoader extends Loader<number[]> {
   constructor(public options: any = {}) {
      super();
   }

   set point(pt: number[]) {
      this.options.point = pt;
   }

   load(): Promise<number[]> {
      let wcsPointElevationOptions = new WcsPointOptions(this.options);
      let loader = new PointElevationLoader(wcsPointElevationOptions);
      return loader.load();
   }
}