"use client"
import "./globals.css"
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const activeChainId = ChainId.BinanceSmartChainMainnet
  return (
    <html lang="en" data-theme="emerald">
      <head>
        <title>Pocket Wallet Stakking Dapp</title>
      </head>
      <ThirdwebProvider activeChain={activeChainId}>
        <body className={inter.className}>{children}</body>
      </ThirdwebProvider>
    </html>
  )
}
