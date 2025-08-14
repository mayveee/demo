// src/components/wrapper/AnimateDiagramWrapper.tsx
import { useEffect, useRef, type RefObject } from "react";
import { motion } from "framer-motion";
import AnimateDiagram from "@/components/AnimateDiagram";

type Point = { x: number; y: number };

type Props = {
  id: string;
  initial: Point;
  constraintsRef: RefObject<HTMLDivElement | null>;
  zIndex?: number;
  onFocus?: (id?: string) => void;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function AnimateDiagramWrapper({
  id,
  initial,
  constraintsRef,
  zIndex = 10,
  onFocus,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleActivate = () => onFocus?.(id);

  // 드래그 중 텍스트 선택 방지
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onDown = () => { document.body.style.userSelect = "none"; };
    const onUp = () => { document.body.style.userSelect = ""; };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
    };
  }, []);

  return (
    <motion.div
      ref={rootRef}
      style={{ zIndex }}
      initial={{ x: initial.x, y: initial.y }}
      animate={{ x: initial.x, y: initial.y }}
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.08}
      whileDrag={{ scale: 1.02 }}
      className={cx("absolute touch-none select-none", className)}
      onMouseDown={handleActivate}
      onFocus={handleActivate}
    >
      <AnimateDiagram />
    </motion.div>
  );
}
