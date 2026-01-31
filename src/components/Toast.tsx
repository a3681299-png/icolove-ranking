"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "50px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            zIndex: 9999,
            whiteSpace: "nowrap",
          }}
          onClick={onClose}
        >
          <span>✨</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
