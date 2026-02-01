import { kv } from "@vercel/kv";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const imageUrl = await kv.get<string>(`share:${id}`);

  // 環境変数からベースURLを取得（設定しておく必要があります）
  const baseUrl = "https://icolove-ranking.vercel.app";
  const shareUrl = `${baseUrl}/share/${id}`;

  if (!imageUrl) {
    return {
      title: "イコラブ楽曲ランキング",
      metadataBase: new URL(baseUrl),
    };
  }

  return {
    title: "イコラブ楽曲ランキング",
    description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: "イコラブ楽曲ランキング",
      description: "あなただけのイコラブ楽曲ランキングを作成しよう！",
      url: shareUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
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

  return (
    <html>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace("/");`,
          }}
        />
        <p>リダイレクト中...</p>
      </body>
    </html>
  );
}
