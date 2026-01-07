"use client";

import Image from "next/image";
import {withBasePath} from "@/utils/basePath";

export default function HeroSection() {
    return (
        <section
            className="min-h-screen w-full flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
            {/* Hero Overlay Image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[100%] h-[100%]">
                    <Image
                        src={withBasePath("/hero_overlay.webp")}
                        alt="Hero Overlay"
                        fill
                        className="object-contain opacity-7"
                        priority
                    />
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating circles */}
                <div
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-200 to-violet-200 dark:from-pink-900/20 dark:to-violet-900/20 rounded-full blur-3xl opacity-60 animate-pulse"/>
                <div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50 animate-pulse"
                    style={{animationDelay: '1s'}}/>
                <div
                    className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/10 dark:to-rose-900/10 rounded-full blur-3xl opacity-40 animate-pulse"
                    style={{animationDelay: '2s'}}/>
            </div>

            {/* Cat Image - Right Side */}
            <div className="absolute right-2 top-1/4 -translate-y-1/2 pointer-events-none z-0">
                <div
                    className="relative w-[200px] h-[200px] sm:w-[200px] sm:h-[200px] md:w-[260px] md:h-[260px] lg:w-[350px] lg:h-[350px] opacity-80">
                    <Image
                        src={withBasePath("/cat_2.webp")}
                        alt="Decorative Cat"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full mb-8 shadow-lg border border-violet-100">
                    <span
                        className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"/>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-900">
          Open Source
        </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                    LinkedIn banners
                    <br/>
                    that show your personality
                </h1>

                <p className="text-xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Overlay Studio is an open source project inspired by{" "}
                    <a
                        href="https://ogis.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline decoration-2 underline-offset-2 transition-colors"
                    >
                        ogis.dev
                    </a>
                    . Check out the original project on{" "}
                    <a
                        href="https://github.com/twangodev/ogis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline decoration-2 underline-offset-2 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </a>
                    .
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* GET STARTED BUTTON */}
                    <a
                        href="#editor"
                        className="group relative w-full sm:w-auto"
                    >
                        {/* Shadow layer */}
                        <div className="absolute inset-0 bg-gray-900/40 rounded-2xl translate-y-1.5 blur-[2px]"/>
                        {/* Main button */}
                        <div
                            className="relative px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 min-w-[200px]">
                            <span>Get Started</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}
                                 stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
                            </svg>
                        </div>
                    </a>

                    {/* VIEW ON GITHUB BUTTON - Now identical style */}
                    <a
                        href="https://github.com/Pepps233/OverlayStudio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-full sm:w-auto"
                    >
                        {/* Shadow layer (Identical to above) */}
                        <div className="absolute inset-0 bg-gray-900/40 rounded-2xl translate-y-1.5 blur-[2px]"/>

                        {/* Main button (Identical styling to above) */}
                        <div
                            className="relative px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 min-w-[200px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>View on GitHub</span>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}