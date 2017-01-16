import { createBboxFromPoints, expandBbox } from "../utils/geojson2d";

export class Extent2d {
   static AUSTRALIA = new Extent2d(113, -44, 154, -10);
   static WORLD = new Extent2d(-180, -90, 180, 90);
   static REVERSE_WORLD = new Extent2d(180, 90, -180, -90);

   private _extent: number[] = [];

   constructor(lngMin = -180, latMin = -90, lngMax = 180, latMax = -90) {
      this._extent = [lngMin, latMin, lngMax, latMax];
   }

   get lngMin() {
      return this._extent[0];
   }

   get latMin() {
      return this._extent[1];
   }

   get lngMax() {
      return this._extent[2];
   }

   get latMax() {
      return this._extent[3];
   }

   set(extent: Extent2d) {
      this._extent = [extent.lngMin, extent.latMin, extent.lngMax, extent.latMin];
      return this;
   }

   setFromPoints(points: GeoJSON.Position[]) {
      this._extent = createBboxFromPoints(points);
      return this;
   }

   expand(point: number[]) {
      expandBbox(this._extent, point);
      return this;
   }

   toBbox() {
      // Clone it.
      return [this.lngMin, this.latMin, this.lngMax, this.latMax];
   }

   clone() {
      return new Extent2d().set(this);
   }
}