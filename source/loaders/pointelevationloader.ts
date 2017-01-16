import { Extent2d } from "../domain/extent2d";
import { TerrainLoader } from "./terrainloader";
import { positionWithinBbox } from "../utils/geojson2d";
import { immediateDefer } from "../utils/defer";

export class PointElevationLoader {

   constructor(public extent: Extent2d = Extent2d.WORLD) { }

   load(public template: string, point: GeoJSON.Position): Promise<GeoJSON.Position> {
      if(!positionWithinBbox(this.extent.toBbox(), point)) {
         immediateDefer(() => {
            onload(null)
         });
      }

      var bbox = [
         point[0] - 0.000001,
         point[1] - 0.000001,
         point[0] + 0.000001,
         point[1] + 0.000001
      ];
      return new TerrainLoader().load(this.template.replace("${width}", 1).replace("${height}", 1).replace("${bbox}", bbox.join(","))).then( function (pointArray) {
         return [point[0], point[1], pointArray[0]];
      });
   }
}
