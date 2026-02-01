import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FarcasterProvider from "./components/FarcasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: "PerpDex Airdrop Calculator",
  description: "ポイントとNFTのエアドロップ価値を計算するツール",
  manifest: "/manifest.json",
  openGraph: {
    title: "PerpDex Airdrop Calculator",
    description: "Calculate the value of PerpDex airdrop points and NFTs",
    type: "website",
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/og-image.svg",
    "fc:frame:button:1": "Open Calculator",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FarcasterProvider>{children}</FarcasterProvider>
      </body>
    </html>
  );
}
