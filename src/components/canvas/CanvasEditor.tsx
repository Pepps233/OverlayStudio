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
  const containerRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [viewportOffset, setViewportOffset] = useState({ x: (CANVAS_SIZE - BANNER_WIDTH) / 2, y: (CANVAS_SIZE - BANNER_HEIGHT) / 2 });
  // Initial zoom state
  const [zoom, setZoom] = useState(0.3);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layerId: string } | null>(null);
  const [resizing, setResizing] = useState<{ layerId: string; handle: string; startX: number; startY: number; startWidth: number; startHeight: number; startLayerX: number; startLayerY: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Responsive container width observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate responsive banner dimensions
  const getResponsiveBannerSize = useCallback(() => {
    const maxWidth = containerWidth - 48; // padding
    const aspectRatio = BANNER_WIDTH / BANNER_HEIGHT;
    const width = Math.min(maxWidth, 800);
    const height = width / aspectRatio;
    return { width, height };
  }, [containerWidth]);

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

  const handleLayerResize = useCallback((layerId: string, newWidth: number, newHeight: number, position?: { x: number; y: number }) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? { ...layer, width: newWidth, height: newHeight, ...(position ? { x: position.x, y: position.y } : {}) }
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

    // Calculate the current visual scale of the banner on screen
    const rect = canvasRef.current!.getBoundingClientRect();
    const currentScale = rect.width / BANNER_WIDTH;

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

        // Requirement 1: STRICT DRAGGING LOGIC
        // We calculate the mouse position in "World Coordinates" (1584x396 space)
        // by taking the visual offset within the div and dividing by the current visual scale.
        const mouseVisualX = e.clientX - rect.left;
        const mouseVisualY = e.clientY - rect.top;
        
        const mouseWorldX = viewportOffset.x + (mouseVisualX / currentScale);
        const mouseWorldY = viewportOffset.y + (mouseVisualY / currentScale);

        // Store the difference between Mouse World Pos and Layer World Pos
        setDragOffset({ 
          x: mouseWorldX - layer.x, 
          y: mouseWorldY - layer.y 
        });
      }
    } else {
      setSelectedLayerId(null);
    }
  }, [layers, canvasOffset, viewportOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: (e.clientX - panStart.x),
        y: (e.clientY - panStart.y),
      });
      return;
    }

    // Get current visual scale for accurate math
    const rect = canvasRef.current!.getBoundingClientRect();
    const currentScale = rect.width / BANNER_WIDTH;

    if (resizing) {
      const layer = layers.find((l) => l.id === resizing.layerId);
      if (!layer) return;

      // Use currentScale for resizing too to match visual cursor
      const dx = (e.clientX - resizing.startX) / currentScale;
      const dy = (e.clientY - resizing.startY) / currentScale;

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
            newHeight = newWidth / ratio;
            if (resizing.handle.includes('n')) {
              newY = resizing.startLayerY - (newHeight - resizing.startHeight);
            }
          } else {
            newWidth = newHeight * ratio;
            if (resizing.handle.includes('w')) {
              newX = resizing.startLayerX - (newWidth - resizing.startWidth);
            }
          }
        } else if (resizing.handle === 'e' || resizing.handle === 'w') {
          newHeight = newWidth / layer.originalAspectRatio;
        } else if (resizing.handle === 'n' || resizing.handle === 's') {
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
      // Requirement 1: STRICT DRAGGING LOGIC
      // Calculate current mouse world position
      const mouseVisualX = e.clientX - rect.left;
      const mouseVisualY = e.clientY - rect.top;
      
      const mouseWorldX = viewportOffset.x + (mouseVisualX / currentScale);
      const mouseWorldY = viewportOffset.y + (mouseVisualY / currentScale);

      setLayers(prev =>
        prev.map(layer =>
          layer.id === selectedLayerId
          ? {
            ...layer,
            // Apply the exact offset calculated on MouseDown
            x: mouseWorldX - dragOffset.x,
            y: mouseWorldY - dragOffset.y,
          }
          : layer
        )
      );
    }
  }, [isPanning, panStart, resizing, isDragging, selectedLayerId, viewportOffset, dragOffset, handleLayerResize, layers]);

  const handleMouseUp = useCallback(() => {
    // Requirement 3: AUTO-FIT LOGIC
    if (isDragging && selectedLayerId) {
      const layer = layers.find(l => l.id === selectedLayerId);
      
      if (layer) {
        // 1. Check if layer matches banner dimensions (allow small rounding error)
        const isCorrectSize = Math.abs(layer.width - BANNER_WIDTH) < 2 && Math.abs(layer.height - BANNER_HEIGHT) < 2;

        if (isCorrectSize) {
          // 2. Calculate overlap percentage
          // Banner Rect in World Space
          const bLeft = viewportOffset.x;
          const bRight = viewportOffset.x + BANNER_WIDTH;
          const bTop = viewportOffset.y;
          const bBottom = viewportOffset.y + BANNER_HEIGHT;

          // Layer Rect in World Space
          const lLeft = layer.x;
          const lRight = layer.x + layer.width;
          const lTop = layer.y;
          const lBottom = layer.y + layer.height;

          // Intersection Rect
          const xOverlap = Math.max(0, Math.min(bRight, lRight) - Math.max(bLeft, lLeft));
          const yOverlap = Math.max(0, Math.min(bBottom, lBottom) - Math.max(bTop, lTop));
          const overlapArea = xOverlap * yOverlap;
          const totalArea = layer.width * layer.height;

          // 3. Snap if > 80% overlap
          if (totalArea > 0 && (overlapArea / totalArea) > 0.5) {
            setLayers(prev => prev.map(l => 
              l.id === selectedLayerId 
              ? { ...l, x: viewportOffset.x, y: viewportOffset.y } // Snap to origin of banner
              : l
            ));
          }
        }
      }
    }

    setIsDragging(false);
    setIsPanning(false);
    setResizing(null);
  }, [isDragging, selectedLayerId, layers, viewportOffset]);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.export-dropdown')) {
        setExportDropdownOpen(false);
      }
    };
    if (exportDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [exportDropdownOpen]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // Requirement 2: LOWER SENSITIVITY
      // Changed from 0.9/1.1 to 0.98/1.02 for smoother scaling
      const delta = e.deltaY > 0 ? 0.98 : 1.02;
      setZoom((prev) => Math.min(3, Math.max(0.1, prev * delta)));
    }
  }, []);

  const exportBanner = useCallback(async (format: "png" | "jpeg") => {
    setExportDropdownOpen(false);
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

  const responsiveBanner = getResponsiveBannerSize();

  return (
    <section id="editor" className="min-h-screen w-full py-8 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 pt-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Banner Editor
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create custom LinkedIn banners with drag-and-drop editing
          </p>
        </div>

        {/* Main Layout: Side-by-side on desktop, stacked on mobile */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Controls Panel (Left Side) */}
          <div className="w-full space-y-6 lg:w-[400px] lg:shrink-0 flex flex-col">
            {/* Asset Library Section */}
            <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Assets
              </h2>
              <AssetLibrary onSelectAsset={handleAssetSelect} />
            </section>

            {/* Spacer for alignment on large screens */}
            <div className="hidden lg:block lg:flex-1" />

            {/* Upload Button */}
            <Toolbar
              onUpload={handleFileUpload}
              onExport={exportBanner}
            />

            {/* Download Button */}
            <div className="relative export-dropdown w-full max-w-[400px]">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="group relative w-full"
              >
                {/* Shadow layer for 3D effect */}
                <div className="absolute inset-0 bg-gray-900/40 rounded-2xl translate-y-1.5 blur-[2px]" />
                {/* Main button */}
                <div className="relative flex items-center justify-center gap-2 w-full px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transition-all duration-200 origin-top ${exportDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <button
                  onClick={() => exportBanner("png")}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">PNG</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">PNG Format</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lossless, transparent background</p>
                  </div>
                </button>
                <button
                  onClick={() => exportBanner("jpeg")}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-700 text-left transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">JPG</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">JPEG Format</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Smaller file size</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas & Preview Panel (Right Side) */}
          <div className="min-w-0 flex-1 space-y-6" ref={containerRef}>
            {/* Canvas Editor */}
            <div className="space-y-3 flex flex-col items-center">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                Canvas
              </h2>
              
              {/* Dotted Pattern Canvas Container */}
              <div
                className="relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 w-full max-w-5xl mx-auto"
                style={{
                  height: Math.max(400, responsiveBanner.height + 100),
                  backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                {/* Banner Box (Active Zone) */}
                <div
                  ref={canvasRef}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing bg-white overflow-hidden"
                  style={{
                    width: responsiveBanner.width,
                    height: responsiveBanner.height,
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    border: '2px solid #8b5cf6',
                    borderRadius: '12px',
                  }}
                  onMouseDown={(e) => handleMouseDown(e)}
                >
                  {/* Clipped Layers (inside banner) */}
                  {layers.map((layer) => {
                    if (!layer.visible) return null;
                    
                    const scale = responsiveBanner.width / BANNER_WIDTH;
                    const layerX = (layer.x - viewportOffset.x) * scale;
                    const layerY = (layer.y - viewportOffset.y) * scale;
                    const layerW = layer.width * scale;
                    const layerH = layer.height * scale;
                    
                    return (
                      <div
                        key={layer.id}
                        className={`absolute cursor-move ${
                          selectedLayerId === layer.id
                            ? "ring-2 ring-violet-500 ring-offset-2"
                            : ""
                        } ${layer.locked ? "pointer-events-none opacity-70" : ""}`}
                        style={{
                          left: layerX,
                          top: layerY,
                          width: layerW,
                          height: layerH,
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
                          className="w-full h-full pointer-events-none"
                          style={{ objectFit: layer.aspectRatioLocked ? 'contain' : 'fill' }}
                          draggable={false}
                        />
                        {selectedLayerId === layer.id && !layer.locked && (
                          <>
                            {/* Corner handles */}
                            <div 
                              className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-nw-resize z-10 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'nw'); }}
                            />
                            <div 
                              className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-ne-resize z-10 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'ne'); }}
                            />
                            <div 
                              className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-sw-resize z-10 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'sw'); }}
                            />
                            <div 
                              className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-se-resize z-10 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'se'); }}
                            />
                            {/* Side handles */}
                            <div 
                              className="absolute top-1/2 -left-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-w-resize z-10 -translate-y-1/2 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'w'); }}
                            />
                            <div 
                              className="absolute top-1/2 -right-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-e-resize z-10 -translate-y-1/2 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'e'); }}
                            />
                            <div 
                              className="absolute left-1/2 -top-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-n-resize z-10 -translate-x-1/2 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 'n'); }}
                            />
                            <div 
                              className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-violet-500 rounded-full cursor-s-resize z-10 -translate-x-1/2 border-2 border-white shadow-sm" 
                              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, layer.id, 's'); }}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Dimmed layers outside the banner (shown during drag) */}
                {isDragging && layers.map((layer) => {
                  if (!layer.visible || layer.id !== selectedLayerId) return null;
                  
                  const scale = responsiveBanner.width / BANNER_WIDTH;
                  const layerX = (layer.x - viewportOffset.x) * scale;
                  const layerY = (layer.y - viewportOffset.y) * scale;
                  const layerW = layer.width * scale;
                  const layerH = layer.height * scale;
                  
                  // Calculate banner position
                  const bannerLeft = (containerWidth - responsiveBanner.width) / 2;
                  const bannerTop = (Math.max(400, responsiveBanner.height + 100) - responsiveBanner.height) / 2;
                  
                  return (
                    <div
                      key={`ghost-${layer.id}`}
                      className="absolute pointer-events-none opacity-30 grayscale"
                      style={{
                        left: bannerLeft + layerX,
                        top: bannerTop + layerY,
                        width: layerW,
                        height: layerH,
                        transform: `rotate(${layer.rotation}deg)`,
                      }}
                    >
                      <img
                        src={layer.src}
                        alt={layer.name}
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banner Preview Section */}
            <div className="space-y-3">
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
          className="fixed bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 overflow-hidden"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              handleBringForward(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-violet-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            Bring Forward
          </button>
          <button
            onClick={() => {
              handleSendBack(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-violet-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            Send Back
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            onClick={() => {
              handleToggleAspectRatio(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-violet-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
          >
            {layers.find(l => l.id === contextMenu.layerId)?.aspectRatioLocked ? 'Unlock Ratio' : 'Lock Ratio'}
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            onClick={() => {
              handleLayerDelete(contextMenu.layerId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-2"
          >
            Delete
          </button>
        </div>
      )}
    </section>
  );
}