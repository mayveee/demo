// src/hooks/useCardSlider.ts
import { useRef } from "react";

export function useCardSlider<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  const scrollToCard = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".hscrub-card");
    if (!card) return;

    const cardWidth = card.offsetWidth + 24; // gap 포함
    const target = dir === "next"
      ? el.scrollLeft + cardWidth
      : el.scrollLeft - cardWidth;

    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return { ref, scrollToCard };
}
