import { parsePng } from './png'

test("parsePng should throw error when string is passed instead of array",() => {
    const param: any = "";
    expect(() => parsePng(param)).toThrow(Error);
});

test("parsePng should throw error when passed in empty array",() => {
    const param = new Uint8Array([]);
    expect(() => parsePng(param)).toThrow(Error);
});