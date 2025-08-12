// [src/routes/index.tsx] 또는 App.tsx 내부 라우팅 부분
import { Routes, Route } from "react-router-dom";
import Main from "@/pages/Main";
import NeonCursorPage from "@/pages/NeonCursorPage";
import FireworksPage from "@/pages/FireworksPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/neonCursor" element={<NeonCursorPage />} />
      <Route path="/fireworks" element={<FireworksPage />} />
    </Routes>
  );
}
