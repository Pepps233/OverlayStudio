"use client";

import Image from "next/image";
import {withBasePath} from "@/utils/basePath";

export default function Showcase() {
    return (
        <div className="relative w-full flex flex-col items-center py-16 px-6">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 rounded-xl overflow-hidden">
                <Image
                    src={withBasePath("/cat_1.webp")}
                    alt="Cute cat"
                    fill
                    className="object-contain rounded-xl"
                />
            </div>

            <p
                className="text-2xl md:text-3xl text-center text-gray-800 dark:text-gray-200 mb-8 max-w-md"
                style={{fontFamily: "var(--font-rancho), cursive"}}
            >
                Your LinkedIn banner is boring, check me out
            </p>

            {/* Arrow Down SVG */}
            <div className="relative w-12 h-32 md:w-16 md:h-40 mb-12">
                <Image
                    src={withBasePath("/arrowdown.svg")}
                    alt="Arrow down"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Showcase 1 */}
            <div className="relative w-full max-w-4xl mb-8">
                <Image
                    src={withBasePath("/showcase_1.webp")}
                    alt="Showcase example 1"
                    width={1200}
                    height={600}
                    className="w-full h-auto rounded-2xl shadow-xl"
                />
            </div>

            {/* Showcase 2 */}
            <div className="relative w-full max-w-4xl">
                <Image
                    src={withBasePath("/showcase_2.webp")}
                    alt="Showcase example 2"
                    width={1200}
                    height={600}
                    className="w-full h-auto rounded-2xl shadow-xl"
                />
            </div>
        </div>
    );
}

