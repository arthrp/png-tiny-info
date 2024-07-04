type PngIhdr = {
    width: number;
    height: number;
};
type PngChunk = {
    length: number;
    type: string;
    data: Uint8Array;
};
type PngType = {
    info: PngIhdr;
    chunks: PngChunk[];
};
export declare function parsePngFile(filePath: string): PngType;
export declare function parsePng(fileDataArr: Uint8Array): PngType;
export {};
