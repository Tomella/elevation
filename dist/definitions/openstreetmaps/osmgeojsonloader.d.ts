/// <reference types="geojson" />
import { Loader } from "../loaders/loader";
export declare class OsmGeoJsonLoader extends Loader<GeoJSON.FeatureCollection<any>> {
    options: any;
    private loader;
    constructor(options: any);
    load(): Promise<GeoJSON.FeatureCollection<any>>;
}
