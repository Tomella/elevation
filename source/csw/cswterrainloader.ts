import { CswUrlOptions } from "./cswurloptions";
import { TerrainLoader } from "../geotiff/terrainloader";

export class CswTerrainLoader {
   constructor(public template: string, public bbox: number[], public resolutionX: number = 500, public resolutionY?: number) {
   }

   load(): Promise<number[]> {
      let cswUrlOptions = new CswUrlOptions(this.template, this.bbox, {resolutionX: this.resolutionX, resoltionY: this.resolutionY});
      let loader = new TerrainLoader(cswUrlOptions);
      return loader.load();
   }
}