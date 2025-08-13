// src/pages/CirclePage.tsx
import type { CSSProperties } from "react";
import "./CirclePage.css";

type VarStyle = CSSProperties & { ["--i"]?: number };

export default function CirclePage() {
  return (
    <div className="circle-page">
      <div className="container">
        {Array.from({ length: 21 }, (_, i) => (
          <div key={i} className="circle" style={{ ["--i"]: i } as VarStyle} />
        ))}
      </div>
    </div>
  );
}
