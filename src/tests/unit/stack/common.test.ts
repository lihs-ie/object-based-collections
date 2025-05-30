import { describe, expect, it } from 'vitest';

import { Stack } from '../../../collections/stack';

describe('stack/common', () => {
  describe('Stack', () => {
    it('constructor function returns Stack object with no elements', () => {
      const stack = Stack<number>();
      expect(stack).toBeDefined();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });

    it('constructor function returns Stack object with provided elements', () => {
      const elements = [1, 2, 3];
      const stack = Stack(elements);
      expect(stack).toBeDefined();
      expect(stack.size()).toBe(3);
      expect(stack.toArray()).toEqual(elements);
    });

    it('push adds element to top of stack', () => {
      const stack = Stack([1, 2]);
      const newStack = stack.push(3);
      expect(newStack).not.toBe(stack);
      expect(newStack.size()).toBe(3);
      expect(newStack.peek()).toBe(3);
    });

    it('push maintains immutability', () => {
      const original = Stack([1, 2]);
      const modified = original.push(3);
      expect(original.size()).toBe(2);
      expect(modified.size()).toBe(3);
    });

    it('pop removes and returns new stack without top element', () => {
      const stack = Stack([1, 2, 3]);
      const newStack = stack.pop();
      expect(newStack).not.toBe(stack);
      expect(newStack.size()).toBe(2);
      expect(newStack.peek()).toBe(2);
    });

    it('pop throws exception when stack is empty', () => {
      const stack = Stack<number>();
      expect(() => stack.pop()).toThrow('Stack is empty');
    });

    it('peek returns top element without removing it', () => {
      const stack = Stack([1, 2, 3]);
      const top = stack.peek();
      expect(top).toBe(3);
      expect(stack.size()).toBe(3);
    });

    it('peek throws exception when stack is empty', () => {
      const stack = Stack<number>();
      expect(() => stack.peek()).toThrow('Stack is empty');
    });

    it('peekOption returns Optional.empty for empty stack', () => {
      const stack = Stack<number>();
      const result = stack.peekOption();
      expect(result.isPresent()).toBe(false);
    });

    it('peekOption returns top element for non-empty stack', () => {
      const stack = Stack([1, 2, 3]);
      const result = stack.peekOption();
      expect(result.get()).toBe(3);
    });

    it('search returns 1-based position from top when element found', () => {
      const stack = Stack([1, 2, 3, 2]);
      expect(stack.search(2)).toBe(1); // Top element
      expect(stack.search(3)).toBe(2);
      expect(stack.search(1)).toBe(4); // Bottom element
    });

    it('search returns -1 when element not found', () => {
      const stack = Stack([1, 2, 3]);
      expect(stack.search(4)).toBe(-1);
    });

    it('safePop returns Optional.empty for empty stack', () => {
      const stack = Stack<number>();
      const result = stack.safePop();
      expect(result.element.isPresent()).toBe(false);
      expect(result.stack.isEmpty()).toBe(true);
    });

    it('safePop returns element and new stack for non-empty stack', () => {
      const stack = Stack([1, 2, 3]);
      const result = stack.safePop();
      expect(result.element.get()).toBe(3);
      expect(result.stack.size()).toBe(2);
    });

    it('safePeek returns Optional.empty for empty stack', () => {
      const stack = Stack<number>();
      const result = stack.safePeek();
      expect(result.isPresent()).toBe(false);
    });

    it('safePeek returns top element for non-empty stack', () => {
      const stack = Stack([1, 2, 3]);
      const result = stack.safePeek();
      expect(result.get()).toBe(3);
    });

    it('pushAll adds multiple elements', () => {
      const stack = Stack([1]);
      const newStack = stack.pushAll(2, 3, 4);
      expect(newStack).not.toBe(stack);
      expect(newStack.size()).toBe(4);
      expect(newStack.toArray()).toEqual([1, 2, 3, 4]);
    });

    it('contains returns true when element exists', () => {
      const stack = Stack([1, 2, 3]);
      expect(stack.contains(2)).toBe(true);
    });

    it('contains returns false when element does not exist', () => {
      const stack = Stack([1, 2, 3]);
      expect(stack.contains(4)).toBe(false);
    });

    it('clear returns empty stack', () => {
      const stack = Stack([1, 2, 3]);
      const cleared = stack.clear();
      expect(cleared).not.toBe(stack);
      expect(cleared.isEmpty()).toBe(true);
    });

    it('map transforms elements', () => {
      const stack = Stack([1, 2, 3]);
      const doubled = stack.map((x) => x * 2);
      expect(doubled).not.toBe(stack);
      expect(doubled.toArray()).toEqual([2, 4, 6]);
    });

    it('filter removes elements not matching predicate', () => {
      const stack = Stack([1, 2, 3, 4]);
      const evens = stack.filter((x) => x % 2 === 0);
      expect(evens).not.toBe(stack);
      expect(evens.toArray()).toEqual([2, 4]);
    });

    it('equals returns true for stacks with same elements', () => {
      const stack1 = Stack([1, 2, 3]);
      const stack2 = Stack([1, 2, 3]);
      expect(stack1.equals(stack2)).toBe(true);
    });

    it('equals returns false for stacks with different elements', () => {
      const stack1 = Stack([1, 2, 3]);
      const stack2 = Stack([1, 2, 4]);
      expect(stack1.equals(stack2)).toBe(false);
    });

    it('isEmpty returns true for empty stack', () => {
      const stack = Stack<number>();
      expect(stack.isEmpty()).toBe(true);
    });

    it('isEmpty returns false for non-empty stack', () => {
      const stack = Stack([1]);
      expect(stack.isEmpty()).toBe(false);
    });

    it('isNotEmpty returns false for empty stack', () => {
      const stack = Stack<number>();
      expect(stack.isNotEmpty()).toBe(false);
    });

    it('isNotEmpty returns true for non-empty stack', () => {
      const stack = Stack([1]);
      expect(stack.isNotEmpty()).toBe(true);
    });

    it('toArray returns copy of internal array', () => {
      const elements = [1, 2, 3];
      const stack = Stack(elements);
      const result = stack.toArray();
      expect(result).toEqual(elements);
      expect(result).not.toBe(elements);
    });

    it('foreach executes callback for each element', () => {
      const stack = Stack([1, 2, 3]);
      const results: number[] = [];
      stack.foreach((element) => results.push(element));
      expect(results).toEqual([1, 2, 3]);
    });
  });
});
