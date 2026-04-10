"use client";

import { motion } from "framer-motion";

interface Props {
  laneNumber: number;
}

/**
 * SallyPortOverlay — renders a dashed blue box over the trap zone
 * of a lane when sally port is active.
 *
 * Positioned absolutely within the lane's road strip (the caller
 * must provide a position: relative parent). The box spans horizontally
 * from just after position 1 to just before position 3 (the middle
 * zone containing the rising step).
 */
export function SallyPortOverlay({ laneNumber }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute left-[28%] right-[28%] -top-1 -bottom-1 border-2 border-dashed border-ica-blue bg-ica-blue/10 rounded-sm pointer-events-none z-20"
    >
      <motion.div
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -4, opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="absolute -top-5 left-1/2 -translate-x-1/2 bg-ica-blue text-white font-mono font-bold tracking-widest text-[9px] px-space-2 py-0.5 rounded-full whitespace-nowrap shadow-md"
      >
        SALLY PORT · LN {String(laneNumber).padStart(2, "0")}
      </motion.div>
    </motion.div>
  );
}
