"use client";

import Image from "next/image";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Showcase from "@/components/Showcase";
import CanvasEditor from "@/components/canvas/CanvasEditor";

export default function Home() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <Header />
      
      <HeroSection />
      
      <Showcase />
      
      <CanvasEditor />
      
      <footer className="w-full border-t border-gray-100/50 dark:border-gray-800/50 py-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image src="/logo.svg" alt="Overlay Studio Logo" width={48} height={48} className="text-violet-500 dark:text-violet-400" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-gray-900 dark:text-white block">
                Overlay Studio
              </span>
              <span className="text-xs font-medium text-violet-500 dark:text-violet-400">
                Made with love
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Open source LinkedIn banner generator with magical blending
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500 flex-wrap">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="flex items-center gap-1">MIT License</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="flex items-center gap-1">Next.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
