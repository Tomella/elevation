/// <reference types="geojson" />
export declare class Extent2d {
    static AUSTRALIA: Extent2d;
    static WORLD: Extent2d;
    static REVERSE_WORLD: Extent2d;
    private _extent;
    constructor(lngMin?: number, latMin?: number, lngMax?: number, latMax?: number);
    readonly lngMin: number;
    readonly latMin: number;
    readonly lngMax: number;
    readonly latMax: number;
    set(extent: Extent2d): this;
    setFromPoints(points: GeoJSON.Position[]): this;
    expand(point: number[]): this;
    toBbox(): number[];
    clone(): Extent2d;
}
