"use client";

import { useState, useEffect } from "react";

interface AssetLibraryProps {
  onSelectAsset: (src: string, type: "background" | "overlay" | "cosmetic") => void;
}

type AssetCategory = "background" | "overlay" | "cosmetics";

interface AssetItem {
  name: string;
  path: string;
}

export default function AssetLibrary({ onSelectAsset }: AssetLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>("background");
  const [assets, setAssets] = useState<Record<AssetCategory, AssetItem[]>>({
    background: [],
    overlay: [],
    cosmetics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const backgrounds = [
          { name: "Golden Gate Bridge", path: "/assets/background/golden_gate_bridge_1.jpg" },
          { name: "New York City", path: "/assets/background/nyc.jpeg" },
          { name: "Seattle", path: "/assets/background/seattle.jpg" },
          { name: "Chicago", path: "/assets/background/chicago.png" },
          { name: "Austin", path: "/assets/background/austin.jpeg" },
        ];

        const overlays = [
          { name: "Cat 1", path: "/assets/overlay/Cat1.png" },
          { name: "Cat 2", path: "/assets/overlay/Cat2.png" },
          { name: "Cat 3", path: "/assets/overlay/Cat3.png" },
          { name: "Cat 4", path: "/assets/overlay/Cat4.png" },
          { name: "Dog 1", path: "/assets/overlay/Dog1.png" },
          { name: "Dog 2", path: "/assets/overlay/Dog2.png" },
          { name: "Dog 3", path: "/assets/overlay/Dog3.png" },
          { name: "Dog 4", path: "/assets/overlay/Dog4.png" },
          { name: "Sea Lion 1", path: "/assets/overlay/Sea_Lion1.png" },
          { name: "Seal 1", path: "/assets/overlay/Seal1.png" },
        ];

        const cosmetics = [
          { name: "Hat 1", path: "/assets/cosmetic/Hat1.png" },
          { name: "Hat 2", path: "/assets/cosmetic/Hat2.png" },
          { name: "Hat 3", path: "/assets/cosmetic/Hat3.png" },
          { name: "Hat 4", path: "/assets/cosmetic/Hat4.png" },
          { name: "Hat 5", path: "/assets/cosmetic/Hat5.png" },
          { name: "Hat 6", path: "/assets/cosmetic/Hat6.png" },
          { name: "Hat 7", path: "/assets/cosmetic/Hat7.png" },
          { name: "Hat 8", path: "/assets/cosmetic/Hat8.png" },
        ];
        
        setAssets({
          background: backgrounds,
          overlay: overlays,
          cosmetics: cosmetics,
        });
      } catch (error) {
        console.error("Error loading assets:", error);
      }
      setLoading(false);
    };

    loadAssets();
  }, []);

  const categories = [
    { id: "background" as AssetCategory, label: "Backgrounds" },
    { id: "overlay" as AssetCategory, label: "Overlays" },
    { id: "cosmetics" as AssetCategory, label: "Cosmetics" }
  ];

  const currentAssets = assets[activeCategory];
  const assetType = activeCategory === "background" ? "background" : activeCategory === "overlay" ? "overlay" : "cosmetic";

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1"> 
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as AssetCategory)}
            className={`flex-none px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === category.id
                ? "bg-violet-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
        {loading ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">Loading assets...</p>
          </div>
        ) : currentAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">No {activeCategory} assets available</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {currentAssets.map((asset, index) => (
              <button
                key={index}
                onClick={() => onSelectAsset(asset.path, assetType)}
                className="group relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all"
              >
                <img
                  src={asset.path}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="w-full p-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] font-medium truncate">{asset.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}