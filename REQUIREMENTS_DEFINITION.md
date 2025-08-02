# 要件定義: ImmutableMapにkeySeqメソッドを追加

## 目的

immutable-jsのMapの実装を参考にして、ImmutableMapに`keySeq`メソッドを追加する。

## 機能要件

### keySeqメソッドの仕様

- **メソッド名**: `keySeq()`
- **戻り値**: マップ内の全てのキーを含む`IndexedSequence<K>`
- **動作**: マップに格納されているキーを順序付きで取得でき、Sequenceの操作（map, filter, etc.）が利用可能
- **型安全性**: TypeScriptの型推論でキーの型が正しく推論される

### 参考実装

- immutable-jsのMap.keySeq()メソッドの動作を参考にする
- 既存のImmutableMapのAPIデザインパターンに合わせる

## 技術要件

### Sequence実装

- `IndexedSequence<T>`インターフェースとファクトリ関数を作成
- map, filter, first, last, forEach, find, includes, reverse, slice, take, skip等のメソッドを提供
- immutableパターンを維持

### インターフェース追加

- `ImmutableMap<K, V>`インターフェースに`keySeq(): IndexedSequence<K>`メソッドを追加
- 既存のメソッドとの一貫性を保つ

### 実装要件

- immutableパターンを維持（元のマップを変更しない）
- HAMT（Hash Array Mapped Trie）構造からキーを効率的に抽出
- メモリ効率の良い実装

### テスト要件

- 空のマップでの動作テスト
- 複数のキーを持つマップでの動作テスト
- キーの型が正しく保持されることのテスト
- IndexedSequenceのメソッド（map, filter等）が正しく動作することのテスト
- 既存のテストが全て通ることの確認

## 完了条件

1. `IndexedSequence<T>`が実装されている
2. `keySeq()`メソッドがImmutableMapインターフェースに追加されている
3. 実装が正しく動作し、全てのテストがパスする
4. TypeScriptの型推論が正しく動作する
5. コードスタイル規約に準拠している
6. ビルドが成功する

## ✅ 達成済み

- IndexedSequence実装完了
- keySeqメソッド追加完了
- テスト実装完了
- 全テストパス確認完了
