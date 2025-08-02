import { describe, expect, expectTypeOf, it } from 'vitest';

import { ImmutableList, ImmutableMap, ImmutableSet } from '../../..';
import { Hasher } from '../../../collections/hamt';

describe('set/common', () => {
  describe('ImmutableSet', () => {
    it('should create an ImmutableSet-object', () => {
      const set1 = ImmutableSet(Hasher())();
      const set2 = expect(set1).toBeDefined();
      expect(set2).toBeDefined();
    });

    it('should create an ImmutableSet-object with a hash function', () => {
      const set1 = ImmutableSet(Hasher())<number>();
      const set2 = ImmutableSet.fromArray([1, 2, 3]);

      expect(set1).toBeDefined();
      expect(set2).toBeDefined();

      expectTypeOf(set1).toEqualTypeOf<ImmutableSet<number>>();
      expectTypeOf(set2).toEqualTypeOf<ImmutableSet<number>>();

      expect(set1.toArray()).toEqual([]);
      expect(set2.toArray()).toEqual([1, 2, 3]);
    });

    it('toArray returns an array of keys', () => {
      const keys: number[] = Array.from({ length: 100 }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet(Hasher())<number>();

      const actual1 = set1.toArray();
      const actual2 = set2.toArray();

      expect(actual1).toEqual(expect.arrayContaining(keys));
      expect(actual2).toEqual([]);
    });

    it('toList returns an ImmutableList of keys', () => {
      const keys: number[] = Array.from({ length: 100 }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet(Hasher())<number>();

      const actual1 = set1.toList();
      const actual2 = set2.toList();

      expect(actual1).toBeDefined();
      expectTypeOf(actual1).toEqualTypeOf<ImmutableList<number>>();
      expect(actual2).toBeDefined();
      expectTypeOf(actual2).toEqualTypeOf<ImmutableList<number>>();

      expect(actual1.toArray()).toEqual(expect.arrayContaining(keys));
      expect(actual2.toArray()).toEqual([]);
    });

    it('toMap returns an ImmutableMap of indexed-value', () => {
      const keys: number[] = Array.from({ length: 100 }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet(Hasher())<number>();

      const actual1 = set1.toMap();
      const actual2 = set2.toMap();

      expect(actual1).toBeDefined();
      expectTypeOf(actual1).toEqualTypeOf<ImmutableMap<number, number>>();
      expect(actual2).toBeDefined();
      expectTypeOf(actual2).toEqualTypeOf<ImmutableMap<number, number>>();

      expect(actual2.toArray()).toEqual([]);

      keys.forEach((key) => {
        expect(actual1.contains(key)).toBeTruthy();
      });
    });

    it('size returns the number of elements in the set', () => {
      const keys: number[] = Array.from({ length: 100 }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet(Hasher())<number>();

      const actual1 = set1.size();
      const actual2 = set2.size();

      expect(actual1).toEqual(keys.length);
      expect(actual2).toEqual(0);
    });

    it('isEmpty returns true if the set is empty', () => {
      const keys: number[] = Array.from({ length: 100 }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet(Hasher())<number>();

      const actual1 = set1.isEmpty();
      const actual2 = set2.isEmpty();

      expect(actual1).toBeFalsy();
      expect(actual2).toBeTruthy();
    });

    it('isNotEmpty returns true if the set is not empty', () => {
      const keys: number[] = Array.from({ length: 100 }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet(Hasher())<number>();

      const actual1 = set1.isNotEmpty();
      const actual2 = set2.isNotEmpty();

      expect(actual1).toBeTruthy();
      expect(actual2).toBeFalsy();
    });

    it('add returns a new ImmutableSet with the key added', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      const actual = set.add(count + 1);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<ImmutableSet<number>>();

      [...keys, count + 1].forEach((key) => {
        expect(actual.contains(key)).toBeTruthy();
      });
    });

    it('addAll returns a new ImmutableSet with the keys added', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      const addedKeys = [count + 1, count + 2, count + 3];

      const actual = set.addAll(...addedKeys);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<ImmutableSet<number>>();

      [...keys, ...addedKeys].forEach((key) => {
        expect(actual.contains(key)).toBeTruthy();
      });
    });

    it('remove returns a new ImmutableSet with the key removed', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const target = keys[Math.floor(Math.random() * keys.length)];

      const set = ImmutableSet.fromArray(keys);

      const actual = set.remove(target);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<ImmutableSet<number>>();

      expect(actual.contains(target)).toBeFalsy();

      ImmutableList(keys)
        .filter((key) => key !== target)
        .foreach((key) => {
          expect(actual.contains(key)).toBeTruthy();
        });
    });

    it('remove returns a new empty ImmutableSet if the set is empty', () => {
      const set = ImmutableSet(Hasher())<number>();

      const actual = set.remove(1);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<ImmutableSet<number>>();

      expect(actual.isEmpty()).toBeTruthy();
    });

    it('contains returns true if the key is in the set', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      keys.forEach((key) => {
        expect(set.contains(key)).toBeTruthy();
      });
    });

    it('contains returns false if the key is not in the set', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      expect(set.contains(count + 1)).toBeFalsy();
    });

    it('find returns the first key that satisfies the predicate', () => {
      const count = Math.floor(Math.random() * 100) + 1;
      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      const predicate = (key: number): boolean => key % 2 === 0;

      const expected = keys.find(predicate);

      const actual = set.find(predicate);

      expect(actual.get()).toBe(expected);
    });

    it('find returns an empty Optional if no key satisfies the predicate', () => {
      const count = Math.floor(Math.random() * 100) + 1;
      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      const predicate = (key: number): boolean => key > count;

      const actual = set.find(predicate);

      expect(actual.isPresent()).toBeFalsy();
    });

    it('reduce returns the accumulated value', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      const reducer = (carry: number, key: number): number => carry + key;

      const expected = keys.reduce(reducer, 0);

      const actual = set.reduce(reducer, 0);

      expect(actual).toBe(expected);
    });

    it('map returns a new ImmutableSet with the keys mapped', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);
      const mapper = (key: number): number => key * 2;

      const expectedKeys = keys.map(mapper);

      const set = ImmutableSet.fromArray(keys);

      const actual = set.map(mapper);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<ImmutableSet<number>>();
      expect(actual.toArray()).toEqual(expect.arrayContaining(expectedKeys));
    });

    it('filter returns a new ImmutableSet with the keys filtered', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);
      const predicate = (key: number): boolean => key % 2 === 0;

      const expectedKeys = keys.filter(predicate);

      const set = ImmutableSet.fromArray(keys);

      const actual = set.filter(predicate);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<ImmutableSet<number>>();
      expect(actual.toArray()).toEqual(expect.arrayContaining(expectedKeys));
    });

    it('foreach calls the callback for each key in the set', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      const callback = (key: number): void => {
        expectTypeOf(key).toEqualTypeOf<number>();
      };

      set.foreach(callback);
    });

    it('equals returns true if the sets are equal', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet.fromArray(keys);

      expect(set1.equals(set2)).toBeTruthy();
    });

    it('equals returns false if the sets are not equal', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set1 = ImmutableSet.fromArray(keys);
      const set2 = ImmutableSet.fromArray([...keys, count + 1]);

      expect(set1.equals(set2)).toBeFalsy();
    });

    it('exists returns true if the predicate is satisfied by any key', () => {
      const count = Math.floor(Math.random() * 100) + 1;

      const keys: number[] = Array.from({ length: count }, (_, index) => index);

      const set = ImmutableSet.fromArray(keys);

      const predicate = (key: number): boolean => key % 2 === 0;

      expect(set.exists(predicate)).toBeTruthy();
    });

    describe('Factory Methods', () => {
      describe('fromArray', () => {
        it('creates ImmutableSet from array', () => {
          const items = [1, 2, 3, 4, 5, 2, 3]; // including duplicates

          const set = ImmutableSet.fromArray(items);

          expect(set).toBeDefined();
          expect(set.size()).toBe(5); // duplicates removed
          expect(set.contains(1)).toBe(true);
          expect(set.contains(2)).toBe(true);
          expect(set.contains(3)).toBe(true);
          expect(set.contains(4)).toBe(true);
          expect(set.contains(5)).toBe(true);
        });

        it('creates empty set from empty array', () => {
          const set = ImmutableSet.fromArray([]);

          expect(set.isEmpty()).toBe(true);
          expect(set.size()).toBe(0);
        });
      });

      describe('of', () => {
        it('creates ImmutableSet from variadic arguments', () => {
          const set = ImmutableSet.of(1, 2, 3, 4, 5, 2, 3); // including duplicates

          expect(set).toBeDefined();
          expect(set.size()).toBe(5); // duplicates removed
          expect(set.contains(1)).toBe(true);
          expect(set.contains(2)).toBe(true);
          expect(set.contains(3)).toBe(true);
          expect(set.contains(4)).toBe(true);
          expect(set.contains(5)).toBe(true);
        });

        it('creates empty set with no arguments', () => {
          const set = ImmutableSet.of();

          expect(set.isEmpty()).toBe(true);
          expect(set.size()).toBe(0);
        });
      });

      describe('empty', () => {
        it('creates empty ImmutableSet', () => {
          const set = ImmutableSet.empty<string>();

          expect(set).toBeDefined();
          expect(set.isEmpty()).toBe(true);
          expect(set.size()).toBe(0);
          expect(set.toArray()).toEqual([]);
        });
      });
    });
  });
});
