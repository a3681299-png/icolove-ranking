import { kv } from "@vercel/kv";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const imageUrl = await kv.get<string>(`share:${id}`);
  const baseUrl = "https://icolove-ranking.vercel.app";

  if (!imageUrl) {
    return { title: "イコラブ楽曲ランキング" };
  }

  return {
    metadataBase: new URL(baseUrl),
    title: "私のイコラブ楽曲ランキング",
    description: "イコラブ楽曲ランキングをチェック！",
    openGraph: {
      title: "私のイコラブ楽曲ランキング",
      description: "イコラブ楽曲ランキングをチェック！",
      url: `/share/${id}`, // metadataBaseがあるので相対パスでOK
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: "私のイコラブ楽曲ランキング",
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const imageUrl = await kv.get<string>(`share:${id}`);

  if (!imageUrl) {
    return <div>画像が見つかりません</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        gap: "24px",
      }}
    >
      <img
        src={imageUrl}
        alt="イコラブ楽曲ランキング"
        style={{
          maxWidth: "100%",
          maxHeight: "80vh",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      />
      <Link
        href="/"
        style={{
          padding: "14px 28px",
          background: "#ec4899",
          color: "white",
          textDecoration: "none",
          borderRadius: "9999px",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        自分もランキングを作る ♡
      </Link>
    </div>
  );
}
