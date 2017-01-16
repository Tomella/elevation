declare class GeotiffParser {
  parseHeader(data: any): void;
  loadPixels(): number[];
}