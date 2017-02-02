import { Loader } from  "./loader";

/**
 * Sometimes you want to reuse the so this caches it.
 * It can be placed in front of any loader so you might for instance
 * cache GeoJSON, XYZ data or at some point even a higher level format.
 */
export class CachedLoader extends Loader<any> {
   data: any;
   loading = false;
   deferred: Promise<any>;

   constructor(public options) {
      super();
      if (this.options.data) this.data = this.options.data;
   }

   load(): Promise<any> {
      if (this.data) {
         return Promise.resolve(this.data);
      }

      if (!this.deferred) {
         this.deferred = this.options.loader.load().then(data => {
            this.data = data;
            return data;
         });
      }
      return this.deferred;
   };
}