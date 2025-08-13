// src/pages/ToolbarPage.tsx
import { useRef, useState } from "react";
import { Toolbar } from "@/components/toolbar";
import DraggableGlassCard from "@/components/wrapper/GlassCardWrapper";
import { OSMenuWrapper } from "@/components/wrapper/OSMenuWrapper";
import DestinationCardWrapper from "@/components/wrapper/DestinationCardWrapper";

export default function ToolbarPage() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>("");

  return (
    <div
      ref={canvasRef}
      className="relative min-h-screen w-full bg-gray-100 bg-[length:32px_32px] bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)]"
    >
      <Toolbar
        id="toolbar1"
        initial={{ x: 100, y: 100 }}
        constraintsRef={canvasRef}
        zIndex={activeId === "toolbar1" ? 200 : 10}
        onFocus={(id) => setActiveId(id!)}
      />

      <DraggableGlassCard
        id="glass1"
        initial={{ x: 400, y: 200 }}
        constraintsRef={canvasRef}
        zIndex={activeId === "glass1" ? 200 : 10}
        onFocus={(id) => setActiveId(id!)}
      />

      <OSMenuWrapper
        id="dock1"
        initial={{ x: 300, y: 500 }}
        constraintsRef={canvasRef}
        zIndex={activeId === "dock1" ? 200 : 10}
        onFocus={(id) => setActiveId(id!)}
      />

      <DestinationCardWrapper
        imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        category="Europe"
        title="Paris Getaway"
      />
    </div>
  );
}
