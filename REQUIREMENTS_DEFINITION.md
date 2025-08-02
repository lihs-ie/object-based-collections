# 要件定義: ImmutableListのループ系メソッドにindex引数を追加

## 目的

ImmutableListのループ系メソッド（map、filter、find、exists、forall、foreach等）にindex引数を追加し、JavaScript標準の配列メソッドと同等の機能を提供する。

## 機能要件

### 対象メソッドとシグネチャ

#### 変更対象メソッド

- `map: <R>(mapper: (value: T, index: number) => R) => ImmutableList<R>`
- `filter: (predicate: (value: T, index: number) => boolean) => ImmutableList<T>`
- `find: (predicate: (value: T, index: number) => boolean) => Optional<T>`
- `exists: (predicate: (value: T, index: number) => boolean) => boolean`
- `forall: (predicate: (value: T, index: number) => boolean) => boolean`
- `foreach: (callback: (value: T, index: number) => void) => void`

#### 動作仕様

- 各メソッドでコールバック関数にvalue（値）とindex（インデックス）を渡す
- indexは0から始まる連続した整数
- 既存の動作を維持しつつ、indexが利用可能になる

### 型安全性要件

- TypeScriptの型推論が正しく動作すること
- 既存のAPIとの互換性を保つこと
- ジェネリクス型パラメータが正しく推論されること

## 技術要件

### インターフェース更新

- `ImmutableList<T>`インターフェースの該当メソッドシグネチャを更新
- 既存のメソッドとの一貫性を保つ

### 実装要件

- immutableパターンを維持（元のリストを変更しない）
- 効率的なループ処理
- メモリ効率の良い実装

### テスト要件

- 各メソッドでindex引数が正しく渡されることのテスト
- index値が正しい順序（0, 1, 2, ...）であることのテスト
- 空のリストでの動作テスト
- 既存の機能が壊れていないことの確認テスト
- 型安全性の確認テスト

## 完了条件

1. 全ての対象メソッドのシグネチャが更新されている
2. 実装が正しく動作し、index引数が適切に渡される
3. 全てのテストがパスする
4. TypeScriptの型推論が正しく動作する
5. コードスタイル規約に準拠している
6. ビルドが成功する
7. 既存の機能が壊れていない
