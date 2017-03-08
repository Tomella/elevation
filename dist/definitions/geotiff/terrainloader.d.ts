import { Loader } from "../loaders/loader";
export declare class TerrainLoader extends Loader<number[]> {
    options: any;
    constructor(options?: any);
    load(): Promise<number[]>;
    crossOrigin: any;
}
