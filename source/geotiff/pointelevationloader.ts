import { Extent2d } from "../domain/extent2d";
import { TerrainLoader } from "./terrainloader";
import { positionWithinBbox } from "../utils/geojson2d";
import { immediateDefer } from "../utils/defer";

// Given a point, return a piint with the same x, y coordinates plus a z-coordinate as returned by the TerrainLoader
export class PointElevationLoader {

   constructor(public options: any) { }

   load(): Promise<GeoJSON.Position> {
      return new TerrainLoader(this.options)
        .load()
        .then((pointArray) => {
            return [this.options.point[0], this.options.point[1], pointArray[0]];
      });
   }
}
