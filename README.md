# =LOVE 楽曲ランキング 🎀

<p align="center">
  <strong>あなただけのイコラブ楽曲ランキングを作成できるWebアプリ</strong>
</p>

## ✨ 機能

| 機能                  | 説明                                      |
| --------------------- | ----------------------------------------- |
| 🔍 **楽曲検索**       | 1st〜19thシングルの全70曲以上から検索可能 |
| 🖱️ **D&D操作**        | 直感的なドラッグ&ドロップで順位を入れ替え |
| �️ **画像生成**        | 作成したランキングを画像として保存        |
| 🔗 **シェア機能**     | ランキングをURLで共有（Dynamic OGP対応）  |
| 💿 **ジャケット表示** | TOP3の楽曲はジャケット画像を表示          |
| 💾 **自動保存**       | 入力内容をブラウザに自動バックアップ      |

## 🛠️ 技術スタック

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Database (KV)**: [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (@upstash/redis)
- **OG Image**: [@vercel/og](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 📁 ファイル構成

```
src/
├── app/
│   ├── api/
│   │   ├── share/      # シェア用API (KV保存)
│   │   └── og/         # OGP画像生成API
│   ├── share/[id]/     # シェアページ
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # メインページ
├── components/
│   ├── SortableRankItem.tsx   # D&D対応ランキング項目
│   ├── SongSearchModal.tsx    # 楽曲検索モーダル
│   ├── Decorations.tsx        # 装飾アニメーション
│   └── ...
└── data/
    └── songs.ts        # 楽曲データ管理（1st〜19thシングル+アルバム）
```

## 🚀 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

Vercel KVを使用しているため、`.env` ファイルに以下の設定が必要です。
Vercelのプロジェクト設定から値を取得してください。

```env
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## 📝 ライセンス

MIT
