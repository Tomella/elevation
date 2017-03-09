import { createBboxFromPoints, expandBbox } from "../utils/geojson2d";

export class Extent2d {
   static AUSTRALIA = new Extent2d(113, -44, 154, -10);
   static WORLD = new Extent2d(-180, -90, 180, 90);
   static REVERSE_WORLD = new Extent2d(180, 90, -180, -90);

   private _extent: number[] = [];

   constructor(lngMin = -180, latMin = -90, lngMax = 180, latMax = -90) {
      this._extent = [lngMin, latMin, lngMax, latMax];
   }

   get lngMin(): number {
      return this._extent[0];
   }

   get latMin(): number {
      return this._extent[1];
   }

   get lngMax(): number {
      return this._extent[2];
   }

   get latMax(): number {
      return this._extent[3];
   }

   set(extent: Extent2d): Extent2d {
      this._extent = [extent.lngMin, extent.latMin, extent.lngMax, extent.latMax];
      return this;
   }

   setFromPoints(points: GeoJSON.Position[]): Extent2d {
      this._extent = createBboxFromPoints(points);
      return this;
   }

   expand(point: number[]): Extent2d {
      expandBbox(this._extent, point);
      return this;
   }

   toBbox(): number[] {
      // Clone it.
      return [this.lngMin, this.latMin, this.lngMax, this.latMax];
   }

   clone(): Extent2d {
      return new Extent2d().set(this);
   }
}