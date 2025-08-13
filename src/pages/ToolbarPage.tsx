// src/pages/ToolbarPage.tsx
// 페이지에 여러 개 Toolbar 인스턴스를 띄우는 “세팅용” 예시
import { useRef, useState } from "react";
import { Toolbar } from "@/components/toolbar";

type Item = { id: string; x: number; y: number };

export default function ToolbarPage() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<Item[]>([
    { id: "t1", x: 80, y: 100 },
    { id: "t2", x: 360, y: 180 },
    { id: "t3", x: 180, y: 320 },
  ]);
  const [activeId, setActiveId] = useState<string>("t3");

  return (
    <div
      ref={canvasRef}
      className="relative min-h-screen w-full bg-[length:16px_16px] bg-[linear-gradient(to_right,rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.05)_1px,transparent_1px)]"
    >
      {items.map((it, idx) => (
        <Toolbar
          key={it.id}
          id={it.id}
          initial={{ x: it.x, y: it.y }}
          constraintsRef={canvasRef}
          zIndex={activeId === it.id ? 100 + idx : 10 + idx}
          onFocus={(id) => setActiveId(id!)}
        />
      ))}
    </div>
  );
}
