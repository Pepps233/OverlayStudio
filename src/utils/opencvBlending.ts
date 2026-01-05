declare const cv: any;

let cvReady = false;

export async function loadOpenCV(): Promise<boolean> {
  if (cvReady) return true;
  
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).cv && (window as any).cv.Mat) {
      cvReady = true;
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.async = true;
    
    script.onload = () => {
      if ((window as any).cv) {
        (window as any).cv.onRuntimeInitialized = () => {
          cvReady = true;
          console.log('OpenCV.js loaded successfully');
          resolve(true);
        };
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load OpenCV.js');
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
}

export async function blendImagesWithSeamlessClone(
  layer1: { src: string; x: number; y: number; width: number; height: number; rotation: number },
  layer2: { src: string; x: number; y: number; width: number; height: number; rotation: number },
  canvasWidth: number,
  canvasHeight: number
): Promise<{ dataUrl: string; bounds: { x: number; y: number; width: number; height: number } } | null> {
  try {
    const img1 = await loadImage(layer1.src);
    const img2 = await loadImage(layer2.src);
    
    const minX = Math.min(layer1.x, layer2.x);
    const minY = Math.min(layer1.y, layer2.y);
    const maxX = Math.max(layer1.x + layer1.width, layer2.x + layer2.width);
    const maxY = Math.max(layer1.y + layer1.height, layer2.y + layer2.height);
    
    const blendWidth = maxX - minX;
    const blendHeight = maxY - minY;
    
    const canvas = document.createElement('canvas');
    canvas.width = blendWidth;
    canvas.height = blendHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.save();
    const layer1CenterX = layer1.x - minX + layer1.width / 2;
    const layer1CenterY = layer1.y - minY + layer1.height / 2;
    ctx.translate(layer1CenterX, layer1CenterY);
    ctx.rotate((layer1.rotation * Math.PI) / 180);
    ctx.drawImage(img1, -layer1.width / 2, -layer1.height / 2, layer1.width, layer1.height);
    ctx.restore();

    ctx.save();
    const layer2CenterX = layer2.x - minX + layer2.width / 2;
    const layer2CenterY = layer2.y - minY + layer2.height / 2;
    ctx.translate(layer2CenterX, layer2CenterY);
    ctx.rotate((layer2.rotation * Math.PI) / 180);
    ctx.drawImage(img2, -layer2.width / 2, -layer2.height / 2, layer2.width, layer2.height);
    ctx.restore();

    const blendedDataUrl = canvas.toDataURL('image/png');
    return {
      dataUrl: blendedDataUrl,
      bounds: { x: minX, y: minY, width: blendWidth, height: blendHeight }
    };
  } catch (error) {
    console.error('Blending failed:', error);
    return null;
  }
}

function calculateOverlapRegion(
  layer1: { x: number; y: number; width: number; height: number },
  layer2: { x: number; y: number; width: number; height: number }
): { x: number; y: number; width: number; height: number } | null {
  const x1 = Math.max(layer1.x, layer2.x);
  const y1 = Math.max(layer1.y, layer2.y);
  const x2 = Math.min(layer1.x + layer1.width, layer2.x + layer2.width);
  const y2 = Math.min(layer1.y + layer1.height, layer2.y + layer2.height);
  
  if (x2 > x1 && y2 > y1) {
    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
  }
  return null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
