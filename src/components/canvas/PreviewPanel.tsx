"use client";

import { useEffect, useRef, useState } from "react";
import { Layer } from "./CanvasEditor";

interface PreviewPanelProps {
  layers: Layer[];
  viewportOffset: { x: number; y: number };
  bannerWidth: number;
  bannerHeight: number;
  onUpload: (file: File, type: "background" | "decoration") => void;
  onExport: (format: "png" | "jpeg") => void;
}

export default function PreviewPanel({
  layers,
  viewportOffset,
  bannerWidth,
  bannerHeight,
  onUpload,
  onExport,
}: PreviewPanelProps) {
  const bannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const profileCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, "decoration");
      e.target.value = "";
    }
  };

  useEffect(() => {
    const drawCanvas = async (canvas: HTMLCanvasElement | null, isProfile: boolean) => {
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

      await drawLayers();
    };

    drawCanvas(bannerCanvasRef.current, false);
    drawCanvas(profileCanvasRef.current, true);
  }, [layers, viewportOffset, bannerWidth, bannerHeight]);

  return (
    <div className="space-y-4">
      {/* Upload Custom and Export Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload Custom
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {showExportMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[120px]">
              <button
                onClick={() => {
                  onExport("png");
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                PNG
              </button>
              <button
                onClick={() => {
                  onExport("jpeg");
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                JPEG
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Banner Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Banner Preview ({bannerWidth}×{bannerHeight})
        </h3>
        <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          <canvas
            ref={bannerCanvasRef}
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

      {/* Profile Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Profile Preview
        </h3>
        <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: "784/479" }}>
            {/* Green background */}
            <div className="absolute inset-0" style={{ backgroundColor: "#B4FF8F" }} />
            {/* Banner overlay */}
            <div className="absolute" style={{ left: "0.5px", top: "0.5px", width: "782.922px", height: "196.95px" }}>
              <canvas
                ref={profileCanvasRef}
                width={792}
                height={198}
                className="w-full h-full"
              />
            </div>
          </div>
          {layers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
              Upload an image to see preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
