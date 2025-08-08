import type { PropsWithChildren } from "react";
import { Children, useEffect, useRef, useState } from "react";
import "../styles/pastel-gradient.css";
import LeftIcon from "@/assets/icons/left_metal_no_stroke.svg";
import RightIcon from "@/assets/icons/right_metal_no_stroke.svg";


/** 단일 420vw 그라데이션을 background-position X로만 이동 */
export default function HCardSliderTheme({ children }: PropsWithChildren) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const bgRef    = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const stepRef = useRef(0);

  const measureStep = () => {
    const el = trackRef.current;
    if (!el) return;

    const first = el.querySelector<HTMLElement>(".hslider-card");
    if (!first) return;

    const style = getComputedStyle(el);
    // flex gap은 column-gap로 읽는 게 안전 (gap이 'row col' 형태일 수도 있음)
    const gapPx = parseFloat(style.columnGap || style.gap || "0") || 0;
    const cardW = first.getBoundingClientRect().width;

    stepRef.current = cardW + gapPx;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    
    measureStep();

    let raf = 0;
    const compute = () => {
      const max = Math.max(1, el.scrollWidth - el.clientWidth);
      const p = Math.min(1, Math.max(0, el.scrollLeft / max));
      setProgress(p);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };

    compute();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 진행도 → background-position X (vw 단위)
  // 420vw 캔버스에서 뷰포트는 100vw → 총 이동폭 = 420 - 100 = 320vw
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const totalShiftVw = 320;           // 이동 가능한 총 폭
    const x = -progress * totalShiftVw; // 0 → -320vw
    bg.style.setProperty("--shiftX", `${x}vw`);
  }, [progress]);

  const scrollByOneCard = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;

    if (!stepRef.current) measureStep();

    const delta = dir === "next" ? stepRef.current : -stepRef.current;
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  };

  return (
    <div className="hslider-root">
      <div className="hslider-bg" ref={bgRef} aria-hidden />

      <button className="hslider-icon-btn left" onClick={() => scrollByOneCard("prev")} aria-label="이전">
        <img src={LeftIcon} alt="이전" />
      </button>

      <div className="hslider-track" ref={trackRef}>
        {Children.map(children, (child, i) => (
          <section className="hslider-card" data-index={i}>
            {child}
          </section>
        ))}
      </div>

      <button className="hslider-icon-btn right" onClick={() => scrollByOneCard("next")} aria-label="다음">
        <img src={RightIcon} alt="다음" />
      </button>
    </div>
  );
}
