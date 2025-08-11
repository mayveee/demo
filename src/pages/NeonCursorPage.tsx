// [src/pages/NeonCursorPage.tsx]
import { useEffect } from "react";
import { neonCursor } from "threejs-toys";
import "@/styles/neonCursor.css";

export default function NeonCursorPage() {
  useEffect(() => {
    // 1) 개발모드(StrictMode) 중복 대비: 기존 캔버스 싹 제거
    document
      .querySelectorAll<HTMLCanvasElement>('canvas[data-engine],canvas[data-neon-cursor]')
      .forEach((c) => c.remove());

    try {
      // 2) body 기준으로 확실하게 붙임
      neonCursor({
        el: document.body,
        shaderPoints: 16,
        curvePoints: 80,
        curveLerp: 0.5,
        radius1: 5,
        radius2: 30,
        velocityTreshold: 1,
        sleepRadiusX: 120,
        sleepRadiusY: 120,
        sleepTimeCoefX: 0.002,
        sleepTimeCoefY: 0.002,
      });
    } catch (e) {
      console.error("neonCursor init failed:", e);
    }

    // 3) 언마운트 시 정리
    return () => {
      document
        .querySelectorAll<HTMLCanvasElement>('canvas[data-engine],canvas[data-neon-cursor]')
        .forEach((c) => c.remove());
    };
  }, []);

  return (
    <div className="page">
      <h1>NEON CURSOR</h1>
      <p>마우스를 움직이면 배경 네온이 반응합니다.</p>
    </div>
  );
}
