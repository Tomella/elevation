import { WcsUrlOptions } from "./wcsurloptions";
import { GeojsonElevationLoader } from "../geotiff/geojsonelevationloader";

export class WcsGeoJsonLoader {
   constructor(public options: any = {}) {
   }

   load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>> {
      let wcsUrlOptions = new WcsUrlOptions(this.options);
      let loader = new GeojsonElevationLoader(wcsUrlOptions);
      return loader.load();
   }
}