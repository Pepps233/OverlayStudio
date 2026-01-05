import type { Metadata } from "next";
import { Manrope, Rancho } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ClientLayout from "@/components/ClientLayout";
import { withBasePath } from "@/utils/basePath";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const rancho = Rancho({
  variable: "--font-rancho",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Overlay Studio - LinkedIn Banner Generator",
  description: "Create stunning LinkedIn banners with AI-powered blending. Upload images, add decorative elements, and export professional banners.",
  icons: {
    icon: withBasePath("/logo.svg"),
    shortcut: withBasePath("/logo.svg"),
    apple: withBasePath("/logo.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${rancho.variable} antialiased`}
      >
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
