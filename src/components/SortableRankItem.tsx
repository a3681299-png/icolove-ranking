"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Song } from "@/data/songs";

interface RankingItem {
  id: string;
  rank: number;
  song: Song | null;
}

interface SortableRankItemProps {
  item: RankingItem;
  onSelect: () => void;
  onClear: () => void;
}

// ぷにぷにスプリング設定
const springConfig = {
  type: "spring" as const,
  stiffness: 400,
  damping: 15,
};

// ホバー時のぷにぷにエフェクト
const hoverAnimation = {
  scale: 1.02,
  y: -2,
  transition: springConfig,
};

// タップ時のぷにっとエフェクト
const tapAnimation = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export default function SortableRankItem({
  item,
  onSelect,
  onClear,
}: SortableRankItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return "👑 1";
      case 2:
        return "🥈 2";
      case 3:
        return "🥉 3";
      default:
        return String(rank);
    }
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "";
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -30, scale: 0.8 }}
      animate={{
        opacity: isDragging ? 0.9 : 1,
        x: 0,
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 2 : 0,
        boxShadow: isDragging
          ? "0 15px 30px rgba(255, 105, 180, 0.4)"
          : "0 2px 8px rgba(255, 182, 193, 0.3)",
      }}
      whileHover={!isDragging ? hoverAnimation : undefined}
      whileTap={!isDragging ? tapAnimation : undefined}
      transition={{
        ...springConfig,
        opacity: { duration: 0.2 },
      }}
      className={`rank-item ${getRankClass(item.rank)} ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      {/* 順位 - ぷるぷるアニメーション */}
      <motion.div
        className="rank-number"
        animate={
          item.rank <= 3
            ? {
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.rank * 0.2,
        }}
      >
        {getRankDisplay(item.rank)}
      </motion.div>

      {/* 曲名 */}
      <motion.div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
      >
        {item.song ? (
          <motion.div
            className="truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-gray-700 font-medium">{item.song.title}</span>
            <motion.span
              className="text-pink-300 text-xs ml-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.song.singleNumber === 0
                ? "Album"
                : `${item.song.singleNumber}th`}
            </motion.span>
          </motion.div>
        ) : (
          <motion.span
            className="text-pink-300 italic text-sm"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            タップして曲を選択... ✨
          </motion.span>
        )}
      </motion.div>

      {/* クリアボタン - ぷにっとエフェクト */}
      {item.song && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="text-pink-300 hover:text-pink-500 transition-colors p-1"
          aria-label="クリア"
          whileHover={{
            scale: 1.3,
            rotate: 90,
            transition: { type: "spring", stiffness: 400 },
          }}
          whileTap={{ scale: 0.8 }}
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  );
}
