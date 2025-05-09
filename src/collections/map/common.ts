import { HAMTNode, type Hasher, BitmapIndexedNode, LeafNode } from '../hamt';
import { Optional } from '../optional/common';

export interface ImmutableMap<K, V> {
  add: (key: K, value: V) => ImmutableMap<K, V>;
  remove: (key: K) => ImmutableMap<K, V>;
  get: (key: K) => Optional<V>;
  contains: (key: K) => boolean;
  size: () => number;
  isEmpty: () => boolean;
  isNotEmpty: () => boolean;
  toArray: () => [K, V][];
  foreach: (callback: (key: K, value: V) => void) => void;
  find: (predicate: (key: K, value: V) => boolean) => Optional<V>;
  exists: (predicate: (key: K, value: V) => boolean) => boolean;
  equals: (
    comparison: ImmutableMap<K, V>,
    callback?: (left: V, right: V) => boolean,
  ) => boolean;
  map: <RK, RV>(mapper: (key: K, value: V) => [RK, RV]) => ImmutableMap<RK, RV>;
  mapKeys: <RK>(mapper: (key: K) => RK) => ImmutableMap<RK, V>;
  mapValues: <RV>(mapper: (value: V) => RV) => ImmutableMap<K, RV>;
  filter: (predicate: (key: K, value: V) => boolean) => ImmutableMap<K, V>;
}

export const ImmutableMap =
  (hasher: Hasher) =>
  <K, V>(root: HAMTNode<K, V> | null = null): ImmutableMap<K, V> => {
    const toArray = (): [K, V][] => root?.toArray() || [];

    const size = (): number => toArray().length;

    const isEmpty = (): boolean => size() === 0;

    const isNotEmpty = (): boolean => !isEmpty();

    const add = (key: K, value: V): ImmutableMap<K, V> => {
      const hash = hasher.hash(key);

      if (root === null) {
        return ImmutableMap(hasher)(LeafNode(hash, key, value));
      }

      return ImmutableMap(hasher)(root.add(hash, 0, key, value));
    };

    const remove = (key: K): ImmutableMap<K, V> =>
      ImmutableMap(hasher)(root?.remove(hasher.hash(key), 0));

    const get = (key: K): Optional<V> => {
      const hash = hasher.hash(key);

      return Optional<V>(root?.get(hash, 0));
    };

    const contains = (key: K): boolean => {
      const hash = hasher.hash(key);

      return root?.contains(hash, 0) || false;
    };

    const foreach = (callback: (key: K, value: V) => void): void => {
      const items = toArray();

      items.forEach(([key, value]): void => callback(key, value));
    };

    const find = (predicate: (key: K, value: V) => boolean): Optional<V> => {
      return Optional(root?.find(predicate)?.value());
    };

    const exists = (predicate: (key: K, value: V) => boolean): boolean => {
      return root?.exists(predicate) || false;
    };

    const equals = (
      comparison: ImmutableMap<K, V>,
      callback: (left: V, right: V) => boolean = (left, right) =>
        left === right,
    ): boolean => {
      if (size() !== comparison.size()) {
        return false;
      }

      const selfItems = toArray();

      return selfItems.every(([key, value]): boolean => {
        if (!comparison.contains(key)) {
          return false;
        }

        const comparisonValue = comparison.get(key).get();

        return callback(value, comparisonValue);
      });
    };

    const map = <RK, RV>(
      mapper: (key: K, value: V) => [RK, RV],
    ): ImmutableMap<RK, RV> => {
      const mapped = toArray().map(([key, value]): [RK, RV] =>
        mapper(key, value),
      );

      return fromArray(hasher)(mapped);
    };

    const mapKeys = <RK>(mapper: (key: K) => RK): ImmutableMap<RK, V> => {
      const mapped = toArray().map(([key, value]): [RK, V] => [
        mapper(key),
        value,
      ]);

      return fromArray(hasher)(mapped);
    };

    const mapValues = <RV>(mapper: (value: V) => RV): ImmutableMap<K, RV> => {
      const mapped = toArray().map(([key, value]): [K, RV] => [
        key,
        mapper(value),
      ]);

      return fromArray(hasher)(mapped);
    };

    const filter = (
      predicate: (key: K, value: V) => boolean,
    ): ImmutableMap<K, V> => {
      const filtered = toArray().filter(([key, value]): boolean =>
        predicate(key, value),
      );

      return fromArray(hasher)(filtered);
    };

    return {
      add,
      remove,
      get,
      contains,
      size,
      isEmpty,
      isNotEmpty,
      toArray,
      foreach,
      find,
      exists,
      equals,
      map,
      mapKeys,
      mapValues,
      filter,
    };
  };

export const fromArray =
  (hasher: Hasher) =>
  <K, V>(items: [K, V][]): ImmutableMap<K, V> => {
    const root = items.reduce<HAMTNode<K, V>>((carry, [key, value]) => {
      const hash = hasher.hash(key);

      return carry.add(hash, 0, key, value);
    }, BitmapIndexedNode<K, V>());

    return ImmutableMap(hasher)(root);
  };

type ObjectKey = string | number | symbol;

export const fromObject =
  (hasher: Hasher) =>
  <K extends ObjectKey, V>(items: Record<K, V>): ImmutableMap<K, V> => {
    const root = Object.entries<V>(items).reduce<HAMTNode<K, V>>(
      (carry, [key, value]) => {
        const hash = hasher.hash(key);

        return carry.add(hash, 0, key as K, value);
      },
      BitmapIndexedNode<K, V>(),
    );

    return ImmutableMap(hasher)(root);
  };
