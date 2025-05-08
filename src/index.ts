import { ImmutableSet as SetSource, SetFromArray, Hasher } from './collections';

export const ImmutableSet = SetSource(Hasher());
export type ImmutableSet<T> = SetSource<T>;
export const createSetFromArray = SetFromArray(Hasher());

export {
  Optional,
  NullableOptional,
  EmptyOptional,
  ImmutableList,
} from './collections';
