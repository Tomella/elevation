import { CswUrlOptions } from "./cswurloptions";
import { GeojsonElevationLoader } from "../geotiff/geojsonelevationloader";

export class CswGeoJsonLoader {
   constructor(public template: string, public bbox: number[], public resolutionX: number = 500, public resolutionY?: number) {
   }

   load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>> {
      let cswUrlOptions = new CswUrlOptions(this.template, this.bbox, {resolutionX: this.resolutionX, resoltionY: this.resolutionY});
      let loader = new GeojsonElevationLoader(cswUrlOptions);
      return loader.load();
   }
}