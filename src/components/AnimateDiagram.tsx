// src/components/diagram/AnimateDiagram.tsx
import { useEffect, useMemo, useState } from "react";

/** 간단한 className 조합 */
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** --- 고정 카드: 내용/데이터/색상 모두 내부에 하드코딩 --- */
export default function AnimateDiagram() {
  const title = "게임트릭스 PC방 게임 점유율";
  const description = "날짜: 2025-08-13";
  const gridColor = "#80808015";
  const trackColor = "rgba(0,0,0,0.15)";
  const radius = 40;

  // 이미지에 맞춘 고정 데이터
  const data = [
    { label: "리그 오브 레전드", value: 35.94, color: "#6366F1" },
    { label: "배틀그라운드", value: 9.41,  color: "#22C55E" },
    { label: "발로란트",     value: 8.16,  color: "#EF4444" },
    { label: "FC온라인",      value: 7.95,  color: "#06B6D4" },
    { label: "메이플스토리",   value: 7.47,  color: "#F59E0B" }, // hover 전 단독 노출
    { label: "서든어택",      value: 5.22,  color: "#A855F7" },
  ];

  const highlightLabel = "메이플스토리";

  const [hovered, setHovered] = useState(false);

  // 안전한 cleanup
  useEffect(() => {
    let t: number | undefined;
    if (hovered) t = window.setTimeout(() => {}, 0);
    return () => {
      if (t !== undefined) window.clearTimeout(t);
    };
  }, [hovered]);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), []);
  const circumference = useMemo(() => 2 * Math.PI * radius, []);

  const segments = useMemo(() => {
    let acc = 0;
    return data.map((d) => {
      const len = (d.value / total) * circumference;
      const start = acc;
      acc += len;
      return {
        ...d,
        length: len,
        offset: circumference - start,
      };
    });
  }, [circumference, total, data]);

  const highlight = useMemo(
    () => data.find((d) => d.label === highlightLabel)!,
    []
  );

  const centerText = hovered
    ? `100%`
    : `${highlight.value.toFixed(2)}%`;

  const chipLayout = [
    { x: 110, y: 46 },
    { x: 110, y: -46 },
    { x: 140, y: 0 },
    { x: -140, y: 0 },
    { x: -110, y: 46 },
    { x: -110, y: -46 },
  ];

  return (
    <div className={cx(
        "group/animated-card relative w-[356px] overflow-hidden rounded-xl",
        "border border-white/20 bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
        " dark:border-white/15 dark:bg-white/5"
    )}>
      {/* Hover capture + CSS 변수 */}
      <div
        className="absolute inset-0 z-20"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ ["--grid-color" as any]: gridColor }}
      />

      {/* 상단 비주얼 */}
      <div className="relative h-[180px] w-[356px] overflow-hidden rounded-t-lg">
        {/* 도넛 */}
        <div className="absolute top-0 left-0 z-[7] flex h-[360px] w-[356px] -translate-y-[10px] items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:-translate-y-[80px] group-hover/animated-card:scale-110">
          <div className="relative flex h-[120px] w-[120px] items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} stroke={trackColor} strokeWidth="12" fill="transparent" />
              {(hovered ? segments : segments.filter((s) => s.label === highlightLabel)).map((s, i) => (
                <circle
                  key={`${s.label}-${i}`}
                  cx="50" cy="50" r={radius}
                  stroke={s.color} strokeWidth="12" fill="transparent"
                  strokeDasharray={`${s.length} ${circumference - s.length}`}
                  strokeDashoffset={s.offset}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.6s ease, opacity 0.3s ease" }}
                />
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="px-2 text-center text-[15px] font-semibold text-black dark:text-white">
                {centerText}
              </span>
            </div>
          </div>
        </div>

        {/* 상단 정보 배너 (hover 시 슬라이드 아웃) */}
        <div className="absolute inset-0 z-[6] flex w-[356px] translate-y-[55px] items-start justify-center bg-transparent p-4 transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:translate-y-full">
            <div className="rounded-full border border-zinc-200 bg-white/70 px-2.5 py-1 opacity-100 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:opacity-0 dark:border-zinc-800 dark:bg-black/50">
                <div className="flex items-center gap-1.5">
                {/* 점 */}
                <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: highlight.color, transform: "translateY(0.5px)" }}
                />
                {/* 텍스트 */}
                <span className="text-[12px] leading-[12px] text-black dark:text-white">
                    메이플스토리
                </span>
                </div>
            </div>
        </div>
        
        {/* hover 시 나타나는 칩(게임명) */}
        <div className="absolute inset-0 z-[7] flex items-center justify-center opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] group-hover/animated-card:opacity-100">
          {data.slice(0, 6).map((item, idx) => {
            const pos = chipLayout[idx] ?? { x: 0, y: 0 };
            return (
              <div
                key={item.label}
                className="absolute flex items-center justify-center gap-1 rounded-full border border-zinc-200 bg-white/80 px-1.5 py-0.5 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.6,0.6,0,1)] dark:border-zinc-800 dark:bg-black/70"
                style={{ transform: hovered ? `translate(${pos.x}px, ${pos.y}px)` : "translate(0px, 0px)" }}
              >
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="ml-1 text-[10px] text-black dark:text-white">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* 배경 그리드 */}
        <div
          className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
        />
      </div>

      {/* 하단 정보 (양식 유지) */}
      <div className="flex flex-col space-y-1.5 border-t border-white/20 p-4 dark:border-white/15">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-black dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      </div>
    </div>
  );
}
