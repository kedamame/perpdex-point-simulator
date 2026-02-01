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
  description: "Calculate the value of PerpDex airdrop points and NFTs",
  manifest: "/manifest.json",
  metadataBase: new URL("https://perpdex-point-simulator.vercel.app"),
  openGraph: {
    title: "PerpDex Airdrop Calculator",
    description: "Calculate the value of PerpDex airdrop points and NFTs",
    type: "website",
    images: ["/image.png"],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://perpdex-point-simulator.vercel.app/image.png",
      button: {
        title: "Open Calculator",
        action: {
          type: "launch_frame",
          name: "PerpDexPointSimulator",
          url: "https://perpdex-point-simulator.vercel.app",
          splashImageUrl: "https://perpdex-point-simulator.vercel.app/splash.png",
          splashBackgroundColor: "#3b82f6",
        },
      },
    }),
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
