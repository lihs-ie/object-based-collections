# 要件定義: ファクトリメソッドの追加

## 目的

immutable-jsライブラリと同様のAPIを提供するため、ImmutableList、ImmutableMap、ImmutableSetに直接ファクトリメソッド（fromArray、of、empty等）を追加し、より直感的で使いやすいAPIを実現する。

## 機能要件

### 対象コレクションとメソッド

#### ImmutableList

- `ImmutableList.fromArray<T>(values: T[]): ImmutableList<T>` - 配列からリストを作成
- `ImmutableList.of<T>(...values: T[]): ImmutableList<T>` - 可変引数からリストを作成
- `ImmutableList.empty<T>(): ImmutableList<T>` - 空のリストを作成

#### ImmutableMap

- `ImmutableMap.fromArray<K, V>(hasher: Hasher) => (items: [K, V][]): ImmutableMap<K, V>` - 配列からマップを作成
- `ImmutableMap.fromObject<K extends ObjectKey, V>(hasher: Hasher) => (items: Record<K, V>): ImmutableMap<K, V>` - オブジェクトからマップを作成
- `ImmutableMap.empty<K, V>(hasher: Hasher): ImmutableMap<K, V>` - 空のマップを作成

#### ImmutableSet

- `ImmutableSet.fromArray<T>(hasher: Hasher) => (keys: T[]): ImmutableSet<T>` - 配列からセットを作成
- `ImmutableSet.of<T>(hasher: Hasher) => (...values: T[]): ImmutableSet<T>` - 可変引数からセットを作成
- `ImmutableSet.empty<T>(hasher: Hasher): ImmutableSet<T>` - 空のセットを作成

### 後方互換性要件

- 既存のファクトリ関数（`ImmutableList()`, `createMapFromArray()`等）は引き続き動作すること
- 既存のコードに影響を与えないこと
- 型定義の完全な互換性を維持すること

### 型安全性要件

- TypeScriptの型推論が正しく動作すること
- 全てのジェネリクス型パラメータが正しく推論されること
- `Object.assign`パターンを使用した型安全な実装

## 技術要件

### 実装パターン

```typescript
export const ImmutableList = Object.assign(
  <T>(values: T[] = []): ImmutableList<T> => {
    /* 既存実装 */
  },
  {
    fromArray: <T>(values: T[]): ImmutableList<T> => ImmutableList(values),
    of: <T>(...values: T[]): ImmutableList<T> => ImmutableList(values),
    empty: <T>(): ImmutableList<T> => ImmutableList([]),
  },
);
```

### 型定義拡張

- 各コンストラクタの型定義をinterface で拡張
- 静的メソッドを含む完全な型安全性の確保

### テスト要件

- 新しいファクトリメソッドの動作テスト
- 既存機能との互換性テスト
- 型推論の正確性テスト
- エラーケースのテスト

## 完了条件

1. 全てのコレクションにファクトリメソッドが追加されている
2. TypeScript型定義が正しく動作する
3. 既存のテストが全てパスする
4. 新しいファクトリメソッドのテストが全てパスする
5. ESLintとPrettierが通る
6. ビルドが成功する
7. 後方互換性が完全に保たれている

## 使用例

```typescript
// 新しいファクトリメソッド
const list1 = ImmutableList.fromArray([1, 2, 3]);
const list2 = ImmutableList.of(1, 2, 3);
const list3 = ImmutableList.empty<number>();

const map1 = ImmutableMap.fromArray(hasher)([
  [1, 'a'],
  [2, 'b'],
]);
const map2 = ImmutableMap.empty(hasher)<number, string>();

const set1 = ImmutableSet.fromArray(hasher)([1, 2, 3]);
const set2 = ImmutableSet.of(hasher)(1, 2, 3);
const set3 = ImmutableSet.empty(hasher)<number>();

// 既存のAPIも引き続き使用可能
const list4 = ImmutableList([1, 2, 3]);
const map3 = createMapFromArray([
  [1, 'a'],
  [2, 'b'],
]);
```
