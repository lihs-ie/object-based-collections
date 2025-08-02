# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**object-based-collections** is a TypeScript library providing immutable, functional data structures with object-oriented APIs. The library includes `Optional<T>`, `ImmutableList<T>`, `ImmutableSet<T>`, and `ImmutableMap<K,V>` with full type safety and no runtime dependencies.

## Essential Commands

### Development

- `pnpm test` - Run tests in watch mode
- `pnpm run testrun` - Run tests once
- `pnpm build` - Build both CommonJS and ESM versions
- `pnpm exec eslint src/**/*.ts --fix` - Lint and fix TypeScript files
- `pnpm exec prettier --write "**/*.{ts,tsx,js,jsx,json,md,yml,yaml}"` - Format code

### Task Completion Checklist

Always run these commands before considering a task complete:

1. `pnpm run testrun` - All tests must pass
2. `pnpm exec eslint src/**/*.ts --fix` - No linting errors
3. `pnpm build` - Ensure clean build

## Architecture

### Core Structure

- `/src/collections/` - Collection implementations
  - `/optional/` - Optional null-safe wrapper
  - `/list/` - ImmutableList with functional operations
  - `/set/` - ImmutableSet using HAMT
  - `/map/` - ImmutableMap with structural sharing
  - `/hamt/` - Hash Array Mapped Trie implementation
- `/src/tests/` - Test suite organized by collection type

### Design Patterns

- **Factory Functions**: Collections use factory pattern (e.g., `ImmutableList()`)
- **Method Chaining**: All operations return new instances for chaining
- **Immutability**: No mutations, always return new instances
- **Type Safety**: Strict TypeScript with generics throughout

## Code Standards

### TypeScript Conventions

- Strict TypeScript configuration
- Interface-based API design
- Generic type parameters for all collections
- Factory function pattern matching interface names

### Code Style (enforced by Prettier/ESLint)

- Single quotes, semicolons required
- 2-space indentation, 80 character width
- Import order: builtin → external → internal → parent/sibling
- No unused imports or variables (except `_` prefixed)
- Circular dependency detection enabled

### Testing Philosophy

- **Test-Driven Development**: Write failing tests before implementation
- **Vitest** for testing with global utilities
- Tests located in `src/**/*.test.ts`
- Follow Red-Green-Refactor cycle

## 開発ワークフロー

### Conversation Guidelines

- 常に日本語で会話する

### 要件定義を REQUIREMENTS_DEFINITION.md にまとめる

- 実装・修正を開始する前に**必ず**要件定義を /REQUIREMENTS_DEFINITION.md にまとめること
- 全ての要件が達成された後にこの md ファイルをクリアにすること

## 1. 基本哲学: テスト駆動

- **テストが開発を駆動する:** すべてのプロダクションコードは、失敗するテストをパスさせるためだけに書かれます。テストは後付けの作業ではありません。それ自身が仕様書であり、設計の駆動役です。
- **リファクタリングへの自信:** 包括的なテストスイートは我々のセーフティネットです。これにより、私たちは恐れることなく継続的にコードベースのリファクタリングと改善を行えます。
- **テスト容易性は良い設計に等しい:** コードがテストしにくい場合、それは悪い設計の兆候です。エージェントは、テスト容易性の高いコード作成を最優先しなければなりません。それは自然と、疎結合で凝集度の高いアーキテクチャにつながります。

## 2. 開発サイクル: レッド・グリーン・リファクタリング・コミット

エージェントは、いかに小さな変更であっても、必ずこの反復的なサイクルに従わなければなりません。コードを生成する際は、現在どのフェーズにいるのかを明示してください。

### フェーズ 1: レッド - 失敗するテストを書く

- **目的:** これから何を達成するのかを明確に定義する。
- **行動:** 実装コードを書く前に、これから実装したい単一の機能に対する、具体的で失敗するテストを一つ作成する。
- **条件:** 対応する実装がまだ存在しないため、このテストは必ず失敗（**レッド**）しなければならない。

### フェーズ 2: グリーン - テストをパスさせる

- **目的:** テストで示された要件を満たす。
- **行動:** 失敗したテストをパスさせるために必要な、**最小限のコード**を記述する。
- **条件:** この段階で余分な機能を追加しないこと。コードの美しさは追求せず、ただテストをパス（**グリーン**）させることだけを考える。

### フェーズ 3: リファクタリング - 設計を改善する

- **目的:** テストが通っている状態を維持しながら、コードの品質を向上させる。
- **行動:** テストが成功しているという安全な状態で、コードの内部構造を改善する。これには以下の作業が含まれるが、これに限定されない。
  - 重複の排除（DRY 原則）
  - 命名の明確化
  - 複雑なロジックの単純化
  - 後述のコーディング規約がすべて満たされていることの確認
- **条件:** リファクタリングの全プロセスを通じて、すべてのテストは**グリーン**の状態を維持しなければならない。
  - テストが成功しない場合テストをスキップすることは禁止する
  - テストを成功させるために単純な別のテストファイルを作成することを禁止する

### フェーズ 4: コミット - 進捗を保存する

- **目的:** 正常に動作する小さな機能単位を、安全なバージョンとして記録する。
- **行動:** リファクタリングが完了し、全テストがグリーンであることを最終確認したら、`git add .` を実行して変更をステージングする。これは、次の機能開発へ進む前の安定したチェックポイントとなる。
- **条件:** このサイクルで実装された変更が、一つの意味のあるまとまりとして完結していること。コミットメッセージもその内容を簡潔に表現すること。

## 3. 厳格なコーディング規約と禁止事項

### 【最重要】ハードコードの絶対禁止

いかなる形式のハードコードも固く禁じます。

- **マジックナンバー:** 数値リテラルをロジック内に直接記述してはならない。意味のある名前の定数を定義すること。
  - _悪い例:_ `if (age > 20)`
  - _良い例:_ `const ADULT_AGE = 20; if (age > ADULT_AGE)`
- **設定値:** API キー、URL、ファイルパス、その他の環境設定は、必ず設定ファイル（`.env`など）や環境変数から読み込むこと。ソースコード内に直接記述してはならない。
- **ユーザー向け文字列:** UI に表示するテキスト、ログ、エラーメッセージなどは、メンテナンスと国際化を容易にするため、定数や言語ファイルで管理すること。

### その他の主要な規約

- **単一責任の原則 (SRP):** 一つのモジュール、クラス、関数は、機能の一部分に対してのみ責任を持つべきである。
- **DRY (Don't Repeat Yourself):** コードの重複は絶対に避けること。共通ロジックは抽象化し、再利用する。
- **明確で意図の伝わる命名:** 変数名や関数名は、その目的と意図が明確に伝わるように命名する。
- **ガード節 / 早期リターン:** 深くネストした`if-else`構造を避け、早期リターンを積極的に利用する。
- **セキュリティ第一:** ユーザーからの入力は常に信頼しないこと。一般的な脆弱性（XSS、SQL インジェクション等）を防ぐため、入力のサニタイズと出力のエンコードを徹底する。
