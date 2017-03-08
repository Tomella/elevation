import { Extent2d } from "../domain/extent2d";
export declare class WcsPointOptions {
    options: any;
    constructor(options?: any);
    readonly template: string;
    readonly point: number[];
    readonly bbox: number[];
    readonly extent: Extent2d;
    readonly location: any;
}
