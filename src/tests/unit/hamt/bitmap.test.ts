import { describe, expect, it } from 'vitest';

import { Bitmap } from '../../../collections/hamt/bitmap';

describe('hamt/bitmap', () => {
  describe('Bitmap', () => {
    it('should create a Bitmap-object', () => {
      const bitmap1 = Bitmap();
      const bitmap2 = Bitmap(0b00000000);

      expect(bitmap1).toBeDefined();
      expect(bitmap2).toBeDefined();
    });

    it('next returns a new Bitmap with the bit set', () => {
      const bitmap = Bitmap(0b00000000);
      const bitpos = 0b00000001;

      const newBitmap = bitmap.next(bitpos);

      expect(newBitmap).toBeDefined();
      expect(newBitmap.has(bitpos)).toBeTruthy();
    });

    it('without returns a new Bitmap with the bit unset', () => {
      const bitmap = Bitmap(0b00000001);
      const bitpos = 0b00000001;

      const newBitmap = bitmap.without(bitpos);

      expect(newBitmap).toBeDefined();
      expect(newBitmap.has(bitpos)).toBeFalsy();
    });

    it('has returns true if the bit is set', () => {
      const value = Math.floor(Math.random() * 0b11111111);
      const bitmap = Bitmap(value);

      const bitpos = bitmap.bitpos(0, 0);
      const newBitmap = bitmap.next(bitpos);

      expect(newBitmap.has(bitpos)).toBeTruthy();
    });

    it('has returns false if the bit is unset', () => {
      const value = Math.floor(Math.random() * 0b11111111);
      const bitmap = Bitmap(value);

      const bitpos = bitmap.bitpos(0, 0);
      const newBitmap = bitmap.without(bitpos);

      expect(newBitmap.has(bitpos)).toBeFalsy();
    });

    it('index returns the index of the bit', () => {
      const value = Math.floor(Math.random() * 0b11111111);
      const bitmap = Bitmap(value);

      const bitpos = bitmap.bitpos(0, 0);
      const newBitmap = bitmap.next(bitpos);

      expect(newBitmap.index(bitpos)).toBe(0);
    });
  });
});
