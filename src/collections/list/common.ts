import { NullableOptional } from '../optional';
import { Optional } from '../optional/common';

export interface ImmutableList<T> {
  size: () => number;
  toArray: () => T[];
  addFirst: (value: T) => ImmutableList<T>;
  addFirstAll: (...values: T[]) => ImmutableList<T>;
  addLast: (value: T) => ImmutableList<T>;
  addLastAll: (...values: T[]) => ImmutableList<T>;
  remove: (value: T) => ImmutableList<T>;
  get: (index: number) => Optional<T>;
  find: (predicate: (value: T) => boolean) => Optional<T>;
  first: () => Optional<T>;
  last: () => Optional<T>;
  map: <R>(mapper: (value: T) => R) => ImmutableList<R>;
  filter: (predicate: (value: T) => boolean) => ImmutableList<T>;
  reduce: <R>(callback: (accumulator: R, value: T) => R, initial: R) => R;
  zip: <V>(other: ImmutableList<V>) => ImmutableList<[T, V]>;
  reverse: () => ImmutableList<T>;
  sort: (comparer?: (left: T, right: T) => number) => ImmutableList<T>;
  drop: (count: number) => ImmutableList<T>;
  foreach: (callback: (value: T) => void) => void;
  isEmpty: () => boolean;
  isNotEmpty: () => boolean;
  equals: (
    comparison: ImmutableList<T>,
    callback?: (left: T, right: T) => boolean,
  ) => boolean;
  exists: (predicate: (value: T) => boolean) => boolean;
  forall: (predicate: (value: T) => boolean) => boolean;
}

export const ImmutableList = <T>(values: T[] = []): ImmutableList<T> => {
  const items = [...values];

  const size = () => items.length;

  const toArray = () => [...items];

  const addFirst = (value: T): ImmutableList<T> =>
    ImmutableList([value, ...items]);

  const addFirstAll = (...values: T[]): ImmutableList<T> =>
    ImmutableList([...values, ...items]);

  const addLast = (value: T): ImmutableList<T> =>
    ImmutableList([...items, value]);

  const addLastAll = (...values: T[]): ImmutableList<T> =>
    ImmutableList([...items, ...values]);

  const remove = (value: T): ImmutableList<T> => {
    const index = items.indexOf(value);

    if (index === -1) {
      return ImmutableList(items);
    }

    return ImmutableList([...items.slice(0, index), ...items.slice(index + 1)]);
  };

  const get = (index: number): Optional<T> => Optional(items[index]);

  const find = (predicate: (value: T) => boolean): Optional<T> => {
    const target = items.find(predicate);

    return Optional(target);
  };

  const first = (): Optional<T> => NullableOptional(items[0]);

  const last = (): Optional<T> => NullableOptional(items[items.length - 1]);

  const map = <R>(mapper: (value: T) => R): ImmutableList<R> => {
    const mapped = items.map(mapper);

    return ImmutableList(mapped);
  };

  const filter = (predicate: (value: T) => boolean): ImmutableList<T> => {
    const filtered = items.filter(predicate);

    return ImmutableList(filtered);
  };

  const reduce = <R>(
    callback: (accumulator: R, value: T) => R,
    initial: R,
  ): R => {
    return items.reduce(callback, initial);
  };

  const zip = <V>(other: ImmutableList<V>): ImmutableList<[T, V]> => {
    const count = Math.min(items.length, other.size());

    const zipped = [...Array(count)].map((_, index): [T, V] => [
      items[index],
      other.get(index).get(),
    ]);

    return ImmutableList(zipped);
  };

  const reverse = (): ImmutableList<T> => {
    const reversed = Array.from(items).reverse();

    return ImmutableList(reversed);
  };

  const sort = (comparer?: (left: T, right: T) => number): ImmutableList<T> => {
    const sorted = Array.from(items).sort(comparer);

    return ImmutableList(sorted);
  };

  const drop = (count: number): ImmutableList<T> => {
    if (count <= 0) {
      return ImmutableList(items);
    }

    const dropped = items.slice(count);

    return ImmutableList(dropped);
  };

  const foreach = (callback: (value: T) => void): void => {
    items.forEach(callback);
  };

  const isEmpty = () => items.length === 0;

  const isNotEmpty = () => !isEmpty();

  const equals = (
    comparison: ImmutableList<T>,
    callback: (left: T, right: T) => boolean = (left, right) => left === right,
  ): boolean => {
    const selfSize = size();

    if (selfSize !== comparison.size()) {
      return false;
    }

    return zip(comparison)
      .map(([left, right]) => {
        return callback(left, right);
      })
      .filter((value) => !value)
      .isEmpty();
  };

  const exists = (predicate: (value: T) => boolean): boolean => {
    return items.some(predicate);
  };

  const forall = (predicate: (value: T) => boolean): boolean => {
    return items.every(predicate);
  };

  return {
    size,
    isEmpty,
    isNotEmpty,
    toArray,
    addFirst,
    addFirstAll,
    addLast,
    addLastAll,
    remove,
    get,
    find,
    first,
    last,
    map,
    filter,
    reduce,
    zip,
    reverse,
    sort,
    drop,
    foreach,
    equals,
    exists,
    forall,
  };
};
