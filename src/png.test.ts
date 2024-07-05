import { parsePng } from './png'

test("parsePng should throw error when string is passed instead of array",() => {
    const param: any = "";
    expect(() => parsePng(param)).toThrow(Error);
})