import { Extent2d } from "../domain/extent2d";

export class Transection {
   diagonal = 500;
   extent: Extent2d;

   constructor(public serviceUrlTemplate: string) {}

   getElevation(geometry: GeoJSON.LineString, buffer: number = 0): Promise<GeoJSON.LineString> {
      return new Promise<GeoJSON.LineString>((resolve, reject) => {
         this.extent = new Extent2d();
      });
   }

   static calcSides(diagonal: number, ar) {
      // x * x + ar * ar * x * x = diagonal * diagonal
      // (1 + ar * ar) * x * x = diagonal * diagonal
      // x * x = diagonal * diagonal / (1 + ar * ar)
      let y = Math.sqrt(diagonal * diagonal / (1 + ar * ar));
      return { y: Math.ceil(y), x: Math.ceil(y * ar) };
   }
}

