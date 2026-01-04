"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 flex items-center justify-center transition-all group-hover:scale-105">
            <Image src="/logo.svg" alt="Overlay Studio Logo" width={44} height={44} className="text-violet-500 dark:text-violet-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Overlay Studio
            </span>
            <span className="text-[10px] font-medium text-violet-500 dark:text-violet-400 leading-tight">
              Banner Magic
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
