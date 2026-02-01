import { kv } from "@vercel/kv";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const imageUrl = await kv.get<string>(`share:${id}`);

  if (!imageUrl) {
    return { title: "イコラブ楽曲ランキング" };
  }

  return {
    title: "イコラブ楽曲ランキング",
    description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
    openGraph: {
      title: "イコラブ楽曲ランキング",
      description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: "イコラブ楽曲ランキング",
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const imageUrl = await kv.get<string>(`share:${id}`);

  // クライアントサイドでリダイレクト（OGPクローラーは↓のHTMLを見る）
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/" />
      </head>
      <body>
        <p>リダイレクト中...</p>
      </body>
    </html>
  );
}
