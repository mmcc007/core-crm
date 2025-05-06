import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "B2B CRM",
  description: "A simplified B2B CRM application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-xl font-bold text-gray-900">B2B CRM</h1>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
