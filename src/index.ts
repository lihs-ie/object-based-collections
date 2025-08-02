import {
  ImmutableSet as SetSource,
  SetFromArray,
  Hasher,
  ImmutableMap as MapSource,
  MapFromArray,
  MapFromObject,
} from './collections';

export const ImmutableSet = SetSource(Hasher());
export type ImmutableSet<T> = SetSource<T>;
export const createSetFromArray = SetFromArray(Hasher());

export const ImmutableMap = MapSource(Hasher());
export type ImmutableMap<K, V> = MapSource<K, V>;
export const createMapFromArray = MapFromArray(Hasher());
export const createMapFromObject = MapFromObject(Hasher());

export {
  Optional,
  NullableOptional,
  EmptyOptional,
  ImmutableList,
  IndexedSequence,
} from './collections';
