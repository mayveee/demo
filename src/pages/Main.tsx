// src/pages/Main.tsx
import HCardSliderTheme from "@/components/HCardSliderTheme";
import "@/styles/HCardSliderTheme.css";

export default function Main() {
  return (
    <HCardSliderTheme>
      <div><h2>카드 1</h2><p>배경이 살짝 오른쪽으로 이동</p></div>
      <div><h2>카드 2</h2><p>아주 미묘하게 아래쪽으로</p></div>
      <div><h2>카드 3</h2><p>부드럽게 이어지는 패럴랙스 착시</p></div>
      <div><h2>카드 4</h2><p>이미지 자체는 고정, 포지션만 변경</p></div>
    </HCardSliderTheme>
  );
}
