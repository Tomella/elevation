import { Extent2d } from "../domain/extent2d";

export class CswPointOptions {
   constructor(public template: string, public point: number[]) {}

   get extent(): Extent2d {
      return new Extent2d(...this.bbox);
   }

   get bbox(): number[] {
      return [
         this.point[0] - 0.000001,
         this.point[1] - 0.000001,
         this.point[0] + 0.000001,
         this.point[1] + 0.000001
      ];
   }

   get location() {
      return this.template
            .replace("${resx}", 1)
            .replace("${resy}", 1)
            .replace("${width}", 1)
            .replace("${height}", 1)
            .replace("${bbox}", this.bbox.join(","));
   }
}