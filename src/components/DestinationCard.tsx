// src/components/DestinationCard.tsx
import { Heart } from "lucide-react";
import { useState } from "react";

interface DestinationCardProps {
  imageUrl: string;
  category: string;
  title: string;
}

export default function DestinationCard({
  imageUrl,
  category,
  title,
}: DestinationCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg border w-full h-full">
      {/* 배경 이미지 */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = `https://placehold.co/600x800/2d3748/ffffff?text=Image+Not+Found`;
        }}
      />

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* 좋아요 버튼 */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setLiked((prev) => !prev);
        }}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30 transition"
      >
        <Heart
          className={`w-6 h-6 transition-all ${
            liked ? "fill-red-500 text-red-500" : "fill-transparent stroke-white"
          }`}
        />
      </button>

      {/* 텍스트 */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white group-hover:-translate-y-2 transition-transform">
        <p className="text-sm uppercase tracking-wider text-gray-200">
          - {category} -
        </p>
        <h2 className="mt-1 text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
}
