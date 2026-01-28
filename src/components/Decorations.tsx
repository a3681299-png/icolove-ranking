"use client";

import { motion } from "framer-motion";

const decorations = [
  // リボン - ふわふわ揺れる
  {
    emoji: "🎀",
    className: "top-4 left-5 text-3xl",
    rotate: -15,
    animation: "sway",
  },
  {
    emoji: "🎀",
    className: "top-4 right-5 text-3xl",
    rotate: 15,
    animation: "sway",
  },
  // ハート - ぷにぷに鼓動
  {
    emoji: "💗",
    className: "top-20 right-4 text-xl",
    rotate: 0,
    animation: "heartbeat",
  },
  {
    emoji: "💕",
    className: "bottom-40 left-3 text-xl",
    rotate: 0,
    animation: "heartbeat",
  },
  {
    emoji: "🩷",
    className: "top-48 left-4 text-xl",
    rotate: 0,
    animation: "float",
  },
  // 星 - キラキラ
  {
    emoji: "⭐",
    className: "top-32 left-6 text-lg",
    rotate: 0,
    animation: "twinkle",
  },
  {
    emoji: "✨",
    className: "bottom-60 right-5 text-lg",
    rotate: 0,
    animation: "sparkle",
  },
  {
    emoji: "🌟",
    className: "bottom-24 right-4 text-lg",
    rotate: 0,
    animation: "twinkle",
  },
  // うさぎ - ぴょんぴょん
  {
    emoji: "🐰",
    className: "bottom-32 left-4 text-2xl",
    rotate: 0,
    animation: "hop",
  },
  // 音符 - ふわふわバウンス
  {
    emoji: "🎵",
    className: "top-40 right-3 text-lg",
    rotate: 0,
    animation: "bounce",
  },
  {
    emoji: "🎶",
    className: "bottom-52 left-5 text-lg",
    rotate: 0,
    animation: "bounce",
  },
  // 花 - ゆっくり回転
  {
    emoji: "🌸",
    className: "top-16 left-12 text-lg",
    rotate: 0,
    animation: "spin",
  },
  {
    emoji: "💮",
    className: "bottom-16 right-12 text-lg",
    rotate: 0,
    animation: "float",
  },
  // キャンディ - ぷるぷる
  {
    emoji: "🍭",
    className: "bottom-8 left-10 text-lg",
    rotate: 0,
    animation: "jelly",
  },
  // 追加の装飾
  {
    emoji: "🦋",
    className: "top-60 right-8 text-lg",
    rotate: 0,
    animation: "flutter",
  },
  {
    emoji: "💖",
    className: "bottom-48 right-6 text-xl",
    rotate: 0,
    animation: "heartbeat",
  },
];

// ふわふわ浮遊
const floatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ゆらゆら揺れる（リボン用）
const swayAnimation = {
  rotate: [-5, 5, -5],
  y: [0, -3, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// キラキラ
const twinkleAnimation = {
  scale: [1, 1.3, 1],
  opacity: [0.7, 1, 0.7],
  rotate: [0, 10, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// スパークル（より激しいキラキラ）
const sparkleAnimation = {
  scale: [0.8, 1.4, 0.8],
  opacity: [0.5, 1, 0.5],
  rotate: [0, 180, 360],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ぷにぷにバウンス
const bounceAnimation = {
  y: [0, -12, 0],
  scaleY: [1, 0.9, 1.1, 1],
  scaleX: [1, 1.1, 0.9, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ハートビート（鼓動）
const heartbeatAnimation = {
  scale: [1, 1.2, 1, 1.15, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ぴょんぴょん（うさぎ用）
const hopAnimation = {
  y: [0, -20, 0],
  scaleY: [1, 1.1, 0.9, 1],
  transition: {
    duration: 1.8,
    repeat: Infinity,
    ease: "easeOut",
    times: [0, 0.4, 0.8, 1],
  },
};

// ゆっくり回転
const spinAnimation = {
  rotate: [0, 360],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  },
};

// ぷるぷる（ゼリーのような）
const jellyAnimation = {
  scaleX: [1, 1.15, 0.9, 1.05, 1],
  scaleY: [1, 0.9, 1.15, 0.95, 1],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ひらひら（蝶々用）
const flutterAnimation = {
  x: [0, 10, -10, 0],
  y: [0, -15, -5, 0],
  rotate: [-10, 10, -10],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function Decorations() {
  const getAnimation = (animationType: string) => {
    switch (animationType) {
      case "float":
        return floatAnimation;
      case "sway":
        return swayAnimation;
      case "twinkle":
        return twinkleAnimation;
      case "sparkle":
        return sparkleAnimation;
      case "bounce":
        return bounceAnimation;
      case "heartbeat":
        return heartbeatAnimation;
      case "hop":
        return hopAnimation;
      case "spin":
        return spinAnimation;
      case "jelly":
        return jellyAnimation;
      case "flutter":
        return flutterAnimation;
      default:
        return {};
    }
  };

  return (
    <>
      {decorations.map((deco, index) => (
        <motion.div
          key={index}
          className={`absolute pointer-events-none ${deco.className}`}
          style={{
            transform: `rotate(${deco.rotate}deg)`,
            filter: "drop-shadow(0 2px 4px rgba(255, 105, 180, 0.3))",
          }}
          animate={getAnimation(deco.animation)}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.9, scale: 1 }}
          transition={{
            delay: index * 0.08,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          {deco.emoji}
        </motion.div>
      ))}
    </>
  );
}
