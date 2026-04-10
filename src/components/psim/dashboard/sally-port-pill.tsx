"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { usePsimStore } from "@/stores/psim-store";

export function SallyPortPill() {
  const count = usePsimStore((s) => s.sallyPortLanes.size);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center gap-space-1 bg-ica-blue/15 border border-ica-blue/30 px-space-3 py-space-1 rounded-full text-label text-ica-blue"
        >
          <Lock size={12} />
          <span className="font-semibold">{count}</span>
          <span>Sally Port{count > 1 ? "s" : ""}</span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}
