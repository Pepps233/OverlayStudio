"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import PreviewPanel from "./PreviewPanel";
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
  aspectRatioLocked: boolean;
  originalAspectRatio: number;
}

const CANVAS_SIZE = 2000;
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
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layerId: string } | null>(null);
  const [resizing, setResizing] = useState<{ layerId: string; handle: string; startX: number; startY: number; startWidth: number; startHeight: number; startLayerX: number; startLayerY: number } | null>(null);

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
        aspectRatioLocked: true,
        originalAspectRatio: img.width / img.height,
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
          aspectRatioLocked: true,
          originalAspectRatio: img.width / img.height,
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

  const handleLayerResize = useCallback((layerId: string, newWidth: number, newHeight: number, position?: { x: number; y: number }) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? { ...layer, width: newWidth, height: newHeight, ...(position? { x: position.x, y: position.y }: {})}
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

  const handleBringForward = useCallback((layerId: string) => {
    setLayers((prev) => {
      const index = prev.findIndex((l) => l.id === layerId);
      if (index < prev.length - 1) {
        const newLayers = [...prev];
        [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
        return newLayers;
      }
      return prev;
    });
  }, []);

  const handleSendBack = useCallback((layerId: string) => {
    setLayers((prev) => {
      const index = prev.findIndex((l) => l.id === layerId);
      if (index > 0) {
        const newLayers = [...prev];
        [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
        return newLayers;
      }
      return prev;
    });
  }, []);

  const handleToggleAspectRatio = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? { ...layer, aspectRatioLocked: !layer.aspectRatioLocked }
          : layer
      )
    );
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, layerId?: string, handle?: string) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      return;
    }

    if (handle && layerId) {
      const layer = layers.find((l) => l.id === layerId);
      if (layer && !layer.locked) {
        setResizing({
          layerId,
          handle,
          startX: e.clientX,
          startY: e.clientY,
          startWidth: layer.width,
          startHeight: layer.height,
          startLayerX: layer.x,
          startLayerY: layer.y,
        });
      }
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
        x: (e.clientX - panStart.x),
        y: (e.clientY - panStart.y),
      });
      return;
    }

    if (resizing) {
      const layer = layers.find((l) => l.id === resizing.layerId);
      if (!layer) return;

      const dx = (e.clientX - resizing.startX) / zoom;
      const dy = (e.clientY - resizing.startY) / zoom;

      let newWidth = resizing.startWidth;
      let newHeight = resizing.startHeight;
      let newX = resizing.startLayerX;
      let newY = resizing.startLayerY;

      if (resizing.handle.includes('e')) newWidth = resizing.startWidth + dx;

      if (resizing.handle.includes('w')) {
        newWidth = resizing.startWidth - dx;
        newX = resizing.startLayerX + dx;
      }

      if (resizing.handle.includes('s')) newHeight = resizing.startHeight + dy;

      if (resizing.handle.includes('n')) {
        newHeight = resizing.startHeight - dy;
        newY = resizing.startLayerY + dy;
      }

      if (layer.aspectRatioLocked) {
        if (resizing.handle.length === 2) {
          const ratio = layer.originalAspectRatio;
          const widthChange = Math.abs(newWidth - resizing.startWidth);
          const heightChange = Math.abs(newHeight - resizing.startHeight);
          
          if (widthChange > heightChange) {
            const oldHeight = newHeight;
            newHeight = newWidth / ratio;
            if (resizing.handle.includes('n')) {
              newY = resizing.startLayerY - (newHeight - resizing.startHeight);
            }
          } else {
            const oldWidth = newWidth;
            newWidth = newHeight * ratio;
            if (resizing.handle.includes('w')) {
              newX = resizing.startLayerX - (newWidth - resizing.startWidth);
            }
          }
        } else if (resizing.handle === 'e' || resizing.handle === 'w') {
          const oldHeight = newHeight;
          newHeight = newWidth / layer.originalAspectRatio;
        } else if (resizing.handle === 'n' || resizing.handle === 's') {
          const oldWidth = newWidth;
          newWidth = newHeight * layer.originalAspectRatio;
          if (resizing.handle === 'n') {
            newX = resizing.startLayerX - (newWidth - resizing.startWidth) / 2;
          }
        }
      }

      handleLayerResize(resizing.layerId, Math.max(10, newWidth), Math.max(10, newHeight), { x: newX, y: newY });
      return;
    }

    if (isDragging && selectedLayerId) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      handleLayerMove(selectedLayerId, dx, dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, panStart, resizing, isDragging, selectedLayerId, dragStart, handleLayerMove, handleLayerResize, layers, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setResizing(null);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, layerId });
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

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
    <section id="editor" className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-7xl px-6 pt-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banner Editor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create custom LinkedIn banners with drag-and-drop editing.
          </p>
        </div>

        {/* Main Layout: Side-by-side on desktop, stacked on mobile */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Controls Panel (Left Side) */}
          <div className="w-full space-y-6 lg:w-[400px] lg:shrink-0">
            {/* Asset Library Section */}
            <section>
              <h2 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Assets</h2>
              <AssetLibrary onSelectAsset={handleAssetSelect} />
            </section>

            {/* Upload Section */}
            <section>
              <h2 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Upload</h2>
              <Toolbar
                onUpload={handleFileUpload}
                onExport={exportBanner}
              />
            </section>

            {/* Output Settings Section */}
            <section>
              <h2 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Output</h2>
              <div className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export your banner in PNG or JPEG format
                </p>
              </div>
            </section>
          </div>

          {/* Canvas & Preview Panel (Right Side) */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Canvas Editor */}
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">Canvas</h2>
              <div
                className="relative bg-[#1e1e1e] dark:bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                style={{ height: "600px" }}
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
                      onContextMenu={(e) => handleContextMenu(e, layer.id)}
                    >
                      <img
                        src={layer.src}
                        alt={layer.name}
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                      {selectedLayerId === layer.id && !layer.locked && (
                        <>
                          {/* Corner handles */}
                          <div 
                            className="absolute -top-1 -left-1 w-3 h-3 bg-violet-500 rounded-full cursor-nw-resize z-10" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'nw'); }}
                          />
                          <div 
                            className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full cursor-ne-resize z-10" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'ne'); }}
                          />
                          <div 
                            className="absolute -bottom-1 -left-1 w-3 h-3 bg-violet-500 rounded-full cursor-sw-resize z-10" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'sw'); }}
                          />
                          <div 
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-violet-500 rounded-full cursor-se-resize z-10" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'se'); }}
                          />
                          {/* Side handles */}
                          <div 
                            className="absolute top-1/2 -left-1 w-3 h-3 bg-violet-500 rounded-full cursor-w-resize z-10 -translate-y-1/2" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'w'); }}
                          />
                          <div 
                            className="absolute top-1/2 -right-1 w-3 h-3 bg-violet-500 rounded-full cursor-e-resize z-10 -translate-y-1/2" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'e'); }}
                          />
                          <div 
                            className="absolute left-1/2 -top-1 w-3 h-3 bg-violet-500 rounded-full cursor-n-resize z-10 -translate-x-1/2" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'n'); }}
                          />
                          <div 
                            className="absolute left-1/2 -bottom-1 w-3 h-3 bg-violet-500 rounded-full cursor-s-resize z-10 -translate-x-1/2" 
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 's'); }}
                          />
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
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Export</h3>
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <button
                  onClick={() => exportBanner("png")}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PNG
                </button>
                <button
                  onClick={() => exportBanner("jpeg")}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download JPEG
                </button>
              </div>
            </div>

            {/* Banner Preview Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Banner Previews</h3>
              <PreviewPanel
                layers={layers}
                viewportOffset={viewportOffset}
                bannerWidth={BANNER_WIDTH}
                bannerHeight={BANNER_HEIGHT}
                onUpload={handleFileUpload}
                onExport={exportBanner}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              handleBringForward(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Bring Forward
          </button>
          <button
            onClick={() => {
              handleSendBack(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Send Back
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            onClick={() => {
              handleToggleAspectRatio(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {layers.find(l => l.id === contextMenu.layerId)?.aspectRatioLocked ? 'Unlock Ratio' : 'Lock Ratio'}
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            onClick={() => {
              handleLayerDelete(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
          >
            Delete
          </button>
        </div>
      )}
    </section>
  );
}
