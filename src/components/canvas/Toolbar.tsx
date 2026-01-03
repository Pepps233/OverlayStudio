"use client";

import { useRef, useState } from "react";

interface ToolbarProps {
  onUpload: (file: File, type: "background" | "decoration") => void;
  onExport: (format: "png" | "jpeg") => void;
}

export default function Toolbar({ onUpload, onExport }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, "decoration");
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload Custom Image
        </button>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Upload your own images to add to the canvas
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Tips:</strong> Ctrl/Cmd + Scroll to zoom • Middle-click or Alt + Drag to pan • Right-click for options
        </p>
      </div>
    </div>
  );
}
