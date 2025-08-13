// src/components/toolbar.tsx
// (기존 파일 수정) — 여러 개를 페이지에 띄우기 위한 props 추가: initial 위치, zIndex, 드래그 경계, 포커스
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  Bold, Italic, Link, Heading, Quote, Highlighter,
  AlignLeft, AlignCenter, AlignRight, Palette, Underline,
  Strikethrough, GripVertical,
} from "lucide-react";
import { type RefObject, useState } from "react";

type ToolbarProps = {
  id?: string;
  initial: { x: number; y: number }; // 필수: 시작 위치
  zIndex?: number;                   // 선택: z-스택
  constraintsRef?: RefObject<HTMLElement | null>; // 선택: 드래그 경계
  onFocus?: (id?: string) => void;   // 선택: 포커스(맨 앞으로)
};

const ToolbarButton = ({
  label, icon: Icon, isActive, onClick, tooltip, setTooltip,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
  tooltip: string | null;
  setTooltip: (t: string | null) => void;
}) => (
  <div
    className="relative"
    onMouseEnter={() => setTooltip(label)}
    onMouseLeave={() => setTooltip(null)}
  >
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`h-8 w-8 inline-flex items-center justify-center rounded-md transition-colors ${
        isActive ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200" : "text-gray-700"
      } hover:bg-gray-100 focus:outline-none`}
    >
      <Icon className="h-4 w-4" />
    </button>

    <AnimatePresence>
      {tooltip === label && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2
                     rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow"
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Toolbar = ({ id, initial, zIndex = 1, constraintsRef, onFocus }: ToolbarProps) => {
  const dragControls = useDragControls();

  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [active, setActive] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const toggle = (k: string) =>
    setActive((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <motion.div
      // 부모는 페이지에서 relative 컨테이너로 감싸짐 (ToolbarPage 참고)
      className="absolute z-[1] flex items-center gap-1 rounded-xl border border-gray-200
                 bg-white/80 p-2 backdrop-blur shadow-xl"
      style={{ zIndex }}
      drag
      dragListener={false}
      dragControls={dragControls}
      // Toolbar.tsx
      dragConstraints={constraintsRef} // ref.current를 직접 넘기기

      dragElastic={0.06}
      dragMomentum={false}
      initial={{ x: initial.x, y: initial.y, opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      onPointerDown={() => onFocus?.(id)}
    >
      {/* 드래그 핸들 */}
      <button
        type="button"
        aria-label="Drag"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.((e as any).pointerId);
          dragControls.start(e);
        }}
        className="h-8 w-8 inline-flex select-none items-center justify-center rounded-md
                   text-gray-500 hover:bg-gray-100 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="mx-1 h-8 w-px bg-gray-200" />

      {/* Formatting */}
      <ToolbarButton label="Bold" icon={Bold}
        isActive={active.includes("bold")} onClick={() => toggle("bold")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Italic" icon={Italic}
        isActive={active.includes("italic")} onClick={() => toggle("italic")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Underline" icon={Underline}
        isActive={active.includes("underline")} onClick={() => toggle("underline")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Strikethrough" icon={Strikethrough}
        isActive={active.includes("strikethrough")} onClick={() => toggle("strikethrough")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Link" icon={Link}
        isActive={active.includes("link")} onClick={() => toggle("link")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Heading" icon={Heading}
        isActive={active.includes("heading")} onClick={() => toggle("heading")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Quote" icon={Quote}
        isActive={active.includes("quote")} onClick={() => toggle("quote")}
        tooltip={tooltip} setTooltip={setTooltip} />

      <div className="mx-1 h-8 w-px bg-gray-200" />

      {/* Highlight / Color */}
      <ToolbarButton label="Highlight" icon={Highlighter}
        isActive={active.includes("highlight")} onClick={() => toggle("highlight")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Change Color" icon={Palette}
        isActive={active.includes("color")} onClick={() => toggle("color")}
        tooltip={tooltip} setTooltip={setTooltip} />

      <div className="mx-1 h-8 w-px bg-gray-200" />

      {/* Align */}
      <ToolbarButton label="Align Left" icon={AlignLeft}
        isActive={textAlign === "left"} onClick={() => setTextAlign("left")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Align Center" icon={AlignCenter}
        isActive={textAlign === "center"} onClick={() => setTextAlign("center")}
        tooltip={tooltip} setTooltip={setTooltip} />
      <ToolbarButton label="Align Right" icon={AlignRight}
        isActive={textAlign === "right"} onClick={() => setTextAlign("right")}
        tooltip={tooltip} setTooltip={setTooltip} />
    </motion.div>
  );
};

export { Toolbar };
