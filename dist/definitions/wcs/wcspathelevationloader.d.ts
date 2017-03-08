/// <reference types="geojson" />
import { Loader } from "../loaders/loader";
export declare class WcsPathElevationLoader extends Loader<GeoJSON.FeatureCollection<GeoJSON.Point>> {
    options: any;
    constructor(options?: any);
    path: number[];
    load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>>;
}
