/**
 * Immutable Queue implementation based on Java's Queue interface
 * Provides FIFO (First-In-First-Out) operations with functional programming principles
 */

import { Optional } from '../optional/common';

class NoSuchElementException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoSuchElementException';
  }
}

export interface Queue<T> {
  size: () => number;
  isEmpty: () => boolean;
  isNotEmpty: () => boolean;
  toArray: () => T[];

  // Core Queue operations based on Java Queue interface
  add: (element: T) => Queue<T>;
  offer: (element: T) => Queue<T>;
  remove: () => Queue<T>;
  poll: () => { queue: Queue<T>; element: Optional<T> };
  element: () => T;
  peek: () => Optional<T>;

  // Additional utility methods
  addAll: (...elements: T[]) => Queue<T>;
  clear: () => Queue<T>;
  contains: (element: T) => boolean;
  equals: (other: Queue<T>, compareFn?: (a: T, b: T) => boolean) => boolean;
  foreach: (callback: (element: T) => void) => void;
  map: <R>(mapper: (element: T) => R) => Queue<R>;
  filter: (predicate: (element: T) => boolean) => Queue<T>;
}

export const Queue = <T>(elements: T[] = []): Queue<T> => {
  const items = [...elements];

  const size = (): number => items.length;

  const isEmpty = (): boolean => items.length === 0;

  const isNotEmpty = (): boolean => !isEmpty();

  const toArray = (): T[] => [...items];

  // Adds an element to the rear of the queue
  // Equivalent to Java's add() method
  const add = (element: T): Queue<T> => Queue([...items, element]);

  // Adds an element to the rear of the queue
  // Equivalent to Java's offer() method (same as add for unbounded queue)
  const offer = (element: T): Queue<T> => add(element);

  // Removes and returns the head of the queue
  // Throws exception if queue is empty (equivalent to Java's remove())
  const remove = (): Queue<T> => {
    if (isEmpty()) {
      throw new NoSuchElementException('Queue is empty');
    }
    return Queue(items.slice(1));
  };

  // Removes and returns the head of the queue
  // Returns Optional.empty() if queue is empty (equivalent to Java's poll())
  const poll = (): { queue: Queue<T>; element: Optional<T> } => {
    if (isEmpty()) {
      return { queue: Queue(items), element: Optional<T>() };
    }
    return {
      queue: Queue(items.slice(1)),
      element: Optional(items[0]),
    };
  };

  // Returns the head of the queue without removing it
  // Throws exception if queue is empty (equivalent to Java's element())
  const element = (): T => {
    if (isEmpty()) {
      throw new NoSuchElementException('Queue is empty');
    }
    return items[0];
  };

  // Returns the head of the queue without removing it
  // Returns Optional.empty() if queue is empty (equivalent to Java's peek())
  const peek = (): Optional<T> => {
    if (isEmpty()) {
      return Optional<T>();
    }
    return Optional(items[0]);
  };

  // Adds multiple elements to the queue
  const addAll = (...elements: T[]): Queue<T> => Queue([...items, ...elements]);

  // Returns an empty queue
  const clear = (): Queue<T> => Queue<T>();

  // Checks if the queue contains the specified element
  const contains = (element: T): boolean => items.includes(element);

  // Checks equality with another queue
  const equals = (
    other: Queue<T>,
    compareFn: (a: T, b: T) => boolean = (a, b) => a === b,
  ): boolean => {
    if (size() !== other.size()) {
      return false;
    }

    const otherArray = other.toArray();
    return items.every((item, index) => compareFn(item, otherArray[index]));
  };

  // Executes a function for each element in the queue
  const foreach = (callback: (element: T) => void): void => {
    items.forEach(callback);
  };

  // Maps each element to a new value
  const map = <R>(mapper: (element: T) => R): Queue<R> => {
    const mapped = items.map(mapper);
    return Queue(mapped);
  };

  // Filters elements based on a predicate
  const filter = (predicate: (element: T) => boolean): Queue<T> => {
    const filtered = items.filter(predicate);
    return Queue(filtered);
  };

  return {
    size,
    isEmpty,
    isNotEmpty,
    toArray,
    add,
    offer,
    remove,
    poll,
    element,
    peek,
    addAll,
    clear,
    contains,
    equals,
    foreach,
    map,
    filter,
  };
};
