import { describe, expect, it } from 'vitest';

import { ImmutableList } from '../../../collections/list';

describe('list/common', () => {
  describe('ImmutableList', () => {
    it('constructor function returns ImmutableList-object with values', () => {
      const list = ImmutableList(['hello', 'world']);

      expect(list).toBeDefined();
    });

    it('constructor function return ImmutableList-object with not values', () => {
      const list = ImmutableList();

      expect(list).toBeDefined();
    });

    it('size returns the number of items in the list', () => {
      const count = Math.floor(Math.random() * 100);

      const items = Array.from({ length: count }, (_, index) => index);

      const list = ImmutableList(items);

      expect(list.size()).toBe(count);
    });

    it('toArray returns the items in the list', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const actual = list.toArray();

      expect(actual).toEqual(items);
      expect(actual).not.toBe(items);
    });

    it('addFirst returns a new list with the value added to the beginning', () => {
      const items = ['hello', 'world'];

      const expected = ['new', ...items];

      const list = ImmutableList(items);

      const actual = list.addFirst('new');

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('addFirstAll returns a new list with the values added to the beginning', () => {
      const items = ['hello', 'world'];

      const expected = ['new1', 'new2', ...items];

      const list = ImmutableList(items);

      const actual = list.addFirstAll('new1', 'new2');

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('addLast returns a new list with the value added to the end', () => {
      const items = ['hello', 'world'];

      const expected = [...items, 'new'];

      const list = ImmutableList(items);

      const actual = list.addLast('new');

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('addLastAll returns a new list with the values added to the end', () => {
      const items = ['hello', 'world'];

      const expected = [...items, 'new1', 'new2'];

      const list = ImmutableList(items);

      const actual = list.addLastAll('new1', 'new2');

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('remove returns a new list with holding value', () => {
      const items = ['hello', 'world'];

      const expected = ['hello'];

      const list = ImmutableList(items);

      const actual = list.remove('world');

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('remove returns a new list containing same items when value not found', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const actual = list.remove('not-found');

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(items);
    });

    it('get returns optional containing value at the specified index', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const actual = list.get(1);

      expect(actual.get()).toBe('world');
    });

    it('get returns empty optional when index is out of bounds', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const actual = list.get(2);

      expect(actual.isPresent()).toBe(false);
    });

    it('find returns optional containing value that matches the predicate', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const actual = list.find((value) => value === 'world');

      expect(actual.get()).toBe('world');
    });

    it('find returns empty optional when no value matches the predicate', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const actual = list.find((value) => value === 'not-found');

      expect(actual.isPresent()).toBe(false);
    });

    it('map returns a new list containing the mapped values', () => {
      const items = Array.from({ length: 10 }, (_, index) => index);

      const mapper = (value: number) => value * 2;

      const expected = items.map(mapper);

      const list = ImmutableList(items);

      const actual = list.map(mapper);

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('filter returns a new list containing the filtered values', () => {
      const items = Array.from({ length: 10 }, (_, index) => index);

      const predicate = (value: number) => value % 2 === 0;

      const expected = items.filter(predicate);

      const list = ImmutableList(items);

      const actual = list.filter(predicate);

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('reduce returns the result of reducing the list with the callback', () => {
      const items = Array.from({ length: 10 }, (_, index) => index);

      const callback = (accumulator: number, value: number) =>
        accumulator + value;

      const initial = 0;

      const expected = items.reduce(callback, initial);

      const list = ImmutableList(items);

      const actual = list.reduce(callback, initial);

      expect(actual).toBe(expected);
    });

    it('zip returns a new list containing the zipped values', () => {
      const items1 = ['hello', 'world'];
      const items2 = [1, 2];

      const expected = [
        ['hello', 1],
        ['world', 2],
      ];

      const list1 = ImmutableList(items1);
      const list2 = ImmutableList(items2);

      const actual = list1.zip(list2);

      expect(actual.toArray()).toEqual(expected);
    });

    it('zip returns a new list containing the zipped values with different sizes', () => {
      const items1 = ['hello', 'world'];
      const items2 = [1, 2, 3];

      const expected = [
        ['hello', 1],
        ['world', 2],
      ];

      const list1 = ImmutableList(items1);
      const list2 = ImmutableList(items2);

      const actual = list1.zip(list2);

      expect(actual.toArray()).toEqual(expected);
    });

    it('reverse returns a new list with the items in reverse order', () => {
      const items = ['hello', 'world'];

      const expected = [...items].reverse();

      const list = ImmutableList(items);

      const actual = list.reverse();

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);

      // check if the original list is not modified
      expect(list.toArray()).toEqual(items);
    });

    it('sort returns a new list with the items sorted', () => {
      const items = [3, 1, 2];

      const expected = [...items].sort((a, b) => a - b);

      const list = ImmutableList(items);

      const actual = list.sort((a, b) => a - b);

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);

      // check if the original list is not modified
      expect(list.toArray()).toEqual(items);
    });

    it('drop returns a new dropped list with the specified number of items removed', () => {
      const items = Array.from({ length: 10 }, (_, index) => index);

      const count = Math.floor(Math.random() * items.length);

      const expected = items.slice(count);

      const list = ImmutableList(items);

      const actual = list.drop(count);

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('drop returns a new dropped list with all items removed', () => {
      const items = Array.from({ length: 10 }, (_, index) => index);

      const expected: number[] = [];

      const list = ImmutableList(items);

      const actual = list.drop(items.length);

      expect(actual).not.toBe(list);
      expect(actual.toArray()).toEqual(expected);
    });

    it('foreach executes the callback for each item in the list', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const callback = (value: string) => {
        expect(items).toContain(value);
      };

      list.foreach(callback);
    });

    it('isEmpty returns true when the list is empty', () => {
      const list = ImmutableList();

      expect(list.isEmpty()).toBeTruthy();
    });

    it('isEmpty returns false when the list is not empty', () => {
      const list = ImmutableList(['hello', 'world']);

      expect(list.isEmpty()).toBeFalsy();
    });

    it('isNotEmpty returns true when the list is not empty', () => {
      const list = ImmutableList(['hello', 'world']);

      expect(list.isNotEmpty()).toBeTruthy();
    });

    it('isNotEmpty returns false when the list is empty', () => {
      const list = ImmutableList();

      expect(list.isNotEmpty()).toBeFalsy();
    });

    it('equals returns true when the lists are equal with default equality', () => {
      const items1 = ['hello', 'world'];
      const items2 = ['hello', 'world'];

      const list1 = ImmutableList(items1);
      const list2 = ImmutableList(items2);

      expect(list1.equals(list2)).toBeTruthy();
    });

    it('equals returns true when the lists are equal with custom equality', () => {
      const StdClass = class StdClass {
        constructor(public value: string) {}

        equals(comparison: StdClass): boolean {
          return this.value === comparison.value;
        }
      };

      const createItems = () =>
        Array.from(
          { length: 10 },
          (_, index) => new StdClass(`value-${index}`),
        );

      const list1 = ImmutableList(createItems());
      const list2 = ImmutableList(createItems());

      const actual = list1.equals(list2, (left, right) => left.equals(right));

      expect(actual).toBeTruthy();
    });

    it('equals returns false when the lists are not equal with default equality', () => {
      const items1 = ['hello', 'world'];
      const items2 = ['hello', 'not-world'];

      const list1 = ImmutableList(items1);
      const list2 = ImmutableList(items2);

      expect(list1.equals(list2)).toBeFalsy();
    });

    it('equals returns false when the lists are not equal with custom equality', () => {
      const StdClass = class StdClass {
        constructor(public value: string) {}

        equals(comparison: StdClass): boolean {
          return this.value === comparison.value;
        }
      };

      const createItems = () =>
        Array.from(
          { length: 10 },
          (_, index) => new StdClass(`value-${index}`),
        );

      const list1 = ImmutableList(createItems());
      const list2 = ImmutableList(
        createItems().map((item) => new StdClass(`not-${item.value}`)),
      );

      const actual = list1.equals(list2, (left, right) => left.equals(right));

      expect(actual).toBeFalsy();
    });

    it('equals returns false when the lists have different sizes', () => {
      const items1 = ['hello', 'world'];
      const items2 = ['hello', 'world', 'not-world'];

      const list1 = ImmutableList(items1);
      const list2 = ImmutableList(items2);

      expect(list1.equals(list2)).toBeFalsy();
    });

    it('exists returns true when the predicate is satisfied by at least one item', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const predicate = (value: string) => value === 'world';

      expect(list.exists(predicate)).toBeTruthy();
    });

    it('exists returns false when the predicate is not satisfied by any item', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const predicate = (value: string) => value === 'not-found';

      expect(list.exists(predicate)).toBeFalsy();
    });

    it('forall returns true when the predicate is satisfied by all items', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const predicate = (value: string) => value.length > 0;

      expect(list.forall(predicate)).toBeTruthy();
    });

    it('forall returns false when the predicate is not satisfied by at least one item', () => {
      const items = ['hello', 'world'];

      const list = ImmutableList(items);

      const predicate = (value: string) => value.length > 5;

      expect(list.forall(predicate)).toBeFalsy();
    });
  });
});
