import { describe, expect, it } from 'vitest';

// Initialize conversion helpers first
import '../../../collections/conversion-setup';
import { Hasher } from '../../../collections/hamt/hash';
import { ImmutableSet } from '../../../collections/set/common';

describe('ImmutableSet to-conversions', () => {
  const hasher = Hasher();

  describe('toList()', () => {
    it('should convert set to list preserving all values', () => {
      const set = ImmutableSet(hasher)<string>().add('a').add('b').add('c');
      const list = set.toList();

      expect(list.size()).toBe(3);
      expect(list.toArray()).toEqual(expect.arrayContaining(['a', 'b', 'c']));
    });

    it('should convert empty set to empty list', () => {
      const set = ImmutableSet(hasher)<string>();
      const list = set.toList();

      expect(list.size()).toBe(0);
      expect(list.toArray()).toEqual([]);
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('toSeq()', () => {
    it('should convert set to indexed sequence', () => {
      const set = ImmutableSet(hasher)<number>().add(1).add(2).add(3);
      const seq = set.toSeq();

      expect(seq.size()).toBe(3);
      expect(seq.toArray()).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should convert empty set to empty sequence', () => {
      const set = ImmutableSet(hasher)<number>();
      const seq = set.toSeq();

      expect(seq.size()).toBe(0);
      expect(seq.isEmpty()).toBe(true);
    });
  });

  describe('toMap() - index based', () => {
    it('should convert set to map with numeric indices as keys', () => {
      const set = ImmutableSet(hasher)<string>().add('a').add('b').add('c');
      const map = set.toMap(hasher);

      expect(map.size()).toBe(3);
      const values = map.values();
      expect(values).toEqual(expect.arrayContaining(['a', 'b', 'c']));

      // Keys should be 0, 1, 2
      const keys = map.keys();
      expect(keys).toEqual(expect.arrayContaining([0, 1, 2]));
    });

    it('should convert empty set to empty map', () => {
      const set = ImmutableSet(hasher)<string>();
      const map = set.toMap(hasher);

      expect(map.size()).toBe(0);
      expect(map.isEmpty()).toBe(true);
    });
  });

  describe('toMap() - with key mapper', () => {
    it('should convert set to map using custom key mapper', () => {
      const set = ImmutableSet(hasher)<string>().add('a').add('b').add('c');
      const map = set.toMap((value) => `key_${value}`, hasher);

      expect(map.size()).toBe(3);
      const values = map.values();
      expect(values).toEqual(expect.arrayContaining(['a', 'b', 'c']));

      // Keys should be transformed
      const keys = map.keys();
      expect(keys).toEqual(expect.arrayContaining(['key_a', 'key_b', 'key_c']));
    });

    it('should handle key mapper with index parameter', () => {
      const set = ImmutableSet(hasher)<string>().add('x').add('y');
      const map = set.toMap((value, index) => `${index}_${value}`, hasher);

      expect(map.size()).toBe(2);
      const keys = map.keys();
      // Since set order is not guaranteed, we check that keys follow pattern
      keys.forEach((key) => {
        expect(key).toMatch(/^\d+_[xy]$/);
      });
    });

    it('should handle empty set with key mapper', () => {
      const set = ImmutableSet(hasher)<string>();
      const map = set.toMap((value) => `key_${value}`, hasher);

      expect(map.size()).toBe(0);
      expect(map.isEmpty()).toBe(true);
    });
  });
});
