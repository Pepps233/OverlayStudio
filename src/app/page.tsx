"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ScrollAnimation from "@/components/ScrollAnimation";
import CanvasEditor from "@/components/canvas/CanvasEditor";

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <HeroSection />
      
      <ScrollAnimation onComplete={() => setAnimationComplete(true)} />
      
      <CanvasEditor />
      
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0-4.5v4.5m0 0-5.571 3-5.571-3m11.142 0L21.75 16.5 12 21.75 2.25 16.5l4.179-2.25m0 0v-4.5"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Overlay Studio
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Open source LinkedIn banner generator with AI-powered blending
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <span>MIT License</span>
            <span>•</span>
            <span>Made with Next.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
