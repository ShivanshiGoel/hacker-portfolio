import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mind Palace Terminal - Digital Consciousness Interface",
  description:
    "An elegant, dark-themed terminal interface for navigating the digital mind palace. Inspired by VS Code aesthetics and developer consciousness.",
  keywords: [
    "terminal",
    "mind palace",
    "developer interface",
    "digital consciousness",
    "VS Code inspired",
    "glassmorphism",
    "dark theme",
    "interactive terminal",
  ],
  authors: [{ name: "Digital Architect" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1e1e1e",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Fira+Code:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1e1e1e" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="bg-[#1e1e1e] text-white font-mono antialiased overflow-hidden">{children}</body>
    </html>
  )
}
