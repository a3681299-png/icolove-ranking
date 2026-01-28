# =LOVE 楽曲ランキング 🎀

<p align="center">
  <strong>あなただけのイコラブ楽曲ランキングを作成できるWebアプリ</strong>
</p>

## ✨ 機能

| 機能                 | 説明                                 |
| -------------------- | ------------------------------------ |
| 🔍 楽曲検索          | 1st〜19thシングルの全70曲から検索    |
| 🖱️ ドラッグ&ドロップ | 直感的に順位を変更                   |
| 📥 画像保存          | ランキングをPNG画像でダウンロード    |
| 💾 自動保存          | 入力内容をブラウザに自動バックアップ |
| 📱 レスポンシブ      | スマホ・PC両対応                     |

## 🛠️ 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Animation**: Framer Motion
- **Image Export**: html-to-image

## 📁 ファイル構成

```
src/
├── app/
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # メインページ
│   └── globals.css     # グローバルスタイル
├── components/
│   ├── SortableRankItem.tsx   # D&D対応ランキング項目
│   ├── SongSearchModal.tsx    # 楽曲検索モーダル
│   └── Decorations.tsx        # 装飾アニメーション
└── data/
    └── songs.ts               # 全楽曲データ（70曲）
```

## 🚀 開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

http://localhost:3000 でアクセス

## 📝 ライセンス

MIT
