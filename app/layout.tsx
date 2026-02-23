import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Colore.ar",
  description: "Colore.ar - Generá. Imprimí. Pintá.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Script
            src="/stats.js"
            data-website-id="7dbb19cc-b89c-4b9b-84e6-98df42fc191d"
            data-host-url={process.env.NEXT_PUBLIC_APP_URL}
            strategy="afterInteractive"
          />
          <Providers>
            <div className="mx-auto w-full max-w-lg p-4 min-h-screen">
              {children}
            </div>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
