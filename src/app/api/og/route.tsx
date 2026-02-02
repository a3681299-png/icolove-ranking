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

    // idsパラメータの処理を堅牢にする
    // Next.jsのsearchParamsは自動デコードされるはずだが、念の為デコード処理を通す
    const idsRaw = searchParams.get("ids") || "";
    const idsStr = decodeURIComponent(idsRaw);
    const songIds = idsStr.split(",");

    console.log(`Generating OG Image. Title: ${title}, IDs: ${idsStr}`);

    // ランキングデータを復元
    const rankingItems = Array.from({ length: 15 }, (_, i) => {
      const id = songIds[i];
      if (!id) {
        return { rank: i + 1, title: "---", single: "" };
      }
      const song = songs.find((s) => s.id === id);
      return {
        rank: i + 1,
        title: song ? song.title : "Unknown",
        single: song
          ? song.singleNumber === 0
            ? "Album"
            : `${song.singleNumber}th`
          : "",
      };
    });

    // フォントの読み込み
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
          padding: "40px",
          background: "linear-gradient(135deg, #fff5f8 0%, #ffeaf4 100%)", // 全体の背景
          fontFamily: '"Noto Sans JP"',
          position: "relative",
        }}
      >
        {/* メインカード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: "30px",
            border: "4px solid #fff",
            boxShadow: "0 10px 40px rgba(255, 182, 193, 0.4)",
            padding: "30px",
            position: "relative",
          }}
        >
          {/* 背景装飾（ハート） */}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              fontSize: 60,
              color: "#ff69b4",
              opacity: 0.2,
              transform: "rotate(-15deg)",
            }}
          >
            ♡
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 30,
              right: 30,
              fontSize: 50,
              color: "#ffd700",
              opacity: 0.2,
              transform: "rotate(15deg)",
            }}
          >
            ★
          </div>

          {/* シーリングスタンプ画像（右上に配置） */}
          <img
            src={`${baseUrl}/assets/images2.png`}
            alt="Stamp"
            style={{
              position: "absolute",
              top: -30,
              right: -20,
              width: 220,
              height: 220,
              transform: "rotate(10deg)",
              filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))",
            }}
          />

          {/* タイトル */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #ff69b4, #ff1493)",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: 10,
                textShadow: "0 2px 0 #fff",
              }}
            >
              {title}
            </div>
            <div
              style={{ fontSize: 24, color: "#d8a0b0", fontStyle: "italic" }}
            >
              ~ =LOVE Best Songs ~
            </div>
          </div>

          {/* ランキンググリッド */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              gap: "30px",
              justifyContent: "space-between", // 均等配置
            }}
          >
            {/* 左カラム (1-8位) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "12px",
              }}
            >
              {rankingItems.slice(0, 8).map((item) => {
                const isTop3 = item.rank <= 3;
                let bgColor = "#fff";
                let borderColor = "transparent";

                if (item.rank === 1) {
                  bgColor = "#fff9c4"; // 薄い黄色
                  borderColor = "#ffd700";
                } else if (item.rank === 2) {
                  bgColor = "#f5f5f5"; // 薄いグレー
                  borderColor = "#c0c0c0";
                } else if (item.rank === 3) {
                  bgColor = "#ffebd7"; // 薄いオレンジ
                  borderColor = "#cd7f32";
                } else {
                  bgColor = "#fff";
                  borderColor = "#ffe0f0";
                }

                return (
                  <div
                    key={item.rank}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: bgColor,
                      borderRadius: "50px", // 丸みを強く
                      padding: "8px 24px",
                      border: `2px solid ${borderColor}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      height: "56px",
                    }}
                  >
                    {/* ランクアイコン/番号 */}
                    <div
                      style={{
                        width: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: isTop3 ? "#333" : "#ff69b4",
                      }}
                    >
                      {item.rank === 1
                        ? "👑"
                        : item.rank === 2
                          ? "🥈"
                          : item.rank === 3
                            ? "🥉"
                            : item.rank}
                    </div>

                    {/* 曲名 */}
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: "#444",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {item.title}
                    </div>

                    {/* シングル番号 */}
                    {item.single && (
                      <div
                        style={{
                          fontSize: "16px",
                          color: "#f9a8d4",
                          marginLeft: "8px",
                        }}
                      >
                        {item.single}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 右カラム (9-15位) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "12px",
              }}
            >
              {rankingItems.slice(8, 15).map((item) => (
                <div
                  key={item.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: "50px",
                    padding: "8px 24px",
                    border: "2px solid #fff0f5", // 非常に薄いピンク
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    height: "56px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ffb6c1",
                    }}
                  >
                    {item.rank}
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "#555",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                    }}
                  >
                    {item.title}
                  </div>
                  {/* シングル番号 */}
                  {item.single && (
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#f9a8d4",
                        marginLeft: "8px",
                      }}
                    >
                      {item.single}
                    </div>
                  )}
                </div>
              ))}

              {/* 日付とクレジット */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "10px",
                  color: "#d8a0b0",
                  fontSize: "18px",
                }}
              >
                <span>♡ 2026/2/1 ♡</span>
                <span>Created by @Et203Q</span>
              </div>
            </div>
          </div>
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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.log(`${message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
