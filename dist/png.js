"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePng = exports.parsePngFile = void 0;
const fs = require("fs");
function parsePngFile(filePath) {
    const d = fs.readFileSync(filePath);
    const arr = new Uint8Array(d);
    return parsePng(arr);
}
exports.parsePngFile = parsePngFile;
function parsePng(fileDataArr) {
    if (!(fileDataArr instanceof Uint8Array))
        throw new Error("Data is not a valid array");
    if (fileDataArr.length < 8 + 12 + 13 + 12)
        throw new Error("Data array too small"); //header + IHDR + IEND
    const header = new Uint8Array(fileDataArr.slice(0, 8));
    const isValid = isHeaderValid(header);
    if (!isValid)
        throw new Error("PNG header invalid");
    let chunkName = "";
    let i = 8;
    let c = 0;
    const chunks = [];
    const maxChunks = Number.MAX_SAFE_INTEGER - 1;
    while (chunkName !== "IEND" && c < maxChunks) {
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
exports.parsePng = parsePng;
function parsePngHeader(data) {
    const widArr = data.slice(0, 4);
    const width = arrToNumber(widArr);
    const heightArr = data.slice(4, 8);
    const height = arrToNumber(heightArr);
    return { width, height };
}
function parsePngChunk(arr, start) {
    const lenArr = arr.slice(start, start + 4);
    const len = arrToNumber(lenArr);
    const chunkTypeArr = arr.slice(start + 4, start + 8);
    const type = arrToAscii(chunkTypeArr);
    const data = arr.slice(start + 8, start + 8 + len);
    const i = start + 8 + len + 4; //length:4b + type:4b + data + CRC:4b
    return [{ length: len, type, data }, i];
}
function arrToNumber(arr) {
    const num = arr.reduce((acc, n) => (acc << 8) + n, 0);
    return num;
}
function arrToAscii(arr) {
    const b = Buffer.from(arr);
    const s = b.toString('ascii');
    // console.log(s);
    return s;
}
function isHeaderValid(header) {
    const pngHeader = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    const isValid = header.length === pngHeader.length && header.every((b, i) => b == pngHeader[i]);
    return isValid;
}
