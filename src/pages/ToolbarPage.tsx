// src/pages/ToolbarPage.tsx
import { useRef, useState } from "react";
import { Toolbar } from "@/components/toolbar";
import DraggableGlassCard from "@/components/wrapper/GlassCardWrapper";
import { OSMenuWrapper } from "@/components/wrapper/OSMenuWrapper";
import DestinationCardWrapper from "@/components/wrapper/DestinationCardWrapper";
import AnimateDiagramWrapper from "@/components/wrapper/AnimateDiagramWrapper";

export default function ToolbarPage() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>("");

  return (
    <div
      ref={canvasRef}
      className="relative min-h-screen w-full"
      style={{
        backgroundColor: "rgba(249, 250, 251, 0.8)",
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }}
    >
      <Toolbar
        id="toolbar1"
        initial={{ x: 50, y: 600 }}
        constraintsRef={canvasRef}
        zIndex={activeId === "toolbar1" ? 200 : 10}
        onFocus={(id) => setActiveId(id!)}
      />

      <DraggableGlassCard
        id="glass1"
        initial={{ x: 400, y: 50 }}
        constraintsRef={canvasRef}
        zIndex={activeId === "glass1" ? 200 : 10}
        onFocus={(id) => setActiveId(id!)}
      />

      <OSMenuWrapper
        id="dock1"
        initial={{ x: 50, y: 500 }}
        constraintsRef={canvasRef}
        zIndex={activeId === "dock1" ? 200 : 10}
        onFocus={(id) => setActiveId(id!)}
      />

      <DestinationCardWrapper
        imageUrl="https://images.unsplash.com/photo-1566865204669-c7b93be298bd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        category="Europe"
        title="Paris Getaway"
      />

      <AnimateDiagramWrapper
        id="diagram1"
        initial={{ x: 730, y: -380 }}        
        constraintsRef={canvasRef}           
        zIndex={activeId === "diagram1" ? 200 : 10}
        onFocus={(id) => setActiveId(id!)}  
      />
    </div>
  );
}
