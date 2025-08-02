import {
  ImmutableSet as SetSource,
  SetFromArray,
  Hasher,
  ImmutableMap as MapSource,
} from './collections';

export const ImmutableSet = SetSource;
export type ImmutableSet<_T> = ReturnType<ReturnType<typeof SetSource>>;
export const createSetFromArray = SetFromArray(Hasher());

export const ImmutableMap = MapSource;
export type ImmutableMap<_K, _V> = ReturnType<ReturnType<typeof MapSource>>;

export {
  Optional,
  NullableOptional,
  EmptyOptional,
  ImmutableList,
  IndexedSequence,
} from './collections';
