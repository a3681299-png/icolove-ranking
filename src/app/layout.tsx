import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "=LOVE 楽曲ランキング",
  description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
  openGraph: {
    title: "=LOVE 楽曲ランキング",
    description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={zenMaruGothic.className}>{children}</body>
    </html>
  );
}
