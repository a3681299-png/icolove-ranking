"use client";

import { motion } from "framer-motion";

const decorations = [
  {
    emoji: "🎀",
    className: "top-4 left-5 text-3xl",
    rotate: -15,
    animation: "none",
  },
  {
    emoji: "🎀",
    className: "top-4 right-5 text-3xl",
    rotate: 15,
    animation: "none",
  },
  {
    emoji: "💗",
    className: "top-20 right-4 text-xl",
    rotate: 0,
    animation: "float",
  },
  {
    emoji: "💕",
    className: "bottom-40 left-3 text-xl",
    rotate: 0,
    animation: "float",
  },
  {
    emoji: "🩷",
    className: "top-48 left-4 text-xl",
    rotate: 0,
    animation: "float",
  },
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
    animation: "twinkle",
  },
  {
    emoji: "🌟",
    className: "bottom-24 right-4 text-lg",
    rotate: 0,
    animation: "twinkle",
  },
  {
    emoji: "🐰",
    className: "bottom-32 left-4 text-2xl",
    rotate: 0,
    animation: "none",
  },
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
  {
    emoji: "🌸",
    className: "top-16 left-12 text-lg",
    rotate: 0,
    animation: "none",
  },
  {
    emoji: "💮",
    className: "bottom-16 right-12 text-lg",
    rotate: 0,
    animation: "none",
  },
  {
    emoji: "🍭",
    className: "bottom-8 left-10 text-lg",
    rotate: 0,
    animation: "none",
  },
];

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const twinkleAnimation = {
  scale: [1, 1.2, 1],
  opacity: [0.8, 1, 0.8],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const bounceAnimation = {
  y: [0, -5, 0],
  rotate: [0, 10, 0],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function Decorations() {
  return (
    <>
      {decorations.map((deco, index) => {
        const getAnimation = () => {
          switch (deco.animation) {
            case "float":
              return floatAnimation;
            case "twinkle":
              return twinkleAnimation;
            case "bounce":
              return bounceAnimation;
            default:
              return {};
          }
        };

        return (
          <motion.div
            key={index}
            className={`absolute pointer-events-none opacity-80 ${deco.className}`}
            style={{ transform: `rotate(${deco.rotate}deg)` }}
            animate={getAnimation()}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            transition={{ delay: index * 0.05 }}
          >
            {deco.emoji}
          </motion.div>
        );
      })}
    </>
  );
}
