import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { songs } from "@/data/songs";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // パラメータ取得
    const title = searchParams.get("t") || "私的イコラブ楽曲ランキング";
    const idsStr = searchParams.get("ids") || "";
    const songIds = idsStr.split(",");

    // ランキングデータを復元
    const rankingItems = songIds
      .map((id, index) => {
        const song = songs.find((s) => s.id === id);
        return {
          rank: index + 1,
          title: song ? song.title : id === "" ? "---" : "Unknown",
          // color: song ? getColorForSong(song) : '#eee' // 必要なら
        };
      })
      .slice(0, 15); // 最大15位まで

    // フォントの読み込み（日本語対応のためGoogle Fontsなどを読み込む必要がある）
    // ここでは標準的なNoto Sans JPなどをfetchしてArrayBufferにする例
    // ※ Vercel Edge Functionではfetch制限やサイズ制限があるため注意が必要
    // 簡易的に標準のsans-serifで英語のみなら不要だが、日本語タイトルなので必須

    // Google FontsからNoto Sans JPを取得するヘルパー
    /*
    const fontData = await fetch(
      new URL('../../../assets/NotoSansJP-Bold.otf', import.meta.url)
    ).then((res) => res.arrayBuffer());
    */

    // 今回は外部URLから動的に取得する簡易実装（またはシステムフォントに頼るが、日本語は文字化けしやすい）
    // 推奨はローカルにフォントファイルを置いておくか、Google Fonts APIを叩く
    // ここではデモ用として、Google Fontsから取得するコードを入れます
    const fontData = await fetch(
      `https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf`,
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff5f8", // ピンク系の背景
          backgroundImage: "linear-gradient(180deg, #fff5f8 0%, #ffe8f5 100%)",
          fontFamily: '"Noto Sans JP"',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            fontSize: 60,
            color: "#ff69b4",
            fontWeight: "bold",
            marginBottom: 20,
            alignItems: "center",
            gap: "20px",
          }}
        >
          <span>♡</span>
          <span
            style={{
              background: "linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </span>
          <span>♡</span>
        </div>

        {/* ランキングリスト（2列レイアウト） */}
        <div
          style={{
            display: "flex",
            width: "1100px",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {/* 左カラム (1-8位) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "500px",
              gap: "8px",
            }}
          >
            {rankingItems.slice(0, 8).map((item) => (
              <div
                key={item.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  boxShadow: "0 2px 4px rgba(255,182,193,0.3)",
                  border: "1px solid #ffb6c1",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background:
                      item.rank <= 3
                        ? "linear-gradient(135deg, #ffd700, #ffa500)"
                        : "#ffb6c1",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginRight: "12px",
                  }}
                >
                  {item.rank}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "#333",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          {/* 右カラム (9-15位) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "500px",
              gap: "8px",
            }}
          >
            {rankingItems.slice(8, 15).map((item) => (
              <div
                key={item.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  boxShadow: "0 2px 4px rgba(255,182,193,0.3)",
                  border: "1px solid #ffb6c1",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#ffb6c1",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginRight: "12px",
                  }}
                >
                  {item.rank}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "#333",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 30, color: "#ff69b4", fontSize: 24 }}>
          =LOVE Best Songs Ranking
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Noto Sans JP",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
