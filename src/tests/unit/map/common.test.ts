import { describe, it, expect, expectTypeOf } from 'vitest';

import {
  ImmutableList,
  ImmutableMap,
  ImmutableSet,
  Optional,
  createMapFromArray,
  createMapFromObject,
} from '../../..';

const createArrayItems = <K, V>(
  count = 10,
  make: (index: number) => [K, V],
): [K, V][] => {
  return Array.from({ length: count }, (_, index) => make(index));
};

class Std<T> {
  constructor(public readonly value: T) {}
}

const arrayItems: Record<string, [unknown, unknown][]> = {
  empty: [],
  numbers: createArrayItems<number, number>(10, (index) => [index, index * 2]),
  strings: createArrayItems<string, string>(10, (index) => [
    `key${index}`,
    `value${index}`,
  ]),
  objects: createArrayItems<{ id: number }, { name: string }>(10, (index) => [
    { id: index },
    { name: `value${index}` },
  ]),
  booleans: createArrayItems<boolean, boolean>(2, (index) => [
    index % 2 === 0,
    index % 2 === 0,
  ]),
  class: createArrayItems<Std<number>, Std<number>>(10, (index) => [
    new Std(index),
    new Std(index * 2),
  ]),
  arrays: createArrayItems<number[], number[]>(10, (index) => [
    [index, index * 2],
    [index * 2, index],
  ]),
  symbols: createArrayItems<symbol, string>(10, (index) => [
    Symbol(`key${index}`),
    `value${index}`,
  ]),
};

type ObjectKey = string | number | symbol;

const createObjectItems = <K extends ObjectKey, V>(
  count = 10,
  make: (index: number) => [K, V],
): Record<K, V> => {
  return Object.fromEntries(createArrayItems<K, V>(count, make)) as Record<
    K,
    V
  >;
};

const objectItems: Record<string, Record<ObjectKey, unknown>> = {
  empty: {},
  numbers: createObjectItems<number, number>(10, (index) => [index, index * 2]),
  strings: createObjectItems<string, string>(10, (index) => [
    `key${index}`,
    `value${index}`,
  ]),
  objects: createObjectItems<string, { name: string }>(10, (index) => [
    `key${index}`,
    { name: `value${index}` },
  ]),
  booleans: createObjectItems<string, boolean>(10, (index) => [
    `key${index}`,
    index % 2 === 0,
  ]),
  class: createObjectItems<string, Std<number>>(10, (index) => [
    `key${index}`,
    new Std(index),
  ]),
  arrays: createObjectItems<string, number[]>(10, (index) => [
    `key${index}`,
    [index, index * 2],
  ]),
  symbols: createObjectItems<symbol, string>(10, (index) => [
    Symbol(`key${index}`),
    `value${index}`,
  ]),
};

describe('map/common', () => {
  describe('ImmutableMap', () => {
    it('constructor function returns ImmutableMap-object', () => {
      const map = ImmutableMap();

      expect(map).toBeDefined();
    });

    it.each(Object.entries(arrayItems))(
      'fromArray returns ImmutableMap-object',
      (_, items) => {
        const map = createMapFromArray(items);

        expect(map).toBeDefined();
        expectTypeOf(map).toEqualTypeOf<ImmutableMap<unknown, unknown>>();
        expect(map.size()).toBe(items.length);
        expect(map.toArray()).toEqual(expect.arrayContaining(items));
      },
    );

    it.each(Object.entries(objectItems))(
      'fromObject returns ImmutableMap-object',
      (_, items) => {
        const map = createMapFromObject(items);

        expect(map).toBeDefined();
        expectTypeOf(map).toEqualTypeOf<ImmutableMap<ObjectKey, unknown>>();

        expect(map.size()).toBe(Object.keys(items).length);
        expect(map.toArray()).toEqual(
          expect.arrayContaining(
            Object.entries(items).map(([key, value]) => [key, value]),
          ),
        );
      },
    );

    it('toArray returns array of tuples', () => {
      const numbers: [number, number][] = [
        [1, 2],
        [3, 4],
      ];

      const map1 = ImmutableMap<number, number>();
      const map2 = createMapFromArray(numbers);

      const actual1 = map1.toArray();
      const actual2 = map2.toArray();

      expect(actual1).toEqual([]);
      expect(actual2).toEqual(numbers);
    });

    it('toObject returns object of key-value pairs', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const actual = map.toObject();

      const expected = Object.fromEntries(numbers);

      expect(actual).toEqual(expected);
    });

    it('toList returns ImmutableList containing the map values', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const expectedArray = numbers.map(([, value]) => value);

      const map = createMapFromArray(numbers);

      const actual = map.toList();

      expectTypeOf(actual).toEqualTypeOf<ImmutableList<number>>();
      expect(actual.size()).toBe(numbers.length);
      expect(actual.toArray()).toEqual(expect.arrayContaining(expectedArray));
    });

    it('toSet returns ImmutableSet containing the map keys', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const expectedArray = numbers.map(([key]) => key);

      const map = createMapFromArray(numbers);

      const actual = map.toSet();

      expectTypeOf(actual).toEqualTypeOf<ImmutableSet<number>>();
      expect(actual.size()).toBe(numbers.length);
      expect(actual.toArray()).toEqual(expect.arrayContaining(expectedArray));
    });

    it('size returns number of elements in map', () => {
      const numbers: [number, number][] = [
        [1, 2],
        [3, 4],
      ];

      const map1 = ImmutableMap<number, number>();
      const map2 = createMapFromArray(numbers);

      const actual1 = map1.size();
      const actual2 = map2.size();

      expect(actual1).toBe(0);
      expect(actual2).toBe(2);
    });

    it('isEmpty returns true if map is empty', () => {
      const numbers: [number, number][] = [
        [1, 2],
        [3, 4],
      ];

      const map1 = ImmutableMap<number, number>();
      const map2 = createMapFromArray(numbers);

      const actual1 = map1.isEmpty();
      const actual2 = map2.isEmpty();

      expect(actual1).toBeTruthy();
      expect(actual2).toBeFalsy();
    });

    it('isNotEmpty returns true if map is not empty', () => {
      const numbers: [number, number][] = [
        [1, 2],
        [3, 4],
      ];

      const map1 = ImmutableMap<number, number>();
      const map2 = createMapFromArray(numbers);

      const actual1 = map1.isNotEmpty();
      const actual2 = map2.isNotEmpty();

      expect(actual1).toBeFalsy();
      expect(actual2).toBeTruthy();
    });

    it('add returns a new ImmutableMap with the key and value added', () => {
      const numbers: [number, number][] = [
        [1, 2],
        [3, 4],
      ];

      const key = Math.floor(Math.random() * 100) + 4;
      const value = Math.floor(Math.random() * 100);

      const map1 = ImmutableMap<number, number>();
      const map2 = createMapFromArray(numbers);

      const actual1 = map1.add(key, value);
      const actual2 = map2.add(key, value);

      expectTypeOf(actual1).toEqualTypeOf<ImmutableMap<number, number>>();
      expectTypeOf(actual2).toEqualTypeOf<ImmutableMap<number, number>>();

      expect(actual1.size()).toBe(1);
      expect(actual2.size()).toBe(3);

      expect(actual1.contains(key)).toBeTruthy();
      expect(actual2.contains(key)).toBeTruthy();

      expect(actual1.toArray()).toEqual([[key, value]]);
      expect(actual2.toArray()).toEqual(
        expect.arrayContaining([...numbers, [key, value]]),
      );
    });

    it.each(Object.entries(arrayItems))(
      'add returns same ImmutableMap with same key and value',
      (_, items) => {
        const map = createMapFromArray(items);

        const actual = items.reduce(
          (carry, [key, value]) => carry.add(key, value),
          map,
        );

        expectTypeOf(actual).toEqualTypeOf<ImmutableMap<unknown, unknown>>();
        expect(actual.size()).toBe(items.length);
        expect(actual.toArray()).toEqual(expect.arrayContaining(items));
      },
    );

    it('remove returns a new ImmutableMap with the key removed', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const [targetKey] = numbers[Math.floor(Math.random() * numbers.length)];

      const map = createMapFromArray(numbers);

      const actual = map.remove(targetKey);

      expectTypeOf(actual).toEqualTypeOf<ImmutableMap<number, number>>();
      expect(actual).not.toBe(map);
      expect(actual.contains(targetKey)).toBeFalsy();

      ImmutableList(numbers)
        .filter(([key]) => key !== targetKey)
        .foreach(([key]) => {
          expect(actual.contains(key)).toBeTruthy();
        });
    });

    it('remove returns same ImmutableMap with missing key', () => {
      const classes = ImmutableList(
        createArrayItems<Std<number>, Std<number>>(10, (index) => [
          new Std(index),
          new Std(index * 2),
        ]),
      );

      const missing = classes.first().get();

      const map = createMapFromArray(classes.drop(1).toArray());

      const actual = map.remove(missing[0]);

      expectTypeOf(actual).toEqualTypeOf<
        ImmutableMap<Std<number>, Std<number>>
      >();
      expect(actual.contains(missing[0])).toBeFalsy();

      classes
        .filter((item) => item[0] !== missing[0])
        .foreach(([key]) => {
          expect(actual.contains(key)).toBeTruthy();
        });
    });

    it('remove returns a new empty ImmutableMap if the map is empty', () => {
      const map = ImmutableMap<number, number>();

      const actual = map.remove(1);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<ImmutableMap<number, number>>();
      expect(actual).not.toBe(map);

      expect(actual.isEmpty()).toBeTruthy();
    });

    it('get returns Optional containing the value with holding key', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const [targetKey, targetValue] =
        numbers[Math.floor(Math.random() * numbers.length)];

      const map = createMapFromArray(numbers);

      const actual = map.get(targetKey);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Optional<number>>();
      expect(actual.isPresent()).toBeTruthy();
      expect(actual.get()).toEqual(targetValue);
    });

    it('get returns empty Optional with not holding key', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const actual = map.get(100);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Optional<number>>();
      expect(actual.isPresent()).toBeFalsy();
    });

    it('get returns empty Optional with empty map', () => {
      const map = ImmutableMap<number, number>();

      const actual = map.get(1);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Optional<number>>();
      expect(actual.isPresent()).toBeFalsy();
    });

    it('reduce returns the result of reducing the map with the callback', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const expected = numbers.reduce(
        (carry, [key, value]) => carry + key + value,
        0,
      );

      const map = createMapFromArray(numbers);

      const actual = map.reduce((carry, key, value) => carry + key + value, 0);

      expect(actual).toBe(expected);
    });

    it('keys returns array of keys in the map', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const actual = map.keys();

      const expected = numbers.map(([key]) => key);

      expect(actual).toEqual(expected);
    });

    it('values returns array of values in the map', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const actual = map.values();

      const expected = numbers.map(([, value]) => value);

      expect(actual).toEqual(expected);
    });

    it('contains returns true if the key is in the map', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      numbers.forEach(([key]) => {
        expect(map.contains(key)).toBeTruthy();
      });
    });

    it('contains returns false if the key is not in the map', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      expect(map.contains(11)).toBeFalsy();
    });

    it('foreach calls the callback for each key and value', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const actual: [number, number][] = [];

      map.foreach((key, value) => {
        actual.push([key, value]);
      });

      expect(actual).toEqual(numbers);
    });

    it('find returns Optional containing the value when founded by predicate', () => {
      const classes = createArrayItems<Std<number>, Std<number>>(
        10,
        (index) => [new Std(index), new Std(index * 2)],
      );

      const [targetKey, targetValue] =
        classes[Math.floor(Math.random() * classes.length)];

      const map = createMapFromArray(classes);

      const predicate = (key: Std<number>, value: Std<number>) =>
        targetKey === key && targetValue.value === value.value;

      const actual = map.find(predicate);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Optional<Std<number>>>();
      expect(actual.isPresent()).toBeTruthy();
      expect(actual.get()).toBe(targetValue);
    });

    it('find returns empty Optional when not founded by predicate', () => {
      const classes = createArrayItems<Std<number>, Std<number>>(
        10,
        (index) => [new Std(index), new Std(index * 2)],
      );

      const map = createMapFromArray(classes);

      const predicate = (key: Std<number>, value: Std<number>) =>
        key.value === 11 && value.value === 22;

      const actual = map.find(predicate);

      expect(actual).toBeDefined();
      expectTypeOf(actual).toEqualTypeOf<Optional<Std<number>>>();
      expect(actual.isPresent()).toBeFalsy();
    });

    it('exists returns true if exist at least one item by predicate', () => {
      const classes = ImmutableList(
        createArrayItems<Std<number>, Std<number>>(10, (index) => [
          new Std(index),
          new Std(index * 2),
        ]),
      );

      const map = createMapFromArray(classes.toArray());

      const target = classes.last().get();

      const predicate = (_: Std<number>, value: Std<number>) =>
        target[1].value === value.value;

      const actual = map.exists(predicate);

      expect(actual).toBeTruthy();
    });

    it('exists returns false if not exist any item by predicate', () => {
      const classes = ImmutableList(
        createArrayItems<Std<number>, Std<number>>(10, (index) => [
          new Std(index),
          new Std(index * 2),
        ]),
      );

      const map = createMapFromArray(classes.toArray());

      const predicate = (_: Std<number>, value: Std<number>) =>
        value.value === 1;

      const actual = map.exists(predicate);

      expect(actual).toBeFalsy();
    });

    it('equals returns true if the maps are equal with default callback', () => {
      const numbers = ImmutableList(
        createArrayItems<number, number>(10, (index) => [index, index * 2]),
      );

      const map1 = createMapFromArray(numbers.toArray());
      const map2 = createMapFromArray(numbers.toArray());

      const actual1 = map1.equals(map2);
      const actual2 = map2.equals(map1);

      expect(actual1).toBeTruthy();
      expect(actual2).toBeTruthy();
    });

    it('equals returns true if the maps are equal with custom callback', () => {
      const classes = ImmutableList(
        createArrayItems<Std<number>, Std<number>>(10, (index) => [
          new Std(index),
          new Std(index * 2),
        ]),
      );

      const map1 = createMapFromArray(classes.toArray());
      const map2 = createMapFromArray(classes.toArray());

      const callback = (left: Std<number>, right: Std<number>) =>
        left.value === right.value;

      const actual1 = map1.equals(map2, callback);
      const actual2 = map2.equals(map1, callback);

      expect(actual1).toBeTruthy();
      expect(actual2).toBeTruthy();
    });

    it('equals returns false if the maps are not equal with default callback', () => {
      const numbers1 = ImmutableList(
        createArrayItems<number, number>(10, (index) => [index, index * 2]),
      );

      const numbers2 = ImmutableList(
        createArrayItems<number, number>(10, (index) => [index, index * 3]),
      );

      const map1 = createMapFromArray(numbers1.toArray());
      const map2 = createMapFromArray(numbers2.toArray());

      const actual1 = map1.equals(map2);
      const actual2 = map2.equals(map1);

      expect(actual1).toBeFalsy();
      expect(actual2).toBeFalsy();
    });

    it('equals returns false if the maps are not equal with custom callback', () => {
      const classes1 = ImmutableList(
        createArrayItems<Std<number>, Std<number>>(10, (index) => [
          new Std(index),
          new Std(index * 2),
        ]),
      );

      const classes2 = ImmutableList(
        createArrayItems<Std<number>, Std<number>>(10, (index) => [
          new Std(index),
          new Std(index * 3),
        ]),
      );

      const map1 = createMapFromArray(classes1.toArray());
      const map2 = createMapFromArray(classes2.toArray());

      const callback = (left: Std<number>, right: Std<number>) =>
        left.value === right.value;

      const actual1 = map1.equals(map2, callback);
      const actual2 = map2.equals(map1, callback);

      expect(actual1).toBeFalsy();
      expect(actual2).toBeFalsy();
    });

    it('equals returns false if the maps are not equal with different size', () => {
      const numbers1 = ImmutableList(
        createArrayItems<number, number>(10, (index) => [index, index * 2]),
      );

      const numbers2 = ImmutableList(
        createArrayItems<number, number>(20, (index) => [index, index * 3]),
      );

      const map1 = createMapFromArray(numbers1.toArray());
      const map2 = createMapFromArray(numbers2.toArray());

      const actual1 = map1.equals(map2);
      const actual2 = map2.equals(map1);

      expect(actual1).toBeFalsy();
      expect(actual2).toBeFalsy();
    });

    it('map returns a new ImmutableMap with the callback applied to each value', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const mapper = (key: number, value: number): [number, number] => [
        key,
        value + 1,
      ];

      const expectedItems = numbers.map(([key, value]) => [key, value + 1]);

      const actual = map.map(mapper);

      expectTypeOf(actual).toEqualTypeOf<ImmutableMap<number, number>>();
      expect(actual.size()).toBe(numbers.length);

      expectedItems.forEach(([key, value]) => {
        expect(actual.contains(key)).toBeTruthy();
        expect(actual.get(key).get()).toEqual(value);
      });
    });

    it('mapKeys returns a new ImmutableMap with the keys mapped', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const mapper = (key: number): number => key * 2;

      const expectedItems = numbers.map(([key, value]) => [mapper(key), value]);

      const actual = map.mapKeys(mapper);

      expectTypeOf(actual).toEqualTypeOf<ImmutableMap<number, number>>();
      expect(actual.size()).toBe(numbers.length);

      expectedItems.forEach(([key, value]) => {
        expect(actual.contains(key)).toBeTruthy();
        expect(actual.get(key).get()).toEqual(value);
      });
    });

    it('mapValues returns a new ImmutableMap with the values mapped', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const mapper = (value: number): number => value + 1;

      const expectedItems = numbers.map(([key, value]) => [key, mapper(value)]);

      const actual = map.mapValues(mapper);

      expectTypeOf(actual).toEqualTypeOf<ImmutableMap<number, number>>();
      expect(actual.size()).toBe(numbers.length);

      expectedItems.forEach(([key, value]) => {
        expect(actual.contains(key)).toBeTruthy();
        expect(actual.get(key).get()).toEqual(value);
      });
    });

    it('filter returns a new ImmutableMap with the items filtered by predicate', () => {
      const numbers = createArrayItems<number, number>(10, (index) => [
        index,
        index * 2,
      ]);

      const map = createMapFromArray(numbers);

      const predicate = (key: number, value: number): boolean =>
        key % 2 === 0 && value % 2 === 0;

      const expectedItems = numbers.filter(([key, value]) =>
        predicate(key, value),
      );

      const actual = map.filter(predicate);

      expectTypeOf(actual).toEqualTypeOf<ImmutableMap<number, number>>();
      expect(actual.size()).toBe(expectedItems.length);

      expectedItems.forEach(([key, value]) => {
        expect(actual.contains(key)).toBeTruthy();
        expect(actual.get(key).get()).toEqual(value);
      });
    });
  });
});
