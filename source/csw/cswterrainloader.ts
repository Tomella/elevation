import { CswUrlOptions } from "./cswurloptions";
import { TerrainLoader } from "../geotiff/terrainloader";

export class CswTerrainLoader {
   constructor(public options: any = {}) {
   }

   load(): Promise<number[]> {
      let cswUrlOptions = new CswUrlOptions(this.options);
      let loader = new TerrainLoader(cswUrlOptions);
      return loader.load();
   }
}