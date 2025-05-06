import { describe, expect, it } from 'vitest';

import {
  empty,
  None,
  nullable,
  Optional,
  Some,
} from '../../../collections/optional';

const presentValues = {
  string: 'hello world',
  number: Math.floor(Math.random() * 100),
  boolean: Math.random() > 0.5,
  object: { key: 'value' },
  array: [1, 2, 3],
  function: () => 'hello world',
  null: null,
  symbol: Symbol('symbol'),
  bigint: BigInt(1),
  date: new Date(),
};

describe('optional/common', () => {
  describe('Some', () => {
    it.each(Object.values(presentValues))(
      'constructor function returns Some-object',
      (value) => {
        const some = Optional(value);

        expect(some).toBeDefined();
      },
    );

    it.each(Object.values(presentValues))(
      'isPresent returns true when value is present',
      (value) => {
        const some = Some(value);

        expect(some.isPresent()).toBeTruthy();
      },
    );

    it.each(Object.values(presentValues))('get returns the value', (value) => {
      const some = Some(value);

      expect(some.get()).toBe(value);
    });
  });

  describe('None', () => {
    it('constructor function returns None-object', () => {
      const none = None();

      expect(none).toBeDefined();
    });

    it('isPresent returns false', () => {
      const none = None();

      expect(none.isPresent()).toBeFalsy();
    });

    it('get throws exception', () => {
      const none = None();

      expect(() => none.get()).toThrowError('No value present');
    });
  });

  describe('Optional', () => {
    it.each(Object.values(presentValues))(
      'constructor function returns optional-object',
      (value) => {
        const optional = Optional(value);

        expect(optional).toBeDefined();
      },
    );

    it.each(Object.values(presentValues))(
      'isPresent returns true when value is present',
      (value) => {
        const optional = Optional(value);

        expect(optional.isPresent()).toBeTruthy();
      },
    );

    it.each(Object.values(presentValues))(
      'get returns the value when present',
      (value) => {
        const optional = Optional(value);

        expect(optional.get()).toBe(value);
      },
    );

    it('get throws exception when value is not present', () => {
      const optional = Optional();

      expect(() => optional.get()).toThrowError('No value present');
    });

    it('ifPresent returns applied callback value when present', () => {
      const value = Math.floor(Math.random() * 100);

      const callback = (v: number) => v + 1;

      const expected = callback(value);

      const optional = Optional(value);

      const actual = optional.ifPresent(callback);

      expect(actual).toBe(expected);
    });

    it('ifPresent throws exception when value is not present', () => {
      const optional = empty<number>();

      expect(() =>
        optional.ifPresent((value: number) => value + 1),
      ).toThrowError('No value present');
    });

    it('ifPresentOrElse returns applied ifPresent value when present', () => {
      const value = Math.floor(Math.random() * 100);

      const ifPresent = (v: number) => v + 1;

      const expected = ifPresent(value);

      const optional = Optional(value);

      const actual = optional.ifPresentOrElse(ifPresent, () => 0);

      expect(actual).toBe(expected);
    });

    it('ifPresentOrElse returns applied ifNotPresent value when not present', () => {
      const ifNotPresent = () => 0;

      const optional = empty<number>();

      const actual = optional.ifPresentOrElse(() => 1, ifNotPresent);

      expect(actual).toBe(0);
    });

    it('orElse returns the value when present', () => {
      const expected = Math.floor(Math.random() * 100);

      const alternative = expected + 1;

      const optional = Optional(expected);

      const actual = optional.orElse(alternative);

      expect(actual).toBe(expected);
    });

    it('orElse returns the alternative when not present', () => {
      const alternative = Math.floor(Math.random() * 100);

      const optional = empty<number>();

      const actual = optional.orElse(alternative);

      expect(actual).toBe(alternative);
    });

    it('orElseGet returns the value when present', () => {
      const expected = Math.floor(Math.random() * 100);

      const alternative = () => expected + 1;

      const optional = Optional(expected);

      const actual = optional.orElseGet(alternative);

      expect(actual).toBe(expected);
    });

    it("orElseGet returns the supplier's value when not present", () => {
      const expected = Math.floor(Math.random() * 100);

      const supplier = () => expected;

      const optional = empty<number>();

      const actual = optional.orElseGet(supplier);

      expect(actual).toBe(expected);
    });

    it('orElseThrow returns the value when present', () => {
      const expected = Math.floor(Math.random() * 100);

      const errorSupplier = () => new Error('No value present');

      const optional = Optional(expected);

      const actual = optional.orElseThrow(errorSupplier);

      expect(actual).toBe(expected);
    });

    it('orElseThrow throws exception when not present', () => {
      const error = class StdError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'StdError';
        }
      };

      const errorSupplier = () => new error('No value present');

      const optional = empty<number>();

      expect(() => optional.orElseThrow(errorSupplier)).toThrowError(error);
    });

    it('map returns Optional-object containing a mapped value when present', () => {
      const value = Math.floor(Math.random() * 100);

      const mapper = (v: number) => v + 1;

      const expected = mapper(value);

      const optional = Optional(value);

      const actual = optional.map(mapper);

      expect(actual.get()).toBe(expected);
    });

    it('map returns empty Optional-object when not present', () => {
      const mapper = (v: number) => v + 1;

      const optional = empty<number>();

      const actual = optional.map(mapper);

      expect(actual.isPresent()).toBeFalsy();
    });
  });

  describe('empty', () => {
    it('returns empty Optional-object', () => {
      const optional = empty();

      expect(optional).toBeDefined();
    });

    it('isPresent returns false', () => {
      const optional = empty();

      expect(optional.isPresent()).toBeFalsy();
    });
  });

  describe('nullable', () => {
    it('returns empty Optional-object when value is null', () => {
      const optional = nullable(Math.random() > 0.5 ? null : 1);

      expect(optional).toBeDefined();
    });

    it('isPresent returns false when value is null', () => {
      const optional = nullable(null);

      expect(optional.isPresent()).toBeFalsy();
    });
  });
});
