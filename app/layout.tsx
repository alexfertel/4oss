import "./global.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import clsx from "clsx";
import { mono, sans } from "./_fonts";
import { Toaster } from "sonner";

export const viewport: Viewport = {
  maximumScale: 1,
  colorScheme: "only light",
  themeColor: "#fcfcfc",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "4oss",
    template: "%s | 4oss",
  },
  description: "Explore Open Source Software one click at a time",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        "text-black overflow-x-hidden touch-manipulation",
        sans.variable,
        mono.variable,
      )}
    >
      <body className="relative z-0 antialiased flex flex-col flex-1 bg-[url(/triangle-gradient-mobile.avif)] sm:bg-[url(/triangle-gradient-desktop.avif)] bg-cover bg-center bg-no-repeat">
        <main className="relative z-20 flex flex-col flex-1 items-center justify-between">
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
        <div className="z-10 absolute inset-0 background-pattern" />
        <Toaster
          position="top-center"
          closeButton
          toastOptions={{
            duration: 60000,
          }}
        />
      </body>
    </html>
  );
}
