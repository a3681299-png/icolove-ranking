"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toPng } from "html-to-image";
import SortableRankItem from "@/components/SortableRankItem";
import SongSearchModal from "@/components/SongSearchModal";
import Decorations from "@/components/Decorations";
import { Song } from "@/data/songs";

interface RankingItem {
  id: string;
  rank: number;
  song: Song | null;
}

const INITIAL_RANKING: RankingItem[] = Array.from({ length: 15 }, (_, i) => ({
  id: `rank-${i + 1}`,
  rank: i + 1,
  song: null,
}));

export default function Home() {
  const [title, setTitle] = useState("私的イコラブ楽曲ランキング");
  const [ranking, setRanking] = useState<RankingItem[]>(INITIAL_RANKING);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedRankId, setSelectedRankId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [oshiPhoto, setOshiPhoto] = useState<string | null>(null);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 }); // -50 ~ 50 の範囲
  const fileInputRef = useRef<HTMLInputElement>(null);

  // クライアントサイドでのみマウント
  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(new Date().toLocaleDateString("ja-JP"));

    // モバイル判定
    const checkMobile = () => setIsMobile(window.innerWidth <= 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ローカルストレージから復元
  useEffect(() => {
    if (!isMounted) return;
    const saved = localStorage.getItem("icolove-ranking-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.title) setTitle(data.title);
        if (data.ranking) setRanking(data.ranking);
        if (data.oshiPhoto) setOshiPhoto(data.oshiPhoto);
      } catch (e) {
        console.error("データ読み込みエラー:", e);
      }
    }
  }, [isMounted]);

  // ローカルストレージに保存
  useEffect(() => {
    if (!isMounted) return;
    const data = { title, ranking, oshiPhoto };
    localStorage.setItem("icolove-ranking-data", JSON.stringify(data));
  }, [title, ranking, oshiPhoto, isMounted]);

  // CSSベースの3層構造なのでCanvas合成は不要
  // oshiPhotoをそのまま使用する

  // 推し写真をアップロード
  const handleOshiPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOshiPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  // 推し写真をクリア
  const clearOshiPhoto = () => {
    setOshiPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ドラッグ&ドロップ用センサー（スマホスクロール対応）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300, // 長押し300msでドラッグ開始
        tolerance: 10, // 10px以上動くとキャンセル（スクロール優先）
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRanking((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({
          ...item,
          rank: index + 1,
        }));
      });
    }
  };

  // 曲選択モーダルを開く
  const openSongSearch = (rankId: string) => {
    setSelectedRankId(rankId);
    setSearchModalOpen(true);
  };

  // 曲を選択
  const handleSelectSong = (song: Song) => {
    if (selectedRankId) {
      setRanking((items) =>
        items.map((item) =>
          item.id === selectedRankId ? { ...item, song } : item,
        ),
      );
    }
    setSearchModalOpen(false);
    setSelectedRankId(null);
  };

  // 曲をクリア
  const handleClearSong = (rankId: string) => {
    setRanking((items) =>
      items.map((item) =>
        item.id === rankId ? { ...item, song: null } : item,
      ),
    );
  };

  // 画像としてダウンロード（隠しカードを撮影）
  const handleDownload = async () => {
    const element = document.getElementById("ranking-card-hidden");
    if (!element) return;

    setIsDownloading(true);

    try {
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: "#fff5f8",
      });

      const link = document.createElement("a");
      link.download = `イコラブランキング_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("画像生成エラー:", error);
      alert("画像の生成に失敗しました");
    } finally {
      setIsDownloading(false);
    }
  };

  // 左列（1-8位）と右列（9-15位）に分割
  const leftColumn = ranking.slice(0, 8);
  const rightColumn = ranking.slice(8, 15);

  // ランキング列のレンダリング
  const renderColumn = (items: RankingItem[]) => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}
    >
      <AnimatePresence>
        {items.map((item) => (
          <SortableRankItem
            key={item.id}
            item={item}
            onSelect={() => openSongSearch(item.id)}
            onClear={() => handleClearSong(item.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  // ランキングリストのレンダリング（モバイル:1列 / デスクトップ:2列）
  const renderRankingList = () => {
    const listContent = isMobile ? (
      // 1列レイアウト（モバイル通常表示）
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <AnimatePresence>
          {ranking.map((item) => (
            <SortableRankItem
              key={item.id}
              item={item}
              onSelect={() => openSongSearch(item.id)}
              onClear={() => handleClearSong(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    ) : (
      // 2列レイアウト（デスクトップ）
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {renderColumn(leftColumn)}
        {renderColumn(rightColumn)}
      </div>
    );

    if (!isMounted) {
      return listContent;
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ranking.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {listContent}
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* 編集パネル */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(255, 182, 193, 0.3)",
            border: "2px dashed #ffb6c1",
          }}
        >
          <h2
            style={{
              color: "#ff69b4",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            ✏️ 編集モード
          </h2>
          <p
            style={{
              color: "#d8a0b0",
              fontSize: "0.85rem",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            曲をタップして選択、ドラッグで順位変更
          </p>

          {/* 推し写真アップロード */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                color: "#d8a0b0",
                marginBottom: "6px",
                textAlign: "center",
              }}
            >
              💖 推しの写真（シーリングスタンプ風に表示）
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleOshiPhotoUpload}
                style={{ display: "none" }}
                id="oshi-photo-input"
              />
              <label
                htmlFor="oshi-photo-input"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "2px dashed #ffb6c1",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  background: "white",
                  textAlign: "center",
                  color: oshiPhoto ? "#ff69b4" : "#d8a0b0",
                }}
              >
                {oshiPhoto ? "✓ アップロード済み" : "写真を選択..."}
              </label>
              {oshiPhoto && (
                <button
                  onClick={clearOshiPhoto}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "2px solid #ffb6c1",
                    background: "white",
                    color: "#ff69b4",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  クリア
                </button>
              )}
            </div>
            {/* プレビューとクロップ調整 */}
            {oshiPhoto && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  {/* 2層構造のプレビュー */}
                  <div
                    style={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                      margin: "0 auto",
                    }}
                  >
                    {/* 下層: ユーザーの写真（円形に切り抜き） */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `translate(calc(-50% + ${cropOffset.x}%), calc(-50% + ${cropOffset.y}%))`,
                        width: "32%",
                        height: "32%",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={oshiPhoto}
                        alt="推しプレビュー"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    {/* 上層: シーリングスタンプ（images2.png） */}
                    <img
                      src="/assets/images2.png"
                      alt="シーリングスタンプ"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
                {/* クロップ位置調整 */}
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#d8a0b0",
                    marginBottom: "6px",
                  }}
                >
                  📍 切り抜き位置調整
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#d8a0b0",
                      minWidth: "30px",
                    }}
                  >
                    左右
                  </span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={cropOffset.x}
                    onChange={(e) =>
                      setCropOffset((prev) => ({
                        ...prev,
                        x: Number(e.target.value),
                      }))
                    }
                    style={{ flex: 1, accentColor: "#ff69b4" }}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#d8a0b0",
                      minWidth: "30px",
                    }}
                  >
                    上下
                  </span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={cropOffset.y}
                    onChange={(e) =>
                      setCropOffset((prev) => ({
                        ...prev,
                        y: Number(e.target.value),
                      }))
                    }
                    style={{ flex: 1, accentColor: "#ff69b4" }}
                  />
                </div>
                <button
                  onClick={() => setCropOffset({ x: 0, y: 0 })}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ffb6c1",
                    background: "transparent",
                    color: "#d8a0b0",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    width: "100%",
                  }}
                >
                  中央にリセット
                </button>
              </div>
            )}
          </div>

          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 25px rgba(255, 105, 180, 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {isDownloading ? <>⏳ 生成中...</> : <>📥 画像として保存 ✨</>}
          </motion.button>
        </motion.div>

        {/* ランキングカード */}
        <motion.div
          id="ranking-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ position: "relative" }}
        >
          {/* 装飾 */}
          <Decorations />

          {/* 推し写真（シーリングスタンプフレーム） */}
          {oshiPhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                position: "absolute",
                top: isMobile ? "-60px" : "-18%",
                right: isMobile ? "-60px" : "-18%",
                zIndex: 20,
                width: isMobile ? "200px" : "50%",
                height: isMobile ? "200px" : "50%",
                filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35))",
              }}
            >
              {/* 下層: ユーザーの写真（円形に切り抜き） */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${cropOffset.x}%), calc(-50% + ${cropOffset.y}%))`,
                  width: "40%",
                  height: "40%",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={oshiPhoto}
                  alt="推し写真"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* 上層: シーリングスタンプ（images2.png） */}
              <img
                src="/assets/images2.png"
                alt="シーリングスタンプ"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          )}

          {/* ヘッダー */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#ff69b4", fontSize: "1.5rem" }}>♡</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #ff69b4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  width: "auto",
                  minWidth: "200px",
                }}
              />
              <span style={{ color: "#ff69b4", fontSize: "1.5rem" }}>♡</span>
            </div>
            <p
              style={{
                color: "#d8a0b0",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              ~ =LOVE Best Songs ~
            </p>
          </div>

          {/* ランキングリスト（2列） */}
          {renderRankingList()}

          {/* フッター */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#d8a0b0", fontSize: "0.85rem" }}>
              ♡ {currentDate || "---"} ♡
            </span>

            {/* クレジット表示 */}
            <div
              style={{
                marginTop: "12px",
                fontSize: "0.7rem",
                color: "#e8c0d0",
                opacity: 0.7,
                textAlign: "right",
              }}
            >
              Created by @Et203Q
            </div>
          </div>
        </motion.div>
      </div>

      {/* 検索モーダル */}
      <SongSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={handleSelectSong}
      />

      {/* 画像保存用の隠しカード（画面外に配置、固定幅700pxで2列レイアウト） */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "700px",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div
          id="ranking-card-hidden"
          className="card"
          style={{
            position: "relative",
            background:
              "linear-gradient(180deg, #fff5f8 0%, #ffe8f5 20%, #fff0f5 40%, #f8e8ff 60%, #fff5f8 80%, #ffe0f0 100%)",
          }}
        >
          {/* 装飾 */}
          <Decorations />

          {/* 推し写真（CSSベース3層構造シーリングスタンプ） */}
          {oshiPhoto && (
            <div
              style={{
                position: "absolute",
                top: "-25px",
                right: "-25px",
                zIndex: 20,
                width: "200px",
                height: "200px",
                transform: "rotate(-10deg)",
                filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35))",
              }}
            >
              {/* 下層: ユーザーの写真（円形に切り抜き） */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${cropOffset.x}%), calc(-50% + ${cropOffset.y}%))`,
                  width: "32%",
                  height: "32%",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={oshiPhoto}
                  alt="推し写真"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* 上層: シーリングスタンプ（images2.png） */}
              <img
                src="/assets/images2.png"
                alt="シーリングスタンプ"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          {/* ヘッダー */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#ff69b4", fontSize: "1.5rem" }}>♡</span>
              <span
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #ff69b4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {title}
              </span>
              <span style={{ color: "#ff69b4", fontSize: "1.5rem" }}>♡</span>
            </div>
            <p
              style={{
                color: "#d8a0b0",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              ~ =LOVE Best Songs ~
            </p>
          </div>

          {/* ランキングリスト（常に2列） */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                flex: 1,
              }}
            >
              {leftColumn.map((item) => (
                <SortableRankItem
                  key={`hidden-${item.id}`}
                  item={item}
                  onSelect={() => {}}
                  onClear={() => {}}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                flex: 1,
              }}
            >
              {rightColumn.map((item) => (
                <SortableRankItem
                  key={`hidden-${item.id}`}
                  item={item}
                  onSelect={() => {}}
                  onClear={() => {}}
                />
              ))}
            </div>
          </div>

          {/* フッター */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#d8a0b0", fontSize: "0.85rem" }}>
              ♡ {currentDate || "---"} ♡
            </span>

            {/* クレジット表示 */}
            <div
              style={{
                marginTop: "12px",
                fontSize: "0.7rem",
                color: "#e8c0d0",
                opacity: 0.7,
                textAlign: "right",
              }}
            >
              Created by @Et203Q
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
