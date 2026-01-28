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
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        x: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={`rank-item ${getRankClass(item.rank)} ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      {/* 順位 */}
      <div className="rank-number">{getRankDisplay(item.rank)}</div>

      {/* 曲名 */}
      <div
        className="flex-1 min-w-0"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {item.song ? (
          <div className="truncate">
            <span className="text-gray-700 font-medium">{item.song.title}</span>
            <span className="text-pink-300 text-xs ml-2">
              {item.song.singleNumber}th
            </span>
          </div>
        ) : (
          <span className="text-pink-300 italic text-sm">
            タップして曲を選択...
          </span>
        )}
      </div>

      {/* クリアボタン */}
      {item.song && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="text-pink-300 hover:text-pink-500 transition-colors p-1"
          aria-label="クリア"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}
