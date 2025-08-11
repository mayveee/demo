// [src/routes/index.tsx] 또는 App.tsx 내부 라우팅 부분
import { Routes, Route } from "react-router-dom";
import Main from "@/pages/Main";
import NeonCursorPage from "@/pages/NeonCursorPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/neonCursor" element={<NeonCursorPage />} />
    </Routes>
  );
}
