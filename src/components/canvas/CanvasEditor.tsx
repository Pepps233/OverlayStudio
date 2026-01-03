"use client";

import { useState, useRef, useCallback } from "react";
import PreviewPanel from "./PreviewPanel";
import LayerPanel from "./LayerPanel";
import Toolbar from "./Toolbar";
import AssetLibrary from "./AssetLibrary";

export interface Layer {
  id: string;
  type: "image" | "decoration";
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  src: string;
  visible: boolean;
  locked: boolean;
}

const CANVAS_SIZE = 3000;
const BANNER_WIDTH = 1584;
const BANNER_HEIGHT = 396;

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [viewportOffset, setViewportOffset] = useState({ x: (CANVAS_SIZE - BANNER_WIDTH) / 2, y: (CANVAS_SIZE - BANNER_HEIGHT) / 2 });
  const [zoom, setZoom] = useState(0.3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const handleAssetSelect = useCallback((src: string, type: "background" | "overlay" | "cosmetic") => {
    const img = new Image();
    img.onload = () => {
      const newLayer: Layer = {
        id: `layer-${Date.now()}`,
        type: type === "background" ? "image" : "decoration",
        name: src.split("/").pop() || "Asset",
        x: viewportOffset.x + BANNER_WIDTH / 2 - img.width / 2,
        y: viewportOffset.y + BANNER_HEIGHT / 2 - img.height / 2,
        width: img.width,
        height: img.height,
        rotation: 0,
        src: src,
        visible: true,
        locked: false,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
    };
    img.src = src;
  }, [viewportOffset]);

  const handleFileUpload = useCallback((file: File, type: "background" | "decoration") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const newLayer: Layer = {
          id: `layer-${Date.now()}`,
          type: type === "background" ? "image" : "decoration",
          name: file.name,
          x: viewportOffset.x + BANNER_WIDTH / 2 - img.width / 2,
          y: viewportOffset.y + BANNER_HEIGHT / 2 - img.height / 2,
          width: img.width,
          height: img.height,
          rotation: 0,
          src: e.target?.result as string,
          visible: true,
          locked: false,
        };
        setLayers((prev) => [...prev, newLayer]);
        setSelectedLayerId(newLayer.id);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [viewportOffset]);

  const handleLayerMove = useCallback((layerId: string, dx: number, dy: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? { ...layer, x: layer.x + dx / zoom, y: layer.y + dy / zoom }
          : layer
      )
    );
  }, [zoom]);

  const handleLayerResize = useCallback((layerId: string, newWidth: number, newHeight: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? { ...layer, width: newWidth, height: newHeight }
          : layer
      )
    );
  }, []);

  const handleLayerDelete = useCallback((layerId: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
  }, [selectedLayerId]);

  const handleLayerReorder = useCallback((fromIndex: number, toIndex: number) => {
    setLayers((prev) => {
      const newLayers = [...prev];
      const [removed] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, removed);
      return newLayers;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, layerId?: string) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      return;
    }

    if (layerId) {
      const layer = layers.find((l) => l.id === layerId);
      if (layer && !layer.locked) {
        setSelectedLayerId(layerId);
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    } else {
      setSelectedLayerId(null);
    }
  }, [layers, canvasOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (isDragging && selectedLayerId) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      handleLayerMove(selectedLayerId, dx, dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, panStart, isDragging, selectedLayerId, dragStart, handleLayerMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.min(2, Math.max(0.1, prev * delta)));
    }
  }, []);

  const exportBanner = useCallback(async (format: "png" | "jpeg") => {
    const canvas = document.createElement("canvas");
    canvas.width = BANNER_WIDTH;
    canvas.height = BANNER_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, BANNER_WIDTH, BANNER_HEIGHT);

    for (const layer of layers) {
      if (!layer.visible) continue;

      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.save();
          const drawX = layer.x - viewportOffset.x;
          const drawY = layer.y - viewportOffset.y;
          ctx.translate(drawX + layer.width / 2, drawY + layer.height / 2);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = layer.src;
      });
    }

    const link = document.createElement("a");
    link.download = `linkedin-banner.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.9 : undefined);
    link.click();
  }, [layers, viewportOffset]);

  return (
    <section id="editor" className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-[1800px] mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Banner Editor
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Canvas: {CANVAS_SIZE}×{CANVAS_SIZE}px | Output: {BANNER_WIDTH}×{BANNER_HEIGHT}px
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          <AssetLibrary onSelectAsset={handleAssetSelect} />

          <div className="space-y-4">
            <Toolbar
              onUpload={handleFileUpload}
              onExport={exportBanner}
              zoom={zoom}
              onZoomChange={setZoom}
            />

            <div
              className="relative bg-[#1e1e1e] dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-inner"
              style={{ height: "700px" }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <div
                ref={canvasRef}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  width: CANVAS_SIZE * zoom,
                  height: CANVAS_SIZE * zoom,
                  left: `calc(50% + ${canvasOffset.x}px)`,
                  top: `calc(50% + ${canvasOffset.y}px)`,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                }}
                onMouseDown={(e) => handleMouseDown(e)}
              >
                {/* Layers */}
                {layers.map((layer) => (
                  layer.visible && (
                    <div
                      key={layer.id}
                      className={`absolute cursor-move ${
                        selectedLayerId === layer.id
                          ? "ring-2 ring-violet-500 ring-offset-2"
                          : ""
                      } ${layer.locked ? "pointer-events-none opacity-70" : ""}`}
                      style={{
                        left: layer.x * zoom,
                        top: layer.y * zoom,
                        width: layer.width * zoom,
                        height: layer.height * zoom,
                        transform: `rotate(${layer.rotation}deg)`,
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, layer.id);
                      }}
                    >
                      <img
                        src={layer.src}
                        alt={layer.name}
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                      {selectedLayerId === layer.id && !layer.locked && (
                        <>
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-violet-500 rounded-full cursor-nw-resize" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full cursor-ne-resize" />
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-violet-500 rounded-full cursor-sw-resize" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-violet-500 rounded-full cursor-se-resize" />
                        </>
                      )}
                    </div>
                  )
                ))}

                {/* Banner viewport overlay */}
                <div
                  className="absolute border border-blue-500 pointer-events-none shadow-[0_0_0_1px_rgba(59,130,246,0.5)]"
                  style={{
                    left: viewportOffset.x * zoom,
                    top: viewportOffset.y * zoom,
                    width: BANNER_WIDTH * zoom,
                    height: BANNER_HEIGHT * zoom,
                  }}
                >
                  <div className="absolute -top-6 left-0 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                    LinkedIn Banner ({BANNER_WIDTH}×{BANNER_HEIGHT})
                  </div>
                </div>
              </div>

              {/* Zoom indicator */}
              <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg text-sm font-medium text-white">
                {Math.round(zoom * 100)}%
              </div>
            </div>

            <PreviewPanel
              layers={layers}
              viewportOffset={viewportOffset}
              bannerWidth={BANNER_WIDTH}
              bannerHeight={BANNER_HEIGHT}
            />
          </div>

          <LayerPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onDeleteLayer={handleLayerDelete}
            onReorderLayers={handleLayerReorder}
            onUpdateLayer={(id: string, updates: Partial<Layer>) => {
              setLayers((prev) =>
                prev.map((layer) =>
                  layer.id === id ? { ...layer, ...updates } : layer
                )
              );
            }}
          />
        </div>
      </div>
    </section>
  );
}
