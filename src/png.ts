import fs = require('fs');

type PngIhdr = {
    width: number,
    height: number,
    bitDepth: number,
    colorType: number,
    compressionMethod: number,
    filterMethod: number,
    interlaceMethod: number
}

type PngChunk = {
    length: number,
    type: string,
    data: Uint8Array
}

type PngType = {
    info: PngIhdr,
    chunks: PngChunk[]
}

export function parsePngFile(filePath: string){
    const d = fs.readFileSync(filePath);
    const arr = new Uint8Array(d);

    return parsePng(arr);
}

export function parsePng(fileDataArr: Uint8Array): PngType {
    if(!(fileDataArr instanceof Uint8Array)) throw new Error("Data is not a valid array");
    if(fileDataArr.length < 8+12+13+12) throw new Error("Data array too small"); //header + IHDR + IEND
    const header = new Uint8Array(fileDataArr.slice(0,8));

    const isValid = isHeaderValid(header);
    if (!isValid) throw new Error("PNG header invalid");

    let chunkName = "";
    let i = 8;
    let c = 0;
    const chunks: PngChunk[] = [];
    const maxChunks = Number.MAX_SAFE_INTEGER - 1;

    while(chunkName !== "IEND" && c < maxChunks){
        let [chunk, n] = parsePngChunk(fileDataArr, i);
        chunkName = chunk.type;
        i = n;
        chunks.push(chunk);
        c++;
    }

    const infoChunk = chunks.filter(c => c.type === "IHDR")[0];
    const info = parsePngHeader(infoChunk.data);
    
    return { chunks, info };
}

function parsePngHeader(data: Uint8Array): PngIhdr {
    const width = sliceToNumber(data,0,4);
    const height = sliceToNumber(data,4,8);
    const bitDepth = sliceToNumber(data,8,9);
    const colorType = sliceToNumber(data,9,10);
    const compressionMethod = sliceToNumber(data,10,11);
    const filterMethod = sliceToNumber(data,11,12);
    const interlaceMethod = sliceToNumber(data,12,13);

    console.log(bitDepth);

    return { width, height, bitDepth, colorType, compressionMethod, filterMethod, interlaceMethod };
}

function parsePngChunk(arr: Uint8Array, start: number): [PngChunk, number] {
    const lenArr = arr.slice(start,start+4);
    const len = arrToNumber(lenArr);
    const chunkTypeArr = arr.slice(start+4,start+8);
    const type = arrToAscii(chunkTypeArr);
    const data = arr.slice(start+8,start+8+len);

    const i = start+8+len+4; //length:4b + type:4b + data + CRC:4b
    return [{length: len, type, data}, i];
}

function sliceToNumber(data: Uint8Array, start: number, end: number){
    const arr = data.slice(start,end);
    return arrToNumber(arr);
}

function arrToNumber(arr: Uint8Array){
    const num = arr.reduce((acc,n) => (acc << 8) + n, 0);
    return num;
}

function arrToAscii(arr: Uint8Array): string {
    const b = Buffer.from(arr);
    const s = b.toString('ascii');
    // console.log(s);
    return s;
}

function isHeaderValid(header: Uint8Array){
    const pngHeader = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    const isValid = header.length === pngHeader.length && header.every((b,i) => b == pngHeader[i]);
    return isValid;
}