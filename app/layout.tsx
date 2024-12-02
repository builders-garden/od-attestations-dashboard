import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Inter_Tight } from "next/font/google";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Onchain Dreamers Passport",
  description: "The Onchain Dreamers Passport App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} font-inter antialiased`}>
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
