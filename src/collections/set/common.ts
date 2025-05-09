import { type Hasher, HAMTNode, LeafNode, BitmapIndexedNode } from '../hamt';
import { ImmutableList } from '../list';
import { ImmutableMap, MapFromArray } from '../map';
import { NullableOptional, Optional } from '../optional';

export interface ImmutableSet<K> {
  size: () => number;
  toArray: () => K[];
  toList: () => ImmutableList<K>;
  toMap: () => ImmutableMap<number, K>;
  isEmpty: () => boolean;
  isNotEmpty: () => boolean;
  add: (key: K) => ImmutableSet<K>;
  addAll: (...keys: K[]) => ImmutableSet<K>;
  remove: (key: K) => ImmutableSet<K>;
  contains: (key: K) => boolean;
  find: (predicate: (key: K) => boolean) => Optional<K>;
  reduce: <R>(callback: (accumulator: R, key: K) => R, initial: R) => R;
  map: <R>(mapper: (key: K) => R) => ImmutableSet<R>;
  filter: (predicate: (key: K) => boolean) => ImmutableSet<K>;
  forEach: (callback: (key: K) => void) => void;
  equals: (other: ImmutableSet<K>) => boolean;
  exists: (predicate: (key: K) => boolean) => boolean;
}

type Void = undefined;
const voidValue: Void = undefined;

export const ImmutableSet =
  (hasher: Hasher) =>
  <K>(root: HAMTNode<K, Void> | null = null): ImmutableSet<K> => {
    const toArray = (): K[] => root?.toArray().map(([key]) => key) || [];

    const toList = (): ImmutableList<K> => ImmutableList(toArray());

    const toMap = (): ImmutableMap<number, K> => {
      return MapFromArray(hasher)(
        toArray().map((item, index) => [index, item]),
      );
    };

    const size = (): number => toArray().length;

    const isEmpty = (): boolean => size() === 0;

    const isNotEmpty = (): boolean => !isEmpty();

    const add = (key: K): ImmutableSet<K> => {
      const hash = hasher.hash(key);

      if (root === null) {
        return ImmutableSet(hasher)(LeafNode(hash, key, voidValue));
      }

      return ImmutableSet(hasher)(root.add(hash, 0, key, voidValue));
    };

    const addAll = (...keys: K[]): ImmutableSet<K> => {
      const nextRoot = keys.reduce(
        (carry, current): HAMTNode<K, Void> =>
          carry.add(hasher.hash(current), 0, current, voidValue),
        root || BitmapIndexedNode<K, Void>(),
      );

      return ImmutableSet(hasher)(nextRoot);
    };

    const remove = (key: K): ImmutableSet<K> => {
      const hash = hasher.hash(key);

      if (root === null) {
        return ImmutableSet(hasher)(null);
      }

      return ImmutableSet(hasher)(root.remove(hash, 0));
    };

    const contains = (key: K): boolean => {
      const hash = hasher.hash(key);

      if (root === null) {
        return false;
      }

      return root.contains(hash, 0);
    };

    const find = (predicate: (key: K) => boolean): Optional<K> => {
      return NullableOptional(root?.find(predicate)?.key());
    };

    const reduce = <R>(
      callback: (accumulator: R, key: K) => R,
      initial: R,
    ): R => {
      return toArray().reduce<R>((carry, key): R => {
        return callback(carry, key);
      }, initial);
    };

    const map = <R>(mapper: (key: K) => R): ImmutableSet<R> => {
      const mapped = root?.toArray().map(([key]) => mapper(key)) || [];

      return fromArray(hasher)(mapped);
    };

    const filter = (predicate: (key: K) => boolean): ImmutableSet<K> => {
      const filtered = toArray().filter(predicate);

      return fromArray(hasher)(filtered);
    };

    const forEach = (callback: (key: K) => void): void => {
      const items = toArray();

      items.forEach((key): void => callback(key));
    };

    const equals = (comparison: ImmutableSet<K>): boolean => {
      if (size() !== comparison.size()) {
        return false;
      }

      return toArray().every((key): boolean => comparison.contains(key));
    };

    const exists = (predicate: (key: K) => boolean): boolean => {
      return root?.exists(predicate) || false;
    };

    return {
      size,
      toArray,
      toList,
      toMap,
      isEmpty,
      isNotEmpty,
      add,
      addAll,
      remove,
      contains,
      find,
      reduce,
      map,
      filter,
      forEach,
      equals,
      exists,
    };
  };

export const fromArray =
  (hasher: Hasher) =>
  <T>(keys: T[]): ImmutableSet<T> => {
    const root = keys.reduce<HAMTNode<T, Void>>(
      (carry, current): HAMTNode<T, Void> =>
        carry.add(hasher.hash(current), 0, current, voidValue),
      BitmapIndexedNode<T, Void>(),
    );

    return ImmutableSet(hasher)(root);
  };
