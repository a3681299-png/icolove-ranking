"use client";

import { useState, useEffect } from "react";
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

  // クライアントサイドでのみマウント
  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(new Date().toLocaleDateString("ja-JP"));
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
      } catch (e) {
        console.error("データ読み込みエラー:", e);
      }
    }
  }, [isMounted]);

  // ローカルストレージに保存
  useEffect(() => {
    if (!isMounted) return;
    const data = { title, ranking };
    localStorage.setItem("icolove-ranking-data", JSON.stringify(data));
  }, [title, ranking, isMounted]);

  // ドラッグ&ドロップ用センサー（スマホスクロール対応）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500, // 長押し500msでドラッグ開始
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

  // 画像としてダウンロード
  const handleDownload = async () => {
    const element = document.getElementById("ranking-card");
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

  // ランキングリストのレンダリング（2列）
  const renderRankingList = () => {
    const listContent = (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
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
              marginBottom: "16px",
            }}
          >
            曲をタップして選択、ドラッグで順位変更
          </p>
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
          </div>
        </motion.div>
      </div>

      {/* 検索モーダル */}
      <SongSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={handleSelectSong}
      />
    </main>
  );
}
