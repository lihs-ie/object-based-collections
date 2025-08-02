import { describe, expect, it } from 'vitest';

// Initialize conversion helpers first
import '../../../collections/conversion-setup';
import { Hasher } from '../../../collections/hamt/hash';
import { IndexedSequence } from '../../../collections/sequence/common';

describe('IndexedSequence to-conversions', () => {
  const hasher = Hasher();

  describe('toList()', () => {
    it('should convert sequence to list preserving order', () => {
      const seq = IndexedSequence([1, 2, 2, 3, 3, 3]);
      const list = seq.toList();

      expect(list.toArray()).toEqual([1, 2, 2, 3, 3, 3]);
      expect(list.size()).toBe(6);
    });

    it('should convert empty sequence to empty list', () => {
      const seq = IndexedSequence<string>([]);
      const list = seq.toList();

      expect(list.toArray()).toEqual([]);
      expect(list.size()).toBe(0);
    });

    it('should maintain order with complex objects', () => {
      const objects = [{ id: 1 }, { id: 2 }, { id: 1 }]; // 重複あり
      const seq = IndexedSequence(objects);
      const list = seq.toList();

      expect(list.toArray()).toEqual(objects);
      expect(list.size()).toBe(3);
    });
  });

  describe('toSet()', () => {
    it('should convert sequence to set removing duplicates', () => {
      const seq = IndexedSequence([1, 2, 2, 3, 3, 3]);
      const set = seq.toSet(hasher);

      expect(set.toArray().sort()).toEqual([1, 2, 3]);
      expect(set.size()).toBe(3);
    });

    it('should convert empty sequence to empty set', () => {
      const seq = IndexedSequence<string>([]);
      const set = seq.toSet(hasher);

      expect(set.toArray()).toEqual([]);
      expect(set.size()).toBe(0);
    });

    it('should handle strings with duplicates', () => {
      const seq = IndexedSequence(['a', 'b', 'a', 'c', 'b']);
      const set = seq.toSet(hasher);

      expect(set.toArray().sort()).toEqual(['a', 'b', 'c']);
      expect(set.size()).toBe(3);
    });

    it('should handle single element sequence', () => {
      const seq = IndexedSequence([42]);
      const set = seq.toSet(hasher);

      expect(set.toArray()).toEqual([42]);
      expect(set.size()).toBe(1);
    });
  });
});
