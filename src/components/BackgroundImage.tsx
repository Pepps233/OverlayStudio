"use client";

import { useEffect } from "react";
import { withBasePath } from "@/utils/basePath";

export default function BackgroundImage() {
  useEffect(() => {
    // Set background image with proper base path
    const backgroundUrl = withBasePath("/website_background.webp");
    document.body.style.backgroundImage = `url('${backgroundUrl}')`;
    
    return () => {
      // Cleanup on unmount
      document.body.style.backgroundImage = '';
    };
  }, []);

  return null;
}
