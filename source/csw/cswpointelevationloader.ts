import { Loader } from "../loaders/loader";
import { PointElevationLoader } from "../geotiff/pointelevationloader";
import { CswPointOptions } from "./cswpointoptions";

export class CswPointElevationLoader extends Loader<number[]> {
   constructor(public options: any = {}) {
      super();
   }

   load(): Promise<number[]> {
      let cswPointElevationOptions = new CswPointOptions(this.options);
      let loader = new PointElevationLoader(cswPointElevationOptions);
      return loader.load();
   }
}