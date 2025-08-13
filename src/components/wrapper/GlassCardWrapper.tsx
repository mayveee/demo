// src/components/DraggableGlassCard.tsx
import { motion, useDragControls } from "framer-motion";
import GlassCard from "../GlassCard";
import type { RefObject } from "react";

interface DraggableGlassCardProps {
  id: string;
  initial: { x: number; y: number };
  constraintsRef?: RefObject<HTMLElement | null>;
  zIndex?: number;
  onFocus?: (id: string) => void;
}

export default function DraggableGlassCard({
  id,
  initial,
  constraintsRef,
  zIndex = 1,
  onFocus,
}: DraggableGlassCardProps) {
  const dragControls = useDragControls();

  return (
    <motion.div
      className="absolute"
      style={{ zIndex }}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={constraintsRef as any}
      dragElastic={0.06}
      dragMomentum={false}
      initial={{ x: initial.x, y: initial.y, opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      onPointerDown={() => onFocus?.(id)}
    >
      {/* 드래그 핸들 */}
      <div
        className="absolute left-2 top-2 z-50 h-6 w-6 cursor-grab active:cursor-grabbing bg-black/30 text-white flex items-center justify-center rounded"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.((e as any).pointerId);
          dragControls.start(e);
        }}
      >
        ☰
      </div>
      <GlassCard />
    </motion.div>
  );
}
