import localFont from "next/font/local";

export const sans = localFont({
  src: './SpaceGrotesk-Variable.woff2',
  preload: true,
  variable: '--sans',
})

// export const serif = localFont({
//   src: './_fonts/LoraItalicVariable.woff2',
//   preload: true,
//   variable: '--serif',
// })

export const mono = localFont({
  src: './Berkeley Mono Variable R5ZXKZ4K.woff2',
  preload: true,
  variable: '--mono',
})
