import React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"

import "./globals.css"

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Robot Puzzle Adventure",
  description: "A fun programming puzzle game for kids ages 6-10",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Robot Puzzles",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
