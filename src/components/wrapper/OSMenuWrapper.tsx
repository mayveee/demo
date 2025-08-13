// src/components/OSMenuWrapper.tsx
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import MacOSDock from "@/components/MacMenubar";

interface OSMenuWrapperProps {
  id: string;
  initial?: { x: number; y: number };
  constraintsRef: React.RefObject<Element | null>;
  zIndex?: number;
  onFocus?: (id: string) => void;
}

export function OSMenuWrapper({
  id,
  initial = { x: 0, y: 0 },
  constraintsRef,
  zIndex = 10,
  onFocus,
}: OSMenuWrapperProps) {
  const sampleApps = [
    { id: "finder", name: "Finder", icon: "https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024" },
    { id: "calculator", name: "Calculator", icon: "https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024" },
    { id: "terminal", name: "Terminal", icon: "https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024" },
    { id: "mail", name: "Mail", icon: "https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024" },
    { id: "notes", name: "Notes", icon: "https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024" },
    { id: "safari", name: "Safari", icon: "https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024" },
    { id: "photos", name: "Photos", icon: "https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024" },
    { id: "music", name: "Music", icon: "https://cdn.jim-nielsen.com/macos/1024/music-2021-05-25.png?rf=1024" },
    { id: "calendar", name: "Calendar", icon: "https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024" },
  ];

    const [openApps, setOpenApps] = useState<string[]>(["finder", "safari"]);

    const handleAppClick = (appId: string) => {
    setOpenApps((prev) =>
        prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
    };


  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      initial={initial}
      style={{
        position: "absolute",
        zIndex,
      }}
      onMouseDown={() => onFocus?.(id)}
    >
      <MacOSDock
        apps={sampleApps}
        onAppClick={handleAppClick}
        openApps={openApps}
      />
    </motion.div>
  );
}
