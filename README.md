# Switchセールナビ (Nintendo Switch Sales Tracker)

ニンテンドーストア（マイニンテンドーストア / ニンテンドーeショップ 日本）で現在セール中のおすすめゲームソフトを厳選し、**Metacritic高評価順ソート**や**ジャンル別絞り込み**、**AIによるおすすめ寸評**でまとめたWebアプリケーションです。

---

## 主な機能

* 🏷️ **現在セール中のゲームソフト一覧 & 価格・割引率表示**
  * 定価、セール価格、割引率（-50%など）、セール終了までの残り時間（カウントダウン）を表示
* 🎯 **ジャンル・カテゴリ別絞り込み & 価格帯クイックフィルター**
  * アクション、RPG、インディー、シミュレーション、パズル等のワンタップ絞り込み
  * 〜500円、〜1,000円、〜2,000円などの予算別フィルター
* ⭐ **評価が高い順ソート（Metacritic / レビュー評価）**
  * Metacriticスコア（90点以上の圧倒的名作、80点以上の大絶賛など）によるソート
  * 割引率順、価格が安い順、セール終了が近い順への並び替え
* 💬 **おすすめポイント（一言寸評）**
  * ゲームの魅力やどんな人におすすめか（#ローグライク好き、#神曲 等のタグ付き）を表示
* 🛒 **マイニンテンドーストア直接購入リンク**
  * 各タイトルの「ストアで見る」ボタンから任天堂公式ストアに直接アクセス可能
* ❤️ **お気に入り機能（ローカル保存）**
  * 気になるタイトルにハートを付けて、後からお気に入り一覧のみをワンクリックで確認可能
* 📱 **スマホファースト設計**
  * 片手での快適な操作を前提としたレスポンシブUI（Tailwind CSS）

---

## 技術構成

* **フロントエンド**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React
* **データ収集**: Python 3（任天堂eShop API + RAWG API + Gemini API）
* **自動更新 & ホスティング**: GitHub Actions（日次自動実行） + GitHub Pages（無料運用）

---

## ローカル開発手順

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド & 型チェック
npm run build
```

---

## GitHub Pages への公開手順

1. **GitHub に新しいリポジトリを作成**（例: `nintendo-sales-tracker`）
2. **ローカルリポジトリをプッシュ**:
   ```bash
   git remote add origin https://github.com/<あなたのユーザー名>/nintendo-sales-tracker.git
   git branch -M main
   git push -u origin main
   ```
3. **GitHub リポジトリ設定で GitHub Pages を有効化**:
   * リポジトリの `Settings` > `Pages` に移動
   * `Build and deployment` > `Source` で **「GitHub Actions」** を選択
4. **（任意）APIキーの登録**:
   * 日次自動更新でスコアや寸評を自動生成したい場合、`Settings` > `Secrets and variables` > `Actions` に以下を登録：
     * `RAWG_API_KEY`: [RAWG.io](https://rawg.io/apidocs) で取得した無料APIキー
     * `GEMINI_API_KEY`: Google AI Studio で取得した無料APIキー
5. 自動的に `.github/workflows/deploy.yml` が走り、数分でサイトが公開されます！
