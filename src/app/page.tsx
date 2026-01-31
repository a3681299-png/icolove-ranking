import { Metadata } from "next";
import RankingEditor from "@/components/RankingEditor";

// サーバーコンポーネントなので "use client" は無し

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const title = (searchParams["t"] as string) || "私的イコラブ楽曲ランキング";
  const ids = (searchParams["ids"] as string) || "";

  // OGP画像のURLを構築
  // 注意: production環境では絶対パスが必要な場合があるが、
  // Vercelデプロイ時などは一般的に相対パスでも解決される、あるいは metadataBase を設定する
  // ここではシンプルに /api/og に対するパラメータ付きURLを指定

  // URLSearchParamsを使って正しくエンコード
  const params = new URLSearchParams();
  params.set("t", title);
  if (ids) params.set("ids", ids);

  const ogImageUrl = `/api/og?${params.toString()}`;

  return {
    title: `${title} | =LOVE楽曲ランキング`,
    description: "あなたの好きなイコラブ楽曲でランキングを作ろう！",
    openGraph: {
      title: title,
      description: "あなたの好きなイコラブ楽曲でランキングを作ろう！",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: "あなたの好きなイコラブ楽曲でランキングを作ろう！",
      images: [ogImageUrl],
    },
  };
}

export default function Page({ searchParams }: Props) {
  const initialTitle = (searchParams["t"] as string) || undefined;
  const idsStr = (searchParams["ids"] as string) || "";
  const initialRankingIds = idsStr ? idsStr.split(",") : undefined;

  return (
    <RankingEditor
      initialTitle={initialTitle}
      initialRankingIds={initialRankingIds}
    />
  );
}
