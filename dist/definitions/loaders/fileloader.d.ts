import { Loader } from "./loader";
export declare class FileLoader extends Loader<any> {
    file: File;
    callback: Function;
    reader: FileReader;
    constructor(file: File, options: any, callback: Function);
    load(): Promise<any>;
}
