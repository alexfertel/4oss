import localFont from "next/font/local";

export const sans = localFont({
  src: "./Nexa-Book.woff2",
  preload: true,
  variable: "--sans",
});

export const mono = localFont({
  src: "./Berkeley Mono Variable R5ZXKZ4K.woff2",
  preload: true,
  variable: "--mono",
});
