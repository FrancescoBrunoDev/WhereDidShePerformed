import { JetBrains_Mono as FontMono, Inter as FontSans, Noto_Serif_Display as elegantFont } from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const elegant = elegantFont({
  subsets: ["latin"],
  variable: "--font-elegant",
})
