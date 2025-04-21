import "./global.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import clsx from "clsx";
import { mono, sans } from "./_fonts";

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
      className={clsx("text-black", sans.variable, mono.variable)}
    >
      <body className="relative antialiased flex flex-col flex-1">
        <main className="relative z-20 flex flex-col flex-1 items-center justify-between">
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
        <div className="z-0 absolute inset-0 bg-[url(/triangle-gradient-mobile.avif)] md:bg-[url(/triangle-gradient-desktop.avif)] bg-cover bg-center bg-no-repeat" />
        <div className="z-10 absolute inset-0 background-pattern" />
      </body>
    </html>
  );
}
