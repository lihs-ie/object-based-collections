import { describe, expect, it } from 'vitest';

import { ImmutableStack } from '../../../collections/stack/common';

describe('ImmutableStack', () => {
  describe('Factory Methods', () => {
    it('should create empty stack with empty()', () => {
      const stack = ImmutableStack.empty<number>();

      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
      expect(stack.toArray()).toEqual([]);
    });

    it('should create stack from array with fromArray()', () => {
      const stack = ImmutableStack.fromArray([1, 2, 3]);

      expect(stack.isEmpty()).toBe(false);
      expect(stack.size()).toBe(3);
      expect(stack.toArray()).toEqual([1, 2, 3]);
    });

    it('should create stack with of()', () => {
      const stack = ImmutableStack.of(1, 2, 3);

      expect(stack.isEmpty()).toBe(false);
      expect(stack.size()).toBe(3);
      expect(stack.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('Basic Operations', () => {
    it('should push items to the beginning (LIFO)', () => {
      const stack = ImmutableStack.empty<number>();
      const stack1 = stack.push(1);
      const stack2 = stack1.push(2);
      const stack3 = stack2.push(3);

      // Last pushed should be first in array (LIFO)
      expect(stack3.toArray()).toEqual([3, 2, 1]);
      expect(stack3.size()).toBe(3);
    });

    it('should pop items from the beginning (LIFO)', () => {
      const stack = ImmutableStack.fromArray([1, 2, 3]);

      const result1 = stack.pop();
      expect(result1.isPresent()).toBe(true);

      result1.ifPresent(([value, newStack]) => {
        expect(value).toBe(1); // First item in array should be popped first
        expect(newStack.toArray()).toEqual([2, 3]);
        expect(newStack.size()).toBe(2);
      });
    });

    it('should return None when popping from empty stack', () => {
      const stack = ImmutableStack.empty<number>();
      const result = stack.pop();

      expect(result.isPresent()).toBe(false);
    });

    it('should peek at top item without removing it', () => {
      const stack = ImmutableStack.fromArray([1, 2, 3]);
      const top = stack.peek();

      expect(top.isPresent()).toBe(true);
      top.ifPresent((value) => {
        expect(value).toBe(1); // First item in array
      });

      // Stack should remain unchanged
      expect(stack.toArray()).toEqual([1, 2, 3]);
      expect(stack.size()).toBe(3);
    });

    it('should return None when peeking empty stack', () => {
      const stack = ImmutableStack.empty<number>();
      const top = stack.peek();

      expect(top.isPresent()).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should check if stack is empty', () => {
      const emptyStack = ImmutableStack.empty<number>();
      const nonEmptyStack = ImmutableStack.fromArray([1]);

      expect(emptyStack.isEmpty()).toBe(true);
      expect(nonEmptyStack.isEmpty()).toBe(false);
    });

    it('should return correct size', () => {
      const stack0 = ImmutableStack.empty<number>();
      const stack1 = ImmutableStack.fromArray([1]);
      const stack3 = ImmutableStack.fromArray([1, 2, 3]);

      expect(stack0.size()).toBe(0);
      expect(stack1.size()).toBe(1);
      expect(stack3.size()).toBe(3);
    });

    it('should convert to array', () => {
      const stack = ImmutableStack.fromArray([1, 2, 3]);
      const array = stack.toArray();

      expect(array).toEqual([1, 2, 3]);
      // Should return new array, not reference
      expect(array).not.toBe(stack.toArray());
    });

    it('should iterate with forEach', () => {
      const stack = ImmutableStack.fromArray(['a', 'b', 'c']);
      const collected: [string, number][] = [];

      stack.forEach((item, index) => {
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
    it('should not modify original stack when pushing', () => {
      const original = ImmutableStack.fromArray([1, 2]);
      const modified = original.push(3);

      expect(original.toArray()).toEqual([1, 2]);
      expect(modified.toArray()).toEqual([3, 1, 2]); // New item at front
    });

    it('should not modify original stack when popping', () => {
      const original = ImmutableStack.fromArray([1, 2, 3]);
      const result = original.pop();

      expect(original.toArray()).toEqual([1, 2, 3]);

      result.ifPresent(([, newStack]) => {
        expect(newStack.toArray()).toEqual([2, 3]);
      });
    });
  });

  describe('LIFO Behavior', () => {
    it('should maintain LIFO order with multiple operations', () => {
      let stack = ImmutableStack.empty<string>();

      // Add some items
      stack = stack.push('first');
      stack = stack.push('second');
      stack = stack.push('third');

      expect(stack.toArray()).toEqual(['third', 'second', 'first']);

      // Remove top item (last pushed)
      const result1 = stack.pop();
      expect(result1.isPresent()).toBe(true);

      result1.ifPresent(([value, newStack]) => {
        expect(value).toBe('third');
        stack = newStack;
      });

      // Add another item
      stack = stack.push('fourth');

      // Remove next item
      const result2 = stack.pop();
      expect(result2.isPresent()).toBe(true);

      result2.ifPresent(([value, newStack]) => {
        expect(value).toBe('fourth');
        stack = newStack;
      });

      expect(stack.toArray()).toEqual(['second', 'first']);
    });
  });
});
