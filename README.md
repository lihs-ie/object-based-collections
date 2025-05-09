# typescript-object-based-collections

**Object-oriented, immutable, and functional data structures for TypeScript.**

This library provides foundational, persistent collections built with immutability and functional programming in mind.  
Instead of relying on native mutable arrays, sets, or maps, each structure is encapsulated as an **object-based API**, designed for safety, composability, and predictability.

---

## ✅ Features

- **Immutable**: All operations (`add`, `remove`, `map`, etc.) return new instances
- **Object-oriented**: Rich APIs instead of manipulating raw data
- **Functional**: Inspired by functional programming principles—pure, composable, expressive
- **Typed**: Full TypeScript support with safe generics and inference
- **No runtime dependencies**: Lightweight and fast

---

## ~~📦 Install~~

```bash
pnpm add typescript-object-based-collections
# or
npm install typescript-object-based-collections
```

## 🧱 Collections Included

- `Optional<T>` — a null-safe, fluent wrapper for values that may be present or not
- `ImmutableList<T>` — an ordered, immutable list with map/filter support
- `ImmutableSet<T>` — a set that ensures uniqueness, powered by HAMT internally
- `ImmutableMap<K, V>` — a key-value store with structural sharing and full immutabilit

## Example

```typescript
import {
  Optional,
  ImmutableList,
  ImmutableSet,
  ImmutableMap,
} from 'typescript-object-based-collections';

const list = ImmutableList()
  .add(1)
  .add(2)
  .map((x) => x * 2);
// => ImmutableList<number> [2, 4]

const set = ImmutableSet().add(1).add(2).contains(1);
// => true

const optional1 = Optional(42).orElse(1);
// => "42"
const optional2 = Optional().orElse(1);
// =>  "1"

const map = ImmutableMap()
  .set('a', 1)
  .set('b', 2)
  .map((v) => v * 10)
  .toArray();
// => "[ ['a', 10], ['b', 20] ]"
```

## 📚 Design Philosophy

- Object-based over raw collections
- Immutability to eliminate side effects
- Functional programming as a first-class citizen
- Type-safety without sacrificing usability

## 🔮 Roadmap

- Lazy versions: lazyMap, lazyFilter, lazyReduce
- Transducer-style composition across collections
- JSON serialization/deserialization helpers
- Benchmark suite for large collections
- ImmutableQueue<T> and ImmutableStack<T>
- Integration with functional libraries like fp-ts
