import { Injectable } from '@nestjs/common';

@Injectable()
export class IdEncoderService {
  encodeId(
    id: number,
    alphabet: string = 'c3ogt6shqk41uizlvybdwa72pe8rjxfmn095',
    minLength: number = 5,
  ): string {
    if (id === 0) {
      return alphabet[0].repeat(minLength);
    }
    const base = alphabet.length;
    const arr: string[] = [];
    while (id > 0) {
      const remainder = id % base;
      arr.push(alphabet[remainder]);
      id = Math.floor(id / base);
    }
    let result = arr.reverse().join('');
    while (result.length < minLength) {
      result = alphabet[0] + result;
    }
    return result;
  }

  decodeId(
    encoded: string,
    alphabet: string = 'c3ogt6shqk41uizlvybdwa72pe8rjxfmn095',
  ): number {
    const base = alphabet.length;
    let id = 0;
    for (let i = 0; i < encoded.length; i++) {
      const char = encoded[i];
      const index = alphabet.indexOf(char);
      if (index === -1) {
        throw new Error('Invalid character in encoded string');
      }
      id = id * base + index;
    }
    return id;
  }
}
