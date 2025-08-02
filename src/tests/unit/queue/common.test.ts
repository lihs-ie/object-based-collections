import { describe, expect, it } from 'vitest';

import { ImmutableQueue } from '../../../collections/queue/common';

describe('ImmutableQueue', () => {
  describe('Factory Methods', () => {
    it('should create empty queue with empty()', () => {
      const queue = ImmutableQueue.empty<number>();

      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.toArray()).toEqual([]);
    });

    it('should create queue from array with fromArray()', () => {
      const queue = ImmutableQueue.fromArray([1, 2, 3]);

      expect(queue.isEmpty()).toBe(false);
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should create queue with of()', () => {
      const queue = ImmutableQueue.of(1, 2, 3);

      expect(queue.isEmpty()).toBe(false);
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('Basic Operations', () => {
    it('should enqueue items to the end', () => {
      const queue = ImmutableQueue.empty<number>();
      const queue1 = queue.enqueue(1);
      const queue2 = queue1.enqueue(2);
      const queue3 = queue2.enqueue(3);

      expect(queue3.toArray()).toEqual([1, 2, 3]);
      expect(queue3.size()).toBe(3);
    });

    it('should dequeue items from the beginning (FIFO)', () => {
      const queue = ImmutableQueue.fromArray([1, 2, 3]);

      const result1 = queue.dequeue();
      expect(result1.isPresent()).toBe(true);

      result1.ifPresent(([value, newQueue]) => {
        expect(value).toBe(1);
        expect(newQueue.toArray()).toEqual([2, 3]);
        expect(newQueue.size()).toBe(2);
      });
    });

    it('should return None when dequeuing from empty queue', () => {
      const queue = ImmutableQueue.empty<number>();
      const result = queue.dequeue();

      expect(result.isPresent()).toBe(false);
    });

    it('should peek at first item without removing it', () => {
      const queue = ImmutableQueue.fromArray([1, 2, 3]);
      const first = queue.peek();

      expect(first.isPresent()).toBe(true);
      first.ifPresent((value) => {
        expect(value).toBe(1);
      });

      // Queue should remain unchanged
      expect(queue.toArray()).toEqual([1, 2, 3]);
      expect(queue.size()).toBe(3);
    });

    it('should return None when peeking empty queue', () => {
      const queue = ImmutableQueue.empty<number>();
      const first = queue.peek();

      expect(first.isPresent()).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should check if queue is empty', () => {
      const emptyQueue = ImmutableQueue.empty<number>();
      const nonEmptyQueue = ImmutableQueue.fromArray([1]);

      expect(emptyQueue.isEmpty()).toBe(true);
      expect(nonEmptyQueue.isEmpty()).toBe(false);
    });

    it('should return correct size', () => {
      const queue0 = ImmutableQueue.empty<number>();
      const queue1 = ImmutableQueue.fromArray([1]);
      const queue3 = ImmutableQueue.fromArray([1, 2, 3]);

      expect(queue0.size()).toBe(0);
      expect(queue1.size()).toBe(1);
      expect(queue3.size()).toBe(3);
    });

    it('should convert to array', () => {
      const queue = ImmutableQueue.fromArray([1, 2, 3]);
      const array = queue.toArray();

      expect(array).toEqual([1, 2, 3]);
      // Should return new array, not reference
      expect(array).not.toBe(queue.toArray());
    });

    it('should iterate with foreach', () => {
      const queue = ImmutableQueue.fromArray(['a', 'b', 'c']);
      const collected: [string, number][] = [];

      queue.foreach((item, index) => {
        collected.push([item, index]);
      });

      expect(collected).toEqual([
        ['a', 0],
        ['b', 1],
        ['c', 2],
      ]);
    });
  });

  describe('Immutability', () => {
    it('should not modify original queue when enqueuing', () => {
      const original = ImmutableQueue.fromArray([1, 2]);
      const modified = original.enqueue(3);

      expect(original.toArray()).toEqual([1, 2]);
      expect(modified.toArray()).toEqual([1, 2, 3]);
    });

    it('should not modify original queue when dequeuing', () => {
      const original = ImmutableQueue.fromArray([1, 2, 3]);
      const result = original.dequeue();

      expect(original.toArray()).toEqual([1, 2, 3]);

      result.ifPresent(([, newQueue]) => {
        expect(newQueue.toArray()).toEqual([2, 3]);
      });
    });
  });

  describe('FIFO Behavior', () => {
    it('should maintain FIFO order with multiple operations', () => {
      let queue = ImmutableQueue.empty<string>();

      // Add some items
      queue = queue.enqueue('first');
      queue = queue.enqueue('second');
      queue = queue.enqueue('third');

      // Remove first item
      const result1 = queue.dequeue();
      expect(result1.isPresent()).toBe(true);

      result1.ifPresent(([value, newQueue]) => {
        expect(value).toBe('first');
        queue = newQueue;
      });

      // Add another item
      queue = queue.enqueue('fourth');

      // Remove second item
      const result2 = queue.dequeue();
      expect(result2.isPresent()).toBe(true);

      result2.ifPresent(([value, newQueue]) => {
        expect(value).toBe('second');
        queue = newQueue;
      });

      expect(queue.toArray()).toEqual(['third', 'fourth']);
    });
  });
});
