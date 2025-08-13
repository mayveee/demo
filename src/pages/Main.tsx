// src/pages/Main.tsx
import HCardSliderTheme from "@/components/HCardSliderTheme";
import "@/styles/HCardSliderTheme.css";
import "@/styles/NeonCursor.css";

export default function Main() {
  return (
    <>
      <HCardSliderTheme routes={["/neonCursor", "/toolbar", "/circle", "/neonWall"]}>
        <div><h2>네온 커서</h2><p>와우</p></div>
        <div><h2>불꽃놀이</h2><p>수정중..</p></div>
        <div><h2>마음이 편안해지는 그래픽</h2><p>이건봐야해</p></div>
        <div><h2>네온사인</h2><p>칵테일을 부르는 그래픽</p></div>
        <div><h2>카드 1</h2><p>뭐하지</p></div>
        <div><h2>카드 2</h2><p>뭐하지</p></div>
        <div><h2>카드 3</h2><p>뭐하지</p></div>
        <div><h2>카드 4</h2><p>뭐하지</p></div>
    </HCardSliderTheme>
    </>
    
  );
}
