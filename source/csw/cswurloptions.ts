import { Extent2d } from "../domain/extent2d";

export class CswUrlOptions {
   private _resolutionY?: number;
   constructor(public template: string, public bbox: number[], public options: any = {resolutionX: 500}) {

   }

   get resolutionY() {
      return  this._resolutionY ? this._resolutionY : Math.round(this.resolutionX * (this.bbox[3] - this.bbox[1]) / (this.bbox[2] - this.bbox[0]));
   }

   set resolutionY(val: number) {
      this._resolutionY = val;
   }

   get resolutionX(): number {
      return this.options.resolutionX;
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