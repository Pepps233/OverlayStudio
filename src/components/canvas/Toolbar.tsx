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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Use Ctrl/Cmd + Scroll to zoom • Middle-click or Alt + Drag to pan • Right-click images for options
      </p>
    </div>
  );
}
