"use client";

import { useState } from "react";

interface AssetLibraryProps {
  onSelectAsset: (src: string, type: "background" | "overlay" | "cosmetic") => void;
}

type AssetCategory = "background" | "overlay" | "cosmetics";

export default function AssetLibrary({ onSelectAsset }: AssetLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>("background");

  const categories = [
    { id: "background" as AssetCategory, label: "Backgrounds", icon: "🖼️" },
    { id: "overlay" as AssetCategory, label: "Overlays", icon: "🎨" },
    { id: "cosmetics" as AssetCategory, label: "Cosmetics", icon: "✨" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Asset Library</h3>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-sm">No {activeCategory} assets yet</p>
          <p className="text-xs mt-1">Add assets to /public/assets/{activeCategory}/</p>
        </div>
      </div>
    </div>
  );
}
