import { describe, expect, it } from 'vitest';

import { Hasher } from '../../../collections';

class Std<T> {
  constructor(private readonly value: T) {}
}

const differentValues: Record<string, [unknown, unknown]> = {
  string: ['key1', 'key2'],
  number: [1, 2],
  boolean: [true, false],
  object: [{ key1: 'value1' }, { key2: 'value2' }],
  array: [
    [1, 2],
    [3, 4],
  ],
  function: [(value: string) => value, (value: string) => value + '2'],
  class: [new Std(1), new Std(2)],
  symbol: [Symbol('key1'), Symbol('key2')],
};

const sameValues: Record<string, [unknown, unknown]> = {
  string: ['key1', 'key1'],
  number: [1, 1],
  boolean: [true, true],
  object: [{ key1: 'value1' }, { key1: 'value1' }],
  array: [
    [1, 2],
    [1, 2],
  ],
  function: [(value: string) => value, (value: string) => value],
  class: [new Std(1), new Std(1)],
  symbol: [Symbol('key1'), Symbol('key1')],
  null: [null, null],
  undefined: [undefined, undefined],
};

describe('hamt/hash', () => {
  describe('Hasher', () => {
    it.each(Object.entries(differentValues))(
      'hash returns different hash for %s',
      (_, [value1, value2]) => {
        const hasher = Hasher();

        const hash1 = hasher.hash(value1);
        const hash2 = hasher.hash(value2);

        expect(hash1).not.toBe(hash2);
      },
    );

    it.each(Object.entries(sameValues))(
      'hash returns same hash for %s',
      (_, [value1, value2]) => {
        const hasher = Hasher();

        const hash1 = hasher.hash(value1);
        const hash2 = hasher.hash(value2);

        expect(hash1).toBe(hash2);
      },
    );
  });
});
