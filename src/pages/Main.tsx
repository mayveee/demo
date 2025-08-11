// src/pages/Main.tsx
import HCardSliderTheme from "@/components/HCardSliderTheme";
import "@/styles/HCardSliderTheme.css";
import "@/styles/neonCursor.css";

export default function Main() {
  return (
    <>
      <HCardSliderTheme routes={["/neonCursor"]}>
        <div><h2>네온 커서</h2><p>와우</p></div>
        <div><h2>불꽃 놀이</h2><p>어메이징</p></div>
        <div><h2>카드 3</h2><p>부드럽게 이어지는 패럴랙스 착시</p></div>
        <div><h2>카드 4</h2><p>이미지 자체는 고정, 포지션만 변경</p></div>
    </HCardSliderTheme>
    </>
    
  );
}
