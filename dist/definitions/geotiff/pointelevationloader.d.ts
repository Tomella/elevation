/// <reference types="geojson" />
export declare class PointElevationLoader {
    options: any;
    constructor(options: any);
    load(): Promise<GeoJSON.Position>;
}
