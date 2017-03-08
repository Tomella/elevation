export declare class OpenStreetMapsLoader {
    options: any;
    private gridLoader;
    constructor(options: any);
    load(): Promise<number[][]>;
}
