import { describe, expect, it } from 'vitest';

// Initialize conversion helpers first
import '../../../collections/conversion-setup';
import { Hasher } from '../../../collections/hamt/hash';
import { ImmutableList } from '../../../collections/list/common';

describe('ImmutableList to-conversions', () => {
  const hasher = Hasher();

  describe('toSet()', () => {
    it('should convert list to set removing duplicates', () => {
      const list = ImmutableList(['a', 'b', 'c', 'b', 'a']);
      const set = list.toSet(hasher);

      expect(set.size()).toBe(3);
      expect(set.contains('a')).toBe(true);
      expect(set.contains('b')).toBe(true);
      expect(set.contains('c')).toBe(true);
    });

    it('should convert empty list to empty set', () => {
      const list = ImmutableList<string>([]);
      const set = list.toSet(hasher);

      expect(set.size()).toBe(0);
      expect(set.isEmpty()).toBe(true);
    });
  });

  describe('toSeq()', () => {
    it('should convert list to indexed sequence preserving order', () => {
      const list = ImmutableList([1, 2, 3, 4, 5]);
      const seq = list.toSeq();

      expect(seq.size()).toBe(5);
      expect(seq.toArray()).toEqual([1, 2, 3, 4, 5]);
      expect(seq.get(0)).toBe(1);
      expect(seq.get(4)).toBe(5);
    });

    it('should convert empty list to empty sequence', () => {
      const list = ImmutableList<number>([]);
      const seq = list.toSeq();

      expect(seq.size()).toBe(0);
      expect(seq.isEmpty()).toBe(true);
    });
  });

  describe('toMap() - index based', () => {
    it('should convert list to map with numeric indices as keys', () => {
      const list = ImmutableList(['a', 'b', 'c']);
      const map = list.toMap(hasher);

      expect(map.size()).toBe(3);
      expect(map.get(0).get()).toBe('a');
      expect(map.get(1).get()).toBe('b');
      expect(map.get(2).get()).toBe('c');

      const values = map.values();
      expect(values).toEqual(['a', 'b', 'c']);

      const keys = map.keys();
      expect(keys).toEqual([0, 1, 2]);
    });

    it('should convert empty list to empty map', () => {
      const list = ImmutableList<string>([]);
      const map = list.toMap(hasher);

      expect(map.size()).toBe(0);
      expect(map.isEmpty()).toBe(true);
    });
  });

  describe('toMap() - with key mapper', () => {
    it('should convert list to map using custom key mapper', () => {
      const list = ImmutableList(['a', 'b', 'c']);
      const map = list.toMap((value) => `key_${value}`, hasher);

      expect(map.size()).toBe(3);
      expect(map.get('key_a').get()).toBe('a');
      expect(map.get('key_b').get()).toBe('b');
      expect(map.get('key_c').get()).toBe('c');

      const values = map.values();
      expect(values).toEqual(['a', 'b', 'c']);

      const keys = map.keys();
      expect(keys).toEqual(['key_a', 'key_b', 'key_c']);
    });

    it('should handle key mapper with index parameter', () => {
      const list = ImmutableList(['x', 'y', 'z']);
      const map = list.toMap((value, index) => `${index}_${value}`, hasher);

      expect(map.size()).toBe(3);
      expect(map.get('0_x').get()).toBe('x');
      expect(map.get('1_y').get()).toBe('y');
      expect(map.get('2_z').get()).toBe('z');
    });

    it('should handle empty list with key mapper', () => {
      const list = ImmutableList<string>([]);
      const map = list.toMap((value) => `key_${value}`, hasher);

      expect(map.size()).toBe(0);
      expect(map.isEmpty()).toBe(true);
    });

    it('should handle duplicate keys with key mapper', () => {
      const list = ImmutableList(['a', 'b', 'a']);
      const map = list.toMap((value) => value, hasher); // Use value as key

      // Last value should win for duplicate keys
      expect(map.size()).toBe(2); // Only 'a' and 'b' keys
      expect(map.get('a').get()).toBe('a');
      expect(map.get('b').get()).toBe('b');
    });
  });
});
