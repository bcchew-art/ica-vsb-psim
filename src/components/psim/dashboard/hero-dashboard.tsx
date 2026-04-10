"use client";

import { motion } from "framer-motion";
import { TopStrip } from "./top-strip";
import { EquipmentList } from "./equipment-list";
import { CheckpointMap } from "./checkpoint-map";
import { RightPanel } from "./right-panel";

export function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full flex flex-col -m-space-5"
    >
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <TopStrip />
      </motion.div>
      <div className="flex-1 grid grid-cols-[220px_1fr_300px] overflow-hidden">
        <EquipmentList />
        <CheckpointMap />
        <RightPanel />
      </div>
    </motion.div>
  );
}
