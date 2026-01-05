"use client";

import { useRef } from "react";

interface ToolbarProps {
  onUpload: (file: File, type: "background" | "decoration") => void;
  onExport: (format: "png" | "jpeg") => void;
  zoomMode: boolean;
  onZoomModeToggle: () => void;
}

export default function Toolbar({ onUpload, zoomMode, onZoomModeToggle }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, "decoration");
      e.target.value = "";
    }
  };

  return (
    <div className="relative space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Zoom Mode Button */}
      <button
        onClick={onZoomModeToggle}
        className="group relative w-full max-w-[400px]"
      >
        {/* Shadow layer */}
        <div className="absolute inset-0 bg-gray-900/40 rounded-2xl translate-y-1.5 blur-[2px]" />

        {/* Main button */}
        <div className={`relative w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 ${
          zoomMode
            ? 'bg-violet-600 hover:bg-violet-700 text-white'
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
          {zoomMode ? 'Zoom Mode: ON' : 'Zoom Mode: OFF'}
        </div>
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="group relative w-full max-w-[400px]"
      >
        {/* Shadow layer */}
        <div className="absolute inset-0 bg-gray-900/40 rounded-2xl translate-y-1.5 blur-[2px]" />

        {/* Main button */}
        <div className="relative w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload Custom Image
        </div>
      </button>

      {/* Explainer text (separate from button) */}
      <p className="text-xs font-normal text-gray-400 text-center max-w-[400px]">
        We recommend <strong>1584 × 396 px</strong> background images. Crop on
        desktop or use{" "}
        <a
          href="https://imageresizer.com/crop-image"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-200"
        >
          Free online image cropper
        </a>
        .
      </p>
    </div>
  );
}