import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

// フォントの設定
const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// メタデータの設定
export const metadata: Metadata = {
  title: "=LOVE 楽曲ランキング",
  description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
  openGraph: {
    title: "=LOVE 楽曲ランキング",
    description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
  },
};

// 全体のレイアウト（1つにまとめました！）
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={zenMaruGothic.className}>{children}</body>
      {/* 測定IDをここで読み込む */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-8DFLFN5NR4"} />
    </html>
  );
}
