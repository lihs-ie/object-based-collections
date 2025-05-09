import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  BitmapIndexedNode,
  HAMTNode,
  LeafNode,
} from '../../../collections/hamt';
import { Bitmap } from '../../../collections/hamt/bitmap';

type Option<T> = T | undefined;

class Std<T> {
  constructor(public readonly value: T) {}
}

describe('hamt/node', () => {
  describe('LeafNode', () => {
    it('should create a LeafNode', () => {
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(0, key, value);

      expect(node).toBeDefined();
      expectTypeOf(node).toEqualTypeOf<HAMTNode<number, number>>();
    });

    it('key returns the key of the node', () => {
      const expected = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(0, expected, value);

      const actual = node.key();

      expect(expected).toBe(actual);
    });

    it('value returns the value of the node', () => {
      const key = Math.floor(Math.random() * 100);
      const expected = Math.floor(Math.random() * 100);

      const node = LeafNode(0, key, expected);

      const actual = node.value();

      expect(expected).toBe(actual);
    });

    it('get returns the value of the node with same hash', () => {
      const hash = Math.floor(Math.random() * 100);

      const key = Math.floor(Math.random() * 100);
      const expected = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, expected);

      const actual = node.get(hash, 0);

      expect(expected).toBe(actual);
    });

    it('get returns undefined if the hash is different', () => {
      const hash = Math.floor(Math.random() * 100);

      const key = Math.floor(Math.random() * 100);
      const expected = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, expected);

      const actual = node.get(hash + 1, 0);

      expect(actual).toBeUndefined();
    });

    it('find returns the value of the node when the predicate is true', () => {
      const predicate = (key: number, value: number): boolean => key === value;

      const key = Math.floor(Math.random() * 100);
      const value = key;

      const node = LeafNode(0, key, value);

      const actual = node.find(predicate);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Option<HAMTNode<number, number>>>();
      expect(actual?.key()).toBe(key);
    });

    it('find returns undefined when the predicate is false', () => {
      const predicate = (key: number, value: number): boolean => key === value;

      const key = Math.floor(Math.random() * 100);
      const value = key + 1;

      const node = LeafNode(0, key, value);

      const actual = node.find(predicate);

      expect(actual).toBeUndefined();
    });

    it('add returns a new node with different hash', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, value);

      const actual = node.add(hash + 1, 0, key + 1, value + 1);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<HAMTNode<number, number>>();
      expect(node).not.toBe(actual);
    });

    it('add returns the node containing same key and value when the hash is the same', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, value);

      const actual = node.add(hash, 0, key, value);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<HAMTNode<number, number>>();
      expect(node).not.toBe(actual);
      expect(actual.key()).toBe(key);
      expect(actual.value()).toBe(value);
    });

    it('remove returns undefined when the hash is the same', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, value);

      const actual = node.remove(hash, 0);

      expect(actual).toBeUndefined();
    });

    it('remove returns the node when the hash is different', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, value);

      const actual = node.remove(hash + 1, 0);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Option<HAMTNode<number, number>>>();
      expect(node).not.toBe(actual);
      expect(actual?.key()).toBe(key);
      expect(actual?.value()).toBe(value);
    });

    it('exists returns true when condition is met', () => {
      const nodeKey = Math.floor(Math.random() * 100);
      const nodeValue = new Std(Math.floor(Math.random() * 1000));

      const node = LeafNode(0, nodeKey, nodeValue);

      const predicate = (key: number, value: Std<number>): boolean => {
        return key === nodeKey && value.value === nodeValue.value;
      };

      const actual = node.exists(predicate);

      expect(actual).toBeTruthy();
    });

    it('exists returns false when condition is not met', () => {
      const nodeKey = Math.floor(Math.random() * 100);
      const nodeValue = new Std(Math.floor(Math.random() * 1000));

      const node = LeafNode(0, nodeKey, nodeValue);

      const predicate = (key: number, value: Std<number>): boolean => {
        return key !== nodeKey && value.value !== nodeValue.value;
      };

      const actual = node.exists(predicate);

      expect(actual).toBeFalsy();
    });

    it('contains returns true when the hash is the same', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, value);

      const actual = node.contains(hash, 0);

      expect(actual).toBeTruthy();
    });

    it('contains returns false when the hash is different', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const node = LeafNode(hash, key, value);

      const actual = node.contains(hash + 1, 0);

      expect(actual).toBeFalsy();
    });

    it('toArray returns the key and value of the node', () => {
      const expected = [
        [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      ];

      const node = LeafNode(0, expected[0][0], expected[0][1]);

      const actual = node.toArray();

      expect(actual).toEqual(expected);
    });
  });

  describe('BitmapIndexedNode', () => {
    const createBitmap = (hash: number, offset: number): Bitmap => {
      const bitmap = Bitmap();

      const bitpos = bitmap.bitpos(hash, offset);

      return bitmap.next(bitpos);
    };

    it('should create a BitmapIndexedNode', () => {
      const bitmap = Bitmap(0b00000000);
      const nodes = [LeafNode(0, 1, 2), LeafNode(0, 3, 4)];

      const node1 = BitmapIndexedNode<number, number>();
      const node2 = BitmapIndexedNode(bitmap, nodes);

      expect(node1).toBeDefined();
      expectTypeOf(node1).toEqualTypeOf<BitmapIndexedNode<number, number>>();

      expect(node2).toBeDefined();
      expectTypeOf(node2).toEqualTypeOf<BitmapIndexedNode<number, number>>();
    });

    it('key returns the key of the node', () => {
      const bitmap = Bitmap(0b00000000);
      const nodes = [LeafNode(0, 1, 2), LeafNode(0, 3, 4)];

      const node = BitmapIndexedNode(bitmap, nodes);

      const actual = node.key();

      expect(actual).toBeUndefined();
    });

    it('value returns the value of the node', () => {
      const bitmap = Bitmap(0b00000000);
      const nodes = [LeafNode(0, 1, 2), LeafNode(0, 3, 4)];

      const node = BitmapIndexedNode(bitmap, nodes);

      const actual = node.value();

      expect(actual).toBeUndefined();
    });

    it('get returns the value of the node with set hash and offset', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.get(hash, 0);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Option<number>>();
      expect(actual).toBe(value);
    });

    it('get returns undefined if the hash is different', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.get(hash + 1, 0);

      expect(actual).toBeUndefined();
    });

    it('find returns the node when the predicate is true', () => {
      const hashes = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 100),
      );

      const nodes = hashes.map((hash, index) => LeafNode(hash, index, index));

      const bitmap = hashes.reduce(
        (carry, current) => carry.next(carry.bitpos(current, 0)),
        Bitmap(),
      );

      const node = BitmapIndexedNode(bitmap, nodes);

      const predicate = (key: number, value: number): boolean =>
        key === 9 && value === 9;

      const actual = node.find(predicate);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Option<HAMTNode<number, number>>>();
      expect(actual?.key()).toBe(9);
      expect(actual?.value()).toBe(9);
    });

    it('find returns undefined when the predicate is false', () => {
      const hashes = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 100),
      );

      const nodes = hashes.map((hash, index) => LeafNode(hash, index, index));

      const bitmap = hashes.reduce(
        (carry, current) => carry.next(carry.bitpos(current, 0)),
        Bitmap(),
      );

      const node = BitmapIndexedNode(bitmap, nodes);

      const predicate = (key: number, value: number): boolean =>
        key === 9 && value === 8;

      const actual = node.find(predicate);

      expect(actual).toBeUndefined();
    });

    it('add returns a new node with different hash', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.add(hash + 1, 0, key + 1, value + 1);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<HAMTNode<number, number>>();
      expect(node).not.toBe(actual);
    });

    it('add returns node containing updated value when the hash is the same', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.add(hash, 0, key, value);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<HAMTNode<number, number>>();
      expect(node).not.toBe(actual);
      expect(actual.exists((k, v) => k === key && v === value)).toBeTruthy();
    });

    it('remove returns the node when the hash is different', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.remove(hash + 1, 0);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Option<HAMTNode<number, number>>>();
      expect(actual?.exists((k, v) => k === key && v === value)).toBeTruthy();
    });

    it('remove returns undefined when the hash is the same', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.remove(hash, 0);

      expect(actual).toBeUndefined();
    });

    it('exists returns true when condition is met', () => {
      const nodeKey = Math.floor(Math.random() * 100);
      const nodeValue = new Std(Math.floor(Math.random() * 1000));

      const leaf = LeafNode(0, nodeKey, nodeValue);

      const bitmap = createBitmap(0, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const predicate = (key: number, value: Std<number>): boolean => {
        return key === nodeKey && value.value === nodeValue.value;
      };

      const actual = node.exists(predicate);

      expect(actual).toBeTruthy();
    });

    it('exists returns false when condition is not met', () => {
      const nodeKey = Math.floor(Math.random() * 100);
      const nodeValue = new Std(Math.floor(Math.random() * 1000));

      const leaf = LeafNode(0, nodeKey, nodeValue);

      const bitmap = createBitmap(0, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const predicate = (key: number, value: Std<number>): boolean => {
        return key !== nodeKey && value.value !== nodeValue.value;
      };

      const actual = node.exists(predicate);

      expect(actual).toBeFalsy();
    });

    it('contains returns true when the hash is the same', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.contains(hash, 0);

      expect(actual).toBeTruthy();
    });

    it('contains returns false when the hash is different', () => {
      const hash = Math.floor(Math.random() * 100);
      const key = Math.floor(Math.random() * 100);
      const value = Math.floor(Math.random() * 100);

      const leaf = LeafNode(hash, key, value);

      const bitmap = createBitmap(hash, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.contains(hash + 1, 0);

      expect(actual).toBeFalsy();
    });

    it('toArray returns the key and value of the node', () => {
      const expected = [
        [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
      ];

      const leaf = LeafNode(0, expected[0][0], expected[0][1]);

      const bitmap = createBitmap(0, 0);

      const node = BitmapIndexedNode(bitmap, [leaf]);

      const actual = node.toArray();

      expect(actual).toEqual(expected);
    });
  });
});
