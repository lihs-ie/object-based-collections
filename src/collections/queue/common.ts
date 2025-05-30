/**
 * Immutable Queue implementation based on Java's Queue interface
 * Provides FIFO (First-In-First-Out) operations with functional programming principles
 * Optimized for time and space complexity using two-stack approach
 */

import { Optional } from '../optional/common';

class NoSuchElementException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoSuchElementException';
  }
}

/**
 * Internal queue structure using two stacks for efficient operations
 * Front stack for dequeue operations, rear stack for enqueue operations
 */
interface QueueData<T> {
  readonly front: T[];
  readonly rear: T[];
  readonly size: number;
}

const createQueueData = <T>(front: T[] = [], rear: T[] = []): QueueData<T> => ({
  front,
  rear,
  size: front.length + rear.length,
});

/**
 * Transfers elements from rear to front when front is empty
 * This amortizes the cost of dequeue operations
 */
const normalize = <T>(data: QueueData<T>): QueueData<T> => {
  if (data.front.length > 0 || data.rear.length === 0) {
    return data;
  }

  return createQueueData([...data.rear].reverse(), []);
};

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
  elementOption: () => Optional<T>;
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

/**
 * Internal Queue implementation using two-stack approach for amortized O(1) operations
 */
const createQueueFromData = <T>(data: QueueData<T>): Queue<T> => {
  const queueSize = data.size;

  const size = (): number => queueSize;

  const isEmpty = (): boolean => queueSize === 0;

  const isNotEmpty = (): boolean => queueSize > 0;

  // O(n) operation - only when needed
  const toArray = (): T[] => {
    const result: T[] = new Array(queueSize);
    let index = 0;

    // Add front elements in order
    for (const element of data.front) {
      result[index++] = element;
    }

    // Add rear elements in order (they are already in correct order)
    for (const element of data.rear) {
      result[index++] = element;
    }

    return result;
  };

  // O(1) operation - amortized
  const add = (element: T): Queue<T> => {
    const newData = createQueueData(data.front, [...data.rear, element]);
    return createQueueFromData(newData);
  };

  // O(1) operation - same as add for unbounded queue
  const offer = (element: T): Queue<T> => add(element);

  // O(1) amortized operation
  const remove = (): Queue<T> => {
    const normalizedData = normalize(data);

    if (normalizedData.front.length === 0) {
      throw new NoSuchElementException('Queue is empty');
    }

    const newFront = normalizedData.front.slice(1);
    const newData = createQueueData(newFront, normalizedData.rear);
    return createQueueFromData(newData);
  };

  // O(1) amortized operation
  const poll = (): { queue: Queue<T>; element: Optional<T> } => {
    const normalizedData = normalize(data);

    if (normalizedData.front.length === 0) {
      return {
        queue: createQueueFromData(data),
        element: Optional<T>(),
      };
    }

    const element = normalizedData.front[0];
    const newFront = normalizedData.front.slice(1);
    const newData = createQueueData(newFront, normalizedData.rear);

    return {
      queue: createQueueFromData(newData),
      element: Optional(element),
    };
  };

  // O(1) amortized operation
  const element = (): T => {
    const normalizedData = normalize(data);

    if (normalizedData.front.length === 0) {
      throw new NoSuchElementException('Queue is empty');
    }

    return normalizedData.front[0];
  };

  // O(1) amortized operation
  const elementOption = (): Optional<T> => {
    const normalizedData = normalize(data);

    if (normalizedData.front.length === 0) {
      return Optional<T>();
    }

    return Optional(normalizedData.front[0]);
  };

  // O(1) amortized operation
  const peek = (): Optional<T> => {
    const normalizedData = normalize(data);

    if (normalizedData.front.length === 0) {
      return Optional<T>();
    }

    return Optional(normalizedData.front[0]);
  };

  // O(k) where k is number of elements to add
  const addAll = (...elements: T[]): Queue<T> => {
    if (elements.length === 0) {
      return createQueueFromData(data);
    }

    // Add elements directly to rear to maintain FIFO order
    const newData = createQueueData(data.front, [...data.rear, ...elements]);
    return createQueueFromData(newData);
  };

  // O(1) operation
  const clear = (): Queue<T> => createQueueFromData(createQueueData());

  // O(n) operation
  const contains = (element: T): boolean => {
    // Check front stack
    for (const item of data.front) {
      if (item === element) {
        return true;
      }
    }

    // Check rear stack
    for (const item of data.rear) {
      if (item === element) {
        return true;
      }
    }

    return false;
  };

  // O(n) operation
  const equals = (
    other: Queue<T>,
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

  // O(n) operation
  const foreach = (callback: (element: T) => void): void => {
    // Process front elements in order
    for (const element of data.front) {
      callback(element);
    }

    // Process rear elements in order
    for (const element of data.rear) {
      callback(element);
    }
  };

  // O(n) operation
  const map = <R>(mapper: (element: T) => R): Queue<R> => {
    const mappedFront = data.front.map(mapper);
    const mappedRear = data.rear.map(mapper);

    const newData = createQueueData(mappedFront, mappedRear);
    return createQueueFromData(newData);
  };

  // O(n) operation
  const filter = (predicate: (element: T) => boolean): Queue<T> => {
    const filteredFront = data.front.filter(predicate);
    const filteredRear = data.rear.filter(predicate);

    const newData = createQueueData(filteredFront, filteredRear);
    return createQueueFromData(newData);
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
    elementOption,
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

/**
 * Creates a new Queue from an array of elements
 * O(n) time complexity for initial creation
 */
export const Queue = <T>(elements: T[] = []): Queue<T> => {
  if (elements.length === 0) {
    return createQueueFromData(createQueueData<T>());
  }

  // Initialize with all elements in front for correct order
  const data = createQueueData(elements, []);
  return createQueueFromData(data);
};
