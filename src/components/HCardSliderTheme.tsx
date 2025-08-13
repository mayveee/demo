// src/components/HCardSliderTheme.tsx

import type { PropsWithChildren } from "react";
import { Children, useEffect, useRef, useState } from "react";
import "../styles/HCardSliderTheme.css";
import LeftIcon from "@/assets/icons/left_metal_no_stroke.svg";
import RightIcon from "@/assets/icons/right_metal_no_stroke.svg";
import { useNavigate } from "react-router-dom";


type Props = PropsWithChildren<{
  /** 각 카드가 이동할 경로. ex) ["/play", "/about", ...] */
  routes?: string[];
  /** 라우팅 대신 직접 처리하고 싶을 때 (i: 카드 인덱스) */
  onCardClick?: (i: number) => void;
}>;

/** 단일 420vw 그라데이션을 background-position X로만 이동 */
export default function HCardSliderTheme({ children, routes, onCardClick }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const stepRef = useRef(0);

  const navigate = useNavigate();

  // shine 애니메이션 캐시 (카드별)
  const animMap = useRef<WeakMap<HTMLElement, Animation>>(new WeakMap());

  const measureStep = () => {
    const el = trackRef.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>(".hslider-card");
    if (cards.length >= 2) {
      // 카드 사이 레이아웃상 실제 거리(패딩/갭 포함, transform 제외)
      stepRef.current = cards[1].offsetLeft - cards[0].offsetLeft;
    } else if (cards.length === 1) {
      // 백업 계산 (transform 제외)
      const style = getComputedStyle(el);
      const gapPx =
        parseFloat(style.columnGap || style.gap || "0") || 0;
      stepRef.current = cards[0].offsetWidth + gapPx;
    }
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
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

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
    const totalShiftVw = 720; // 이동 가능한 총 폭
    const x = -progress * totalShiftVw; // 0 → -320vw
    bg.style.setProperty("--shiftX", `${x}vw`);
  }, [progress]);

  const getCards = () =>
    Array.from(trackRef.current?.querySelectorAll<HTMLElement>(".hslider-card") ?? []);

  const getCenteredIndex = () => {
    const el = trackRef.current!;
    const center = el.scrollLeft + el.clientWidth / 2;
    const cards = getCards();
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const cx = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cx - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  };

  const scrollToIndex = (i: number) => {
    const cards = getCards();
    if (!cards.length) return;
    const idx = Math.max(0, Math.min(cards.length - 1, i));
    cards[idx].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const scrollByOneCard = (dir: "prev"|"next") => {
    const cur = getCenteredIndex();
    scrollToIndex(cur + (dir === "next" ? 1 : -1));
  };

  const handleCardActivate = (i: number) => {
    if (onCardClick) return onCardClick(i);
    const to = routes?.[i];
    if (to) navigate(to);
  };


  // === shine WAAPI ===
  const handleEnter: React.MouseEventHandler<HTMLElement> = (e) => {
    const card = e.currentTarget as HTMLElement;
    const shine = card.querySelector<HTMLElement>(".shine");
    if (!shine) return;

    let anim = animMap.current.get(shine);
    if (!anim) {
      anim = shine.animate(
        [
          { transform: "translateX(-140%) skewX(-25deg)" },
          { transform: "translateX(140%) skewX(-25deg)" },
        ],
        { duration: 1000, easing: "ease-in-out", fill: "forwards" }
      );
      anim.pause(); // 생성 직후 일시정지하여 제어 일관성
      animMap.current.set(shine, anim);
    }
    anim.playbackRate = 1;
    anim.play();
  };

  const handleLeave: React.MouseEventHandler<HTMLElement> = (e) => {
    const card = e.currentTarget as HTMLElement;
    const shine = card.querySelector<HTMLElement>(".shine");
    if (!shine) return;

    const anim = animMap.current.get(shine);
    if (!anim) return;

    anim.playbackRate = -2;
    // 현재 진행 지점부터 자연스럽게 역재생
    anim.play();
  };

  return (
    <div className="hslider-root">
      <div className="hslider-bg" ref={bgRef} aria-hidden />

      <button
        className="hslider-icon-btn left"
        onClick={() => scrollByOneCard("prev")}
        aria-label="이전"
      >
        <img src={LeftIcon} alt="이전" />
      </button>

      <div className="hslider-track" ref={trackRef}>
        {Children.map(children, (child, i) => (
          <section
            className="hslider-card"
            data-index={i}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            role="button"
            tabIndex={0}
            onClick={() => handleCardActivate(i)}
          >
            <span className="shine" aria-hidden />
            {child}
          </section>
        ))}
      </div>

      <button
        className="hslider-icon-btn right"
        onClick={() => scrollByOneCard("next")}
        aria-label="다음"
      >
        <img src={RightIcon} alt="다음" />
      </button>
    </div>
  );
}
