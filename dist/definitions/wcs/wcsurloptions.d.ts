import { Extent2d } from "../domain/extent2d";
export declare class WcsUrlOptions {
    options: any;
    constructor(options: any);
    resolutionY: number;
    readonly resolutionX: number;
    readonly template: string;
    readonly bbox: number[];
    readonly extent: Extent2d;
    readonly location: any;
}
