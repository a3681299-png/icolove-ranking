"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Song, searchSongs, songs } from "@/data/songs";

interface SongSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (song: Song) => void;
}

export default function SongSearchModal({
  isOpen,
  onClose,
  onSelect,
}: SongSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 検索結果を計算
  const results = useMemo(() => {
    if (query.trim()) {
      return searchSongs(query);
    } else {
      return songs.slice(-10).reverse();
    }
  }, [query]);

  // モーダルが開いたらフォーカス
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // モーダルを閉じる時にリセット
  const handleClose = () => {
    setQuery("");
    onClose();
  };

  // 曲を選択
  const handleSelect = (song: Song) => {
    setQuery("");
    onSelect(song);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="p-4 border-b border-pink-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-pink-500 font-bold text-lg">🎵 曲を検索</h3>
                <button
                  onClick={handleClose}
                  className="text-pink-300 hover:text-pink-500 transition-colors"
                >
                  ✕
                </button>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="曲名を入力..."
                className="input-field"
              />
            </div>

            {/* 検索結果 */}
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                results.map((song) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="search-result-item"
                    onClick={() => handleSelect(song)}
                  >
                    <div className="font-medium text-gray-700">
                      {song.title}
                    </div>
                    <div className="text-xs text-pink-300 flex gap-2 mt-1">
                      <span>
                        {song.singleNumber}th「{song.singleTitle}」
                      </span>
                      <span
                        className={
                          song.type === "title"
                            ? "text-pink-500"
                            : "text-gray-400"
                        }
                      >
                        {song.type === "title" ? "表題曲" : "カップリング"}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-pink-300">
                  <p className="text-3xl mb-2">🔍</p>
                  <p>曲が見つかりません</p>
                </div>
              )}
            </div>

            {/* フッター */}
            <div className="p-3 border-t border-pink-100 bg-pink-50/50">
              <p className="text-xs text-pink-300 text-center">
                全{songs.length}曲から検索
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
