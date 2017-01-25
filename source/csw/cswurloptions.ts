import { Extent2d } from "../domain/extent2d";

export class CswUrlOptions {
   constructor(public options: any) {}

   get resolutionY() {
      return  this.options.resolutionY ? this.options.resolutionY : Math.round(this.resolutionX * (this.bbox[3] - this.bbox[1]) / (this.bbox[2] - this.bbox[0]));
   }

   set resolutionY(val: number) {
      this.options.resolutionY = val;
   }

   get resolutionX(): number {
      return this.options.resolutionX ? this.options.resolutionX : 500;
   }

   get template(): string {
      return this.options.template;
   }

   get bbox(): number[] {
      return this.options.bbox;
   }

   get extent(): Extent2d {
      return this.options.extent ? this.options.extent : Extent2d.WORLD;
   }

   get location() {
      return this.template
            .replace("${resx}", this.resolutionX)
            .replace("${resy}", this.resolutionY)
            .replace("${width}", this.resolutionX)
            .replace("${height}", this.resolutionY)
            .replace("${bbox}", this.bbox.join(","));
   }
}