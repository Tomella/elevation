import { Loader } from "../loaders/loader";
import { PointElevationLoader } from "../geotiff/pointelevationloader";
import { CswPointOptions } from "./cswpointoptions";

export class CswPointElevationLoader extends Loader<number[]> {
   constructor(public template: string, public point: number[], public options: any = {}) {
      super();
   }

   load(): Promise<number[]> {
      let cswPointElevationOptions = Object.assign(new CswPointOptions(this.template, this.point), this.options);
      let loader = new PointElevationLoader(cswPointElevationOptions);
      return loader.load();
   }
}