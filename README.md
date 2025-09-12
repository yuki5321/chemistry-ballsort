# Chemistry Ball Sort Game

化学の分子式を学習するためのボールソートゲームです。

## 🚀 デプロイ手順（Vercel推奨）

### 1. GitHubにコードをプッシュ
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercelでデプロイ
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでログイン
3. "New Project"をクリック
4. このリポジトリを選択
5. 環境変数を設定：
   - `DATABASE_URL`: PostgreSQLデータベースのURL
6. "Deploy"をクリック

### 3. データベースの設定
Vercelでは以下のデータベースサービスがお勧めです：
- **Neon** (無料): https://neon.tech
- **Supabase** (無料): https://supabase.com
- **PlanetScale** (無料): https://planetscale.com

### 4. 環境変数の設定
Vercelのダッシュボードで以下の環境変数を設定：
```
DATABASE_URL=postgresql://username:password@host:port/database
```

## 🛠️ ローカル開発

### 必要な環境
- Node.js 18以上
- npm または yarn

### セットアップ
```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### データベース設定
ローカル開発ではSQLiteを使用：
```bash
# データベースマイグレーション
npm run db:push
```

## 📁 プロジェクト構成

```
chemistry-ballsort/
├── client/          # フロントエンド（React + TypeScript）
├── server/          # バックエンド（Express + TypeScript）
├── shared/          # 共通の型定義とスキーマ
├── vercel.json      # Vercel設定ファイル
└── package.json     # 依存関係とスクリプト
```

## 🎮 ゲームの特徴

- 化学の分子式を学習
- ボールソートパズル形式
- ユーザー登録・ログイン機能
- スコア記録・ランキング
- レスポンシブデザイン

## 🛠️ 技術スタック

- **フロントエンド**: React, TypeScript, Vite, Tailwind CSS
- **バックエンド**: Express, TypeScript, Node.js
- **データベース**: PostgreSQL (本番) / SQLite (開発)
- **ORM**: Drizzle ORM
- **認証**: Passport.js
- **デプロイ**: Vercel

## 📝 ライセンス

MIT License
