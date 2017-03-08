import { Loader } from "./loader";
/**
 * Sometimes you want to reuse the so this caches it.
 * It can be placed in front of any loader so you might for instance
 * cache GeoJSON, XYZ data or at some point even a higher level format.
 */
export declare class CachedLoader extends Loader<any> {
    options: any;
    data: any;
    loading: boolean;
    deferred: Promise<any>;
    constructor(options: any);
    load(): Promise<any>;
}
