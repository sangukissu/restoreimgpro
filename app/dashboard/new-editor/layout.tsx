import type React from "react"
import type { Metadata } from "next"
import { EB_Garamond } from "next/font/google"
import { Special_Elite } from "next/font/google"
import { Cinzel } from "next/font/google"
import { Manrope } from "next/font/google"
import { Suspense } from "react"

const ebGaramond = EB_Garamond({ subsets: ["latin"], display: "swap", variable: "--font-eb-garamond" })
const specialElite = Special_Elite({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-special-elite",
})
const cinzel = Cinzel({ subsets: ["latin"], display: "swap", variable: "--font-cinzel" })
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope", weight: ["400", "700"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className={`${ebGaramond.variable} ${specialElite.variable} ${cinzel.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
