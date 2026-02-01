"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface XShareButtonProps {
  title?: string;
  rankingText?: string;
  onShare?: () => Promise<void>;
  isGeneratingImage?: boolean;
}

export default function XShareButton({
  title = "私的イコラブ楽曲ランキング",
  rankingText = "",
  onShare,
  isGeneratingImage = false,
}: XShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleClick = async () => {
    setIsSharing(true);

    try {
      if (onShare) {
        await onShare();
      } else {
        // デフォルト: テキストのみシェア
        const shareText = `🎵 ${title}\n\n${rankingText}\n\n#イコラブ #イコラブ楽曲ランキング`;
        const encodedText = encodeURIComponent(shareText);
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        
        // X公式と同じ: 中央に配置されたポップアップ
        const width = 550;
        const height = 420;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0`;
        
        window.open(shareUrl, "_blank", features);
      }
    } catch (error) {
      console.error("シェアエラー:", error);
      alert("シェアに失敗しました");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isSharing}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 20px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg, #1DA1F2 0%, #0d8ecf 100%)",
        color: "white",
        fontSize: "0.9rem",
        fontWeight: "bold",
        cursor: "pointer",
        width: "100%",
        boxShadow: "0 4px 15px rgba(29, 161, 242, 0.3)",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 6px 20px rgba(29, 161, 242, 0.4)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          fill="currentColor"
        />
      </svg>
      {isGeneratingImage ? "画像生成中..." : isSharing ? "準備中..." : "Xにシェア"}
    </motion.button>
  );
}
