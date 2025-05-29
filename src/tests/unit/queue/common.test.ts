import { describe, expect, it } from 'vitest';

import { Queue } from '../../../collections/queue';

describe('queue/common', () => {
  describe('Queue', () => {
    it('constructor function returns Queue object with no elements', () => {
      const queue = Queue<string>();

      expect(queue).toBeDefined();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('constructor function returns Queue object with provided elements', () => {
      const elements = ['first', 'second', 'third'];
      const queue = Queue(elements);

      expect(queue).toBeDefined();
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual(elements);
    });

    it('size returns 0 for empty queue', () => {
      const queue = Queue<number>();
      expect(queue.size()).toBe(0);
    });

    it('size returns correct count for non-empty queue', () => {
      const queue = Queue([1, 2, 3, 4, 5]);
      expect(queue.size()).toBe(5);
    });

    it('isEmpty returns true for empty queue', () => {
      const queue = Queue<string>();
      expect(queue.isEmpty()).toBe(true);
    });

    it('isEmpty returns false for non-empty queue', () => {
      const queue = Queue(['element']);
      expect(queue.isEmpty()).toBe(false);
    });

    it('isNotEmpty returns false for empty queue', () => {
      const queue = Queue<string>();
      expect(queue.isNotEmpty()).toBe(false);
    });

    it('isNotEmpty returns true for non-empty queue', () => {
      const queue = Queue(['element']);
      expect(queue.isNotEmpty()).toBe(true);
    });

    it('toArray returns empty array for empty queue', () => {
      const queue = Queue<number>();
      expect(queue.toArray()).toEqual([]);
    });

    it('toArray returns array with same elements in same order', () => {
      const elements = [1, 2, 3];
      const queue = Queue(elements);
      const result = queue.toArray();

      expect(result).toEqual(elements);
      expect(result).not.toBe(elements); // Should be a copy
    });

    it('add adds element to empty queue', () => {
      const queue = Queue<string>();
      const newQueue = queue.add('first');

      expect(newQueue).not.toBe(queue);
      expect(newQueue.size()).toBe(1);
      expect(newQueue.toArray()).toEqual(['first']);
    });

    it('add adds element to rear of non-empty queue', () => {
      const queue = Queue(['first', 'second']);
      const newQueue = queue.add('third');

      expect(newQueue).not.toBe(queue);
      expect(newQueue.size()).toBe(3);
      expect(newQueue.toArray()).toEqual(['first', 'second', 'third']);
    });

    it('offer adds element to empty queue', () => {
      const queue = Queue<string>();
      const newQueue = queue.offer('first');

      expect(newQueue).not.toBe(queue);
      expect(newQueue.size()).toBe(1);
      expect(newQueue.toArray()).toEqual(['first']);
    });

    it('offer adds element to rear of non-empty queue', () => {
      const queue = Queue(['first', 'second']);
      const newQueue = queue.offer('third');

      expect(newQueue).not.toBe(queue);
      expect(newQueue.size()).toBe(3);
      expect(newQueue.toArray()).toEqual(['first', 'second', 'third']);
    });

    it('remove throws exception when queue is empty', () => {
      const queue = Queue<string>();
      expect(() => queue.remove()).toThrow('Queue is empty');
    });

    it('remove removes head element from single-element queue', () => {
      const queue = Queue(['only']);
      const newQueue = queue.remove();

      expect(newQueue).not.toBe(queue);
      expect(newQueue.isEmpty()).toBe(true);
    });

    it('remove removes head element from multi-element queue', () => {
      const queue = Queue(['first', 'second', 'third']);
      const newQueue = queue.remove();

      expect(newQueue).not.toBe(queue);
      expect(newQueue.size()).toBe(2);
      expect(newQueue.toArray()).toEqual(['second', 'third']);
    });

    it('poll returns empty optional when queue is empty', () => {
      const queue = Queue<string>();
      const result = queue.poll();

      expect(result.queue).not.toBe(queue);
      expect(result.queue.isEmpty()).toBe(true);
      expect(result.element.isPresent()).toBe(false);
    });

    it('poll removes and returns head element from single-element queue', () => {
      const queue = Queue(['only']);
      const result = queue.poll();

      expect(result.queue).not.toBe(queue);
      expect(result.queue.isEmpty()).toBe(true);
      expect(result.element.isPresent()).toBe(true);
      expect(result.element.get()).toBe('only');
    });

    it('poll removes and returns head element from multi-element queue', () => {
      const queue = Queue(['first', 'second', 'third']);
      const result = queue.poll();

      expect(result.queue).not.toBe(queue);
      expect(result.queue.size()).toBe(2);
      expect(result.queue.toArray()).toEqual(['second', 'third']);
      expect(result.element.isPresent()).toBe(true);
      expect(result.element.get()).toBe('first');
    });

    it('element throws exception when queue is empty', () => {
      const queue = Queue<string>();
      expect(() => queue.element()).toThrow('Queue is empty');
    });

    it('element returns head element without removing it', () => {
      const queue = Queue(['first', 'second', 'third']);
      const head = queue.element();

      expect(head).toBe('first');
      expect(queue.size()).toBe(3); // Queue should remain unchanged
    });

    it('peek returns empty optional when queue is empty', () => {
      const queue = Queue<string>();
      const result = queue.peek();

      expect(result.isPresent()).toBe(false);
    });

    it('peek returns head element without removing it', () => {
      const queue = Queue(['first', 'second', 'third']);
      const result = queue.peek();

      expect(result.isPresent()).toBe(true);
      expect(result.get()).toBe('first');
      expect(queue.size()).toBe(3); // Queue should remain unchanged
    });

    it('addAll adds multiple elements to empty queue', () => {
      const queue = Queue<string>();
      const newQueue = queue.addAll('first', 'second', 'third');

      expect(newQueue).not.toBe(queue);
      expect(newQueue.size()).toBe(3);
      expect(newQueue.toArray()).toEqual(['first', 'second', 'third']);
    });

    it('addAll adds multiple elements to non-empty queue', () => {
      const queue = Queue(['existing']);
      const newQueue = queue.addAll('first', 'second');

      expect(newQueue).not.toBe(queue);
      expect(newQueue.size()).toBe(3);
      expect(newQueue.toArray()).toEqual(['existing', 'first', 'second']);
    });

    it('clear returns empty queue from non-empty queue', () => {
      const queue = Queue(['first', 'second', 'third']);
      const newQueue = queue.clear();

      expect(newQueue).not.toBe(queue);
      expect(newQueue.isEmpty()).toBe(true);
      expect(newQueue.size()).toBe(0);
    });

    it('contains returns false for empty queue', () => {
      const queue = Queue<string>();
      expect(queue.contains('element')).toBe(false);
    });

    it('contains returns true when element exists', () => {
      const queue = Queue(['first', 'second', 'third']);
      expect(queue.contains('second')).toBe(true);
    });

    it('contains returns false when element does not exist', () => {
      const queue = Queue(['first', 'second', 'third']);
      expect(queue.contains('fourth')).toBe(false);
    });

    it('equals returns true for two empty queues', () => {
      const queue1 = Queue<string>();
      const queue2 = Queue<string>();
      expect(queue1.equals(queue2)).toBe(true);
    });

    it('equals returns true for queues with same elements in same order', () => {
      const queue1 = Queue(['first', 'second', 'third']);
      const queue2 = Queue(['first', 'second', 'third']);
      expect(queue1.equals(queue2)).toBe(true);
    });

    it('equals returns false for queues with different sizes', () => {
      const queue1 = Queue(['first', 'second']);
      const queue2 = Queue(['first', 'second', 'third']);
      expect(queue1.equals(queue2)).toBe(false);
    });

    it('equals returns false for queues with same elements in different order', () => {
      const queue1 = Queue(['first', 'second', 'third']);
      const queue2 = Queue(['third', 'second', 'first']);
      expect(queue1.equals(queue2)).toBe(false);
    });

    it('equals uses custom comparison function when provided', () => {
      const queue1 = Queue([{ id: 1 }, { id: 2 }]);
      const queue2 = Queue([{ id: 1 }, { id: 2 }]);

      expect(queue1.equals(queue2, (a, b) => a.id === b.id)).toBe(true);
    });

    it('foreach does not execute callback for empty queue', () => {
      const queue = Queue<string>();
      let count = 0;
      queue.foreach(() => count++);
      expect(count).toBe(0);
    });

    it('foreach executes callback for each element in order', () => {
      const queue = Queue(['first', 'second', 'third']);
      const results: string[] = [];
      queue.foreach((element) => results.push(element));
      expect(results).toEqual(['first', 'second', 'third']);
    });

    it('map returns empty queue for empty input', () => {
      const queue = Queue<number>();
      const newQueue = queue.map((x) => x * 2);

      expect(newQueue.isEmpty()).toBe(true);
    });

    it('map transforms all elements using mapper function', () => {
      const queue = Queue([1, 2, 3]);
      const newQueue = queue.map((x) => x * 2);

      expect(newQueue).not.toBe(queue);
      expect(newQueue.toArray()).toEqual([2, 4, 6]);
    });

    it('map can transform to different type', () => {
      const queue = Queue([1, 2, 3]);
      const newQueue = queue.map((x) => `number-${x}`);

      expect(newQueue.toArray()).toEqual(['number-1', 'number-2', 'number-3']);
    });

    it('filter returns empty queue for empty input', () => {
      const queue = Queue<number>();
      const newQueue = queue.filter((x) => x > 0);

      expect(newQueue.isEmpty()).toBe(true);
    });

    it('filter filters elements based on predicate', () => {
      const queue = Queue([1, 2, 3, 4, 5]);
      const newQueue = queue.filter((x) => x % 2 === 0);

      expect(newQueue).not.toBe(queue);
      expect(newQueue.toArray()).toEqual([2, 4]);
    });

    it('filter returns empty queue when no elements match predicate', () => {
      const queue = Queue([1, 3, 5]);
      const newQueue = queue.filter((x) => x % 2 === 0);

      expect(newQueue.isEmpty()).toBe(true);
    });
  });
});
