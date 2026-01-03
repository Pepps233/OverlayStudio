"use client";

import { useEffect, useRef, useState } from "react";

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
}

const initialRectangles: Rectangle[] = [
  { id: 1, x: 10, y: 20, width: 200, height: 120, color: "bg-violet-500", rotation: -5 },
  { id: 2, x: 60, y: 40, width: 180, height: 100, color: "bg-purple-400", rotation: 8 },
  { id: 3, x: 25, y: 55, width: 160, height: 90, color: "bg-indigo-500", rotation: -3 },
  { id: 4, x: 45, y: 30, width: 220, height: 130, color: "bg-fuchsia-400", rotation: 12 },
  { id: 5, x: 35, y: 50, width: 190, height: 110, color: "bg-pink-500", rotation: -8 },
];

export default function ScrollAnimation({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const accumulatedDelta = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isComplete) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      const isInView = rect.top <= 100 && rect.bottom >= window.innerHeight * 0.5;

      if (isInView && !isComplete) {
        e.preventDefault();
        setIsLocked(true);

        accumulatedDelta.current += e.deltaY;
        const newProgress = Math.min(100, Math.max(0, accumulatedDelta.current / 15));
        setProgress(newProgress);

        if (newProgress >= 100) {
          setIsComplete(true);
          setIsLocked(false);
          onComplete();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isComplete, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 ${
        isLocked ? "touch-none" : ""
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-[500px]">
          {initialRectangles.map((rect, index) => {
            const delay = index * 20;
            const rectProgress = Math.max(0, Math.min(100, (progress - delay) * 2));
            const opacity = 1 - rectProgress / 100;
            const translateY = rectProgress * 3;
            const scale = 1 - rectProgress / 200;

            return (
              <div
                key={rect.id}
                className={`absolute ${rect.color} rounded-2xl shadow-2xl transition-none`}
                style={{
                  left: `${rect.x}%`,
                  top: `${rect.y}%`,
                  width: rect.width,
                  height: rect.height,
                  transform: `rotate(${rect.rotation}deg) translateY(${translateY}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: initialRectangles.length - index,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
