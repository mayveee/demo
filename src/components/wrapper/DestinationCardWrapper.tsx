import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";

interface DestinationCardDraggableProps {
  imageUrl: string;
  category: string;
  title: string;
}

export default function DestinationCardWrapper({
  imageUrl,
  category,
  title,
}: DestinationCardDraggableProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="group relative absolute top-10 left-10 w-80 h-[420px] cursor-grab active:cursor-grabbing overflow-hidden rounded-xl shadow-lg"
    >
      {/* 배경 이미지: hover -> group-hover로 변경 */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          t.onerror = null;
          t.src = "https://placehold.co/600x800/2d3748/ffffff?text=Image+Not+Found";
        }}
      />

      {/* 오버레이: 이벤트 방해 금지 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* 하트 버튼: 테두리 완전 제거 + 클릭 시 드래그 방지 */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // 드래그로 인식되는 것 방지
          setIsLiked((prev) => !prev);
        }}
        className="absolute top-4 right-4 z-20 rounded-full p-2 border-none outline-none bg-white/20 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 active:scale-95"
      >
        <Heart
          className={`h-6 w-6 transition-all ${
            isLiked ? "fill-red-500 text-red-500" : "fill-transparent stroke-white"
          }`}
        />
      </button>

      {/* 텍스트 */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white transition-transform duration-500 ease-in-out group-hover:-translate-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-200">
          - {category} -
        </p>
        <h2 className="mt-1 text-3xl font-bold leading-tight tracking-tight text-white">
          {title}
        </h2>
      </div>
    </motion.div>
  );
}
