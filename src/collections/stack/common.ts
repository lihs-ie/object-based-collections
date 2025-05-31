/**
 * Immutable Stack implementation based on Java's Stack class
 * Provides LIFO (Last-In-First-Out) operations with functional programming principles
 * Optimized for time and space complexity using structural sharing
 */

import { Optional } from '../optional/common';

class EmptyStackException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmptyStackException';
  }
}

/**
 * Internal node structure for linked list implementation
 * Provides O(1) push/pop operations with structural sharing
 */
interface StackNode<T> {
  readonly value: T;
  readonly next: StackNode<T> | null;
  readonly size: number;
}

const createNode = <T>(value: T, next: StackNode<T> | null): StackNode<T> => ({
  value,
  next,
  size: (next?.size ?? 0) + 1,
});

export interface Stack<T> {
  size: () => number;
  isEmpty: () => boolean;
  isNotEmpty: () => boolean;
  toArray: () => T[];

  // Core Stack operations based on Java Stack class
  push: (element: T) => Stack<T>;
  pop: () => Stack<T>;
  peek: () => T;
  peekOption: () => Optional<T>;
  search: (element: T) => number;

  // Additional utility methods
  pushAll: (...elements: T[]) => Stack<T>;
  clear: () => Stack<T>;
  contains: (element: T) => boolean;
  equals: (other: Stack<T>, compareFn?: (a: T, b: T) => boolean) => boolean;
  foreach: (callback: (element: T) => void) => void;
  map: <R>(mapper: (element: T) => R) => Stack<R>;
  filter: (predicate: (element: T) => boolean) => Stack<T>;

  // Safe operations that return Optional
  safePop: () => { stack: Stack<T>; element: Optional<T> };
  safePeek: () => Optional<T>;
}

/**
 * Internal Stack implementation using linked list for O(1) operations
 */
const createStackFromNode = <T>(head: StackNode<T> | null): Stack<T> => {
  // Cache size for O(1) access
  const stackSize = head?.size ?? 0;

  const size = (): number => stackSize;

  const isEmpty = (): boolean => head === null;

  const isNotEmpty = (): boolean => head !== null;

  // O(n) operation - only when needed
  const toArray = (): T[] => {
    const result: T[] = new Array(stackSize);
    let current = head;
    let index = stackSize - 1;

    while (current !== null) {
      result[index] = current.value;
      current = current.next;
      index--;
    }

    return result;
  };

  // O(1) operation with structural sharing
  const push = (element: T): Stack<T> =>
    createStackFromNode(createNode(element, head));

  // O(1) operation with structural sharing
  const pop = (): Stack<T> => {
    if (head === null) {
      throw new EmptyStackException('Stack is empty');
    }
    return createStackFromNode(head.next);
  };

  // O(1) operation
  const peek = (): T => {
    if (head === null) {
      throw new EmptyStackException('Stack is empty');
    }
    return head.value;
  };

  // O(1) operation
  const peekOption = (): Optional<T> => {
    if (head === null) {
      return Optional<T>();
    }
    return Optional(head.value);
  };

  // O(n) operation - searches from top to bottom
  const search = (element: T): number => {
    let current = head;
    let position = 1;

    while (current !== null) {
      if (current.value === element) {
        return position;
      }
      current = current.next;
      position++;
    }

    return -1;
  };

  // O(k) where k is number of elements to push
  const pushAll = (...elements: T[]): Stack<T> => {
    let newHead = head;

    for (const element of elements) {
      newHead = createNode(element, newHead);
    }

    return createStackFromNode(newHead);
  };

  // O(1) operation
  const clear = (): Stack<T> => createStackFromNode(null);

  // O(n) operation
  const contains = (element: T): boolean => {
    let current = head;

    while (current !== null) {
      if (current.value === element) {
        return true;
      }
      current = current.next;
    }

    return false;
  };

  // O(n) operation
  const equals = (
    other: Stack<T>,
    compareFn: (a: T, b: T) => boolean = (a, b) => a === b,
  ): boolean => {
    if (size() !== other.size()) {
      return false;
    }

    if (isEmpty()) {
      return other.isEmpty();
    }

    const thisArray = toArray();
    const otherArray = other.toArray();

    for (let i = 0; i < thisArray.length; i++) {
      if (!compareFn(thisArray[i], otherArray[i])) {
        return false;
      }
    }

    return true;
  };

  // O(n) operation - iterates from bottom to top
  const foreach = (callback: (element: T) => void): void => {
    const array = toArray();
    array.forEach(callback);
  };

  // O(n) operation with structural sharing where possible
  const map = <R>(mapper: (element: T) => R): Stack<R> => {
    if (head === null) {
      return createStackFromNode<R>(null);
    }

    const mapNode = (node: StackNode<T> | null): StackNode<R> | null => {
      if (node === null) {
        return null;
      }

      const mappedNext = mapNode(node.next);
      return createNode(mapper(node.value), mappedNext);
    };

    return createStackFromNode(mapNode(head));
  };

  // O(n) operation
  const filter = (predicate: (element: T) => boolean): Stack<T> => {
    if (head === null) {
      return createStackFromNode(null);
    }

    const filterNode = (node: StackNode<T> | null): StackNode<T> | null => {
      if (node === null) {
        return null;
      }

      const filteredNext = filterNode(node.next);

      if (predicate(node.value)) {
        return createNode(node.value, filteredNext);
      }

      return filteredNext;
    };

    return createStackFromNode(filterNode(head));
  };

  // O(1) operation with structural sharing
  const safePop = (): { stack: Stack<T>; element: Optional<T> } => {
    if (head === null) {
      return {
        stack: createStackFromNode(null),
        element: Optional<T>(),
      };
    }

    return {
      stack: createStackFromNode(head.next),
      element: Optional(head.value),
    };
  };

  // O(1) operation
  const safePeek = (): Optional<T> => {
    if (head === null) {
      return Optional<T>();
    }
    return Optional(head.value);
  };

  return {
    size,
    isEmpty,
    isNotEmpty,
    toArray,
    push,
    pop,
    peek,
    peekOption,
    search,
    pushAll,
    clear,
    contains,
    equals,
    foreach,
    map,
    filter,
    safePop,
    safePeek,
  };
};

/**
 * Creates a new Stack from an array of elements
 * O(n) time complexity for initial creation
 */
export const Stack = <T>(elements: T[] = []): Stack<T> => {
  if (elements.length === 0) {
    return createStackFromNode<T>(null);
  }

  // Build linked list from bottom to top for correct stack order
  let head: StackNode<T> | null = null;

  for (const element of elements) {
    head = createNode(element, head);
  }

  return createStackFromNode(head);
};
