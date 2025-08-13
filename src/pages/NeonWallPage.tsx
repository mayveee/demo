// src/pages/NeonWallPage.tsx
import "./NeonWallPage.css";

export default function NeonWallPage() {
  return (
    <div className="neon-wall">
      <div className="neon-vignette" />

      <p className="neon-kicker">INTRODUCING</p>

      <h1 className="neon-line">
        <span className="tube tube-pink">NEON</span>
      </h1>

      <h2 className="neon-fill">
        <span className="tube tube-cyan">GOODSHINE</span>
      </h2>

      <p className="neon-caption">NEON DISPLAY FONT</p>
    </div>
  );
}
