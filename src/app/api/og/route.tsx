import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { songs } from "@/data/songs";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams, protocol, host } = new URL(req.url);
    const baseUrl = `${protocol}//${host}`;

    // パラメータ取得
    const title = searchParams.get("t") || "私的イコラブ楽曲ランキング";
    // idsパラメータは URLencoded されている可能性があるので、取り出しに注意
    // Comma separated list of IDs
    const idsStr = searchParams.get("ids") || "";
    const songIds = idsStr.split(",");

    // デバッグ用: コンソールにログを出力（Vercel Logsで確認可能）
    console.log(`Generating OG Image. Title: ${title}, IDs: ${idsStr}`);

    // ランキングデータを復元
    const rankingItems = Array.from({ length: 15 }, (_, i) => {
      const id = songIds[i];
      if (!id) {
        return { rank: i + 1, title: "---" };
      }
      const song = songs.find((s) => s.id === id);
      return {
        rank: i + 1,
        title: song ? song.title : "Unknown",
      };
    });

    // フォントの読み込み
    // Google FontsからNoto Sans JP Boldを取得
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
          backgroundColor: "#fff5f8",
          backgroundImage:
            "linear-gradient(180deg, #fff5f8 0%, #ffe8f5 20%, #fff0f5 40%, #f8e8ff 60%, #fff5f8 80%, #ffe0f0 100%)",
          fontFamily: '"Noto Sans JP"',
          position: "relative",
        }}
      >
        {/* 背景装飾（ハートなど） - 絶対配置 */}
        {/* 左上のハート群 */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            fontSize: 40,
            color: "rgba(255,182,193,0.4)",
          }}
        >
          ♥
        </div>
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 50,
            fontSize: 20,
            color: "rgba(255,182,193,0.4)",
          }}
        >
          ♥
        </div>
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 20,
            fontSize: 30,
            color: "rgba(255,105,180,0.2)",
          }}
        >
          ♥
        </div>

        {/* 右下のハート群 */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 30,
            fontSize: 50,
            color: "rgba(255,182,193,0.4)",
          }}
        >
          ♥
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            fontSize: 25,
            color: "rgba(255,105,180,0.2)",
          }}
        >
          ♥
        </div>

        {/* シーリングスタンプ画像（右上に配置） */}
        {/* 注意: img srcは絶対URLである必要があります */}
        <img
          src={`${baseUrl}/assets/images2.png`}
          alt="Stamp"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 180,
            height: 180,
            opacity: 0.9,
            transform: "rotate(15deg)",
          }}
        />

        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            fontSize: 60,
            color: "#ff69b4",
            fontWeight: "bold",
            marginBottom: 40,
            alignItems: "center",
            gap: "20px",
            zIndex: 10,
            textShadow: "2px 2px 0px #fff, 4px 4px 0px rgba(255,182,193,0.5)",
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

        <p
          style={{
            position: "absolute",
            top: 100,
            color: "#d8a0b0",
            fontSize: 24,
            fontStyle: "italic",
            margin: 0,
          }}
        >
          ~ =LOVE Best Songs ~
        </p>

        {/* ランキングリスト（2列レイアウト） */}
        <div
          style={{
            display: "flex",
            width: "1100px",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* 左カラム (1-8位) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "500px",
              gap: "10px",
            }}
          >
            {rankingItems.slice(0, 8).map((item) => (
              <div
                key={item.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: "15px",
                  padding: "10px 20px",
                  boxShadow: "0 4px 6px rgba(255,182,193,0.3)",
                  border: "2px solid #ffb6c1",
                  height: "60px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background:
                      item.rank === 1
                        ? "linear-gradient(135deg, #ffd700, #ffec8b)"
                        : item.rank === 2
                          ? "linear-gradient(135deg, #c0c0c0, #e0e0e0)"
                          : item.rank === 3
                            ? "linear-gradient(135deg, #cd7f32, #f4a460)"
                            : "#ffb6c1",
                    border: item.rank <= 3 ? "2px solid #fff" : "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginRight: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {item.rank}
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    color: "#333",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flex: 1,
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
              gap: "10px",
            }}
          >
            {rankingItems.slice(8, 15).map((item) => (
              <div
                key={item.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: "15px",
                  padding: "10px 20px",
                  boxShadow: "0 4px 6px rgba(255,182,193,0.3)",
                  border: "2px solid #ffb6c1",
                  height: "60px",
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
                    marginRight: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {item.rank}
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    color: "#333",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flex: 1,
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            color: "#e8c0d0",
            fontSize: 20,
            fontWeight: "bold",
            background: "rgba(255,255,255,0.8)",
            padding: "5px 15px",
            borderRadius: "20px",
            border: "1px solid #ffe0f0",
          }}
        >
          Created by @Et203Q
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
