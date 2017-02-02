import { WcsUrlOptions } from "./wcsurloptions";
import { TerrainLoader } from "../geotiff/terrainloader";

export class WcsTerrainLoader {
   constructor(public options: any = {}) {
   }

   load(): Promise<number[]> {
      let wcsUrlOptions = new WcsUrlOptions(this.options);
      let loader = new TerrainLoader(wcsUrlOptions);
      return loader.load();
   }
}