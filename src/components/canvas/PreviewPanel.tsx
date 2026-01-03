"use client";

import { useEffect, useRef } from "react";
import { Layer } from "./CanvasEditor";

interface PreviewPanelProps {
  layers: Layer[];
  viewportOffset: { x: number; y: number };
  bannerWidth: number;
  bannerHeight: number;
}

export default function PreviewPanel({
  layers,
  viewportOffset,
  bannerWidth,
  bannerHeight,
}: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = canvas.width / bannerWidth;

    const drawLayers = async () => {
      for (const layer of layers) {
        if (!layer.visible) continue;

        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.save();
            const drawX = (layer.x - viewportOffset.x) * scale;
            const drawY = (layer.y - viewportOffset.y) * scale;
            const drawWidth = layer.width * scale;
            const drawHeight = layer.height * scale;

            ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
            ctx.rotate((layer.rotation * Math.PI) / 180);
            ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          img.src = layer.src;
        });
      }
    };

    drawLayers();
  }, [layers, viewportOffset, bannerWidth, bannerHeight]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Live Preview ({bannerWidth}×{bannerHeight})
      </h3>
      <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={792}
          height={198}
          className="w-full h-auto"
          style={{ aspectRatio: `${bannerWidth}/${bannerHeight}` }}
        />
        {layers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
            Upload an image to see preview
          </div>
        )}
      </div>
    </div>
  );
}
