import { CswUrlOptions } from "./cswurloptions";
import { GeojsonElevationLoader } from "../geotiff/geojsonelevationloader";

export class CswGeoJsonLoader {
   constructor(public options: any = {}) {
   }

   load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>> {
      let cswUrlOptions = new CswUrlOptions(this.options);
      let loader = new GeojsonElevationLoader(cswUrlOptions);
      return loader.load();
   }
}