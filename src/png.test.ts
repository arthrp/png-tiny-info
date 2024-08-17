import { parsePng } from './png'

test("parsePng should throw error when string is passed instead of array",() => {
    const param: any = "";
    expect(() => parsePng(param)).toThrow(Error);
});

test("parsePng should throw error when passed in empty array",() => {
    const param = new Uint8Array([]);
    expect(() => parsePng(param)).toThrow(Error);
});

test("Can parse valid png", () => {
    const pngStr = "89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52 00 00 00 01 00 00 00 01 08 02 00 00 00 90 77 53 DE 00 00 00 0C 49 44 41 54 08 D7 63 F8 CF C0 00 00 03 01 01 00 18 DD 8D B0 00 00 00 00 49 45 4E 44 AE 42 60 82"
        .split(" ");
    
    const param = new Uint8Array(pngStr.map(x => parseInt(x,16)));
    const result = parsePng(param);
    
    expect(result.info.width).toBe(1);
    expect(result.info.height).toBe(1);
    expect(result.info.bitDepth).toBe(8);
    expect(result.info.colorType).toBe(2);
    expect(result.info.compressionMethod).toBe(0);
    expect(result.info.filterMethod).toBe(0);
    expect(result.info.interlaceMethod).toBe(0);
})