class NoSuchElementException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoSuchElementException';
  }
}

type ErrorConstructor<E extends Error, A extends unknown[]> = new (
  ...args: A
) => E;

export interface Some<T> {
  isPresent: () => true;
  get: () => T;
}

export const Some = <T>(value: T): Some<T> => ({
  isPresent: () => true,
  get: () => value,
});

export const None = (): None => ({
  isPresent: () => false,
  get: () => {
    throw new NoSuchElementException('No value present');
  },
});

export interface None {
  isPresent: () => false;
  get: () => never;
}

export interface Optional<T> {
  isPresent: () => boolean;
  get: () => T;
  ifPresent: <R>(callback: (value: T) => R) => R;
  ifPresentOrElse: <R>(ifPresent: (value: T) => R, ifNotPresent: () => R) => R;
  orElse: (alternative: T) => T;
  orElseGet: (supplier: () => T) => T;
  orElseThrow: <E extends Error, A extends unknown[]>(
    error?: ErrorConstructor<E, A>,
    ...args: A
  ) => T;
  map: <R>(mapper: (value: T) => R) => Optional<R>;
}

export const empty = <T>(): Optional<T> => Optional<T>(undefined);

export const nullable = <T>(value?: T | null): Optional<T> => {
  if (value === null || value === undefined) {
    return empty<T>();
  }

  return Optional<T>(value);
};

export const Optional = <T>(value?: T): Optional<T> => {
  const inner: Some<T> | None = value !== undefined ? Some(value) : None();

  const isPresent = (): boolean => inner.isPresent();

  const get = (): T => {
    return inner.get();
  };

  const ifPresent = <R>(callback: (value: T) => R): R => {
    if (isPresent()) {
      return callback(inner.get());
    }

    throw new NoSuchElementException('No value present');
  };

  const ifPresentOrElse = <R>(
    ifPresent: (value: T) => R,
    ifNotPresent: () => R,
  ): R => {
    if (isPresent()) {
      return ifPresent(inner.get());
    }

    return ifNotPresent();
  };

  const orElse = (alternative: T): T => {
    if (isPresent()) {
      return inner.get();
    }

    return alternative;
  };

  const orElseGet = (supplier: () => T): T => {
    if (isPresent()) {
      return inner.get();
    }

    return supplier();
  };

  const orElseThrow = <E extends Error, A extends unknown[]>(
    error?: ErrorConstructor<E, A>,
    ...args: A
  ): T => {
    if (isPresent()) {
      return inner.get();
    }

    throw error
      ? new error(...args)
      : new NoSuchElementException('No value present');
  };

  const map = <R>(mapper: (value: T) => R): Optional<R> => {
    if (isPresent()) {
      return Optional(mapper(inner.get()));
    }

    return empty<R>();
  };

  return {
    isPresent,
    get,
    ifPresent,
    ifPresentOrElse,
    orElse,
    orElseGet,
    orElseThrow,
    map,
  };
};
