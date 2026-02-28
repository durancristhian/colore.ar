// layout.tsx
//
// Root layout. Wraps the app with ClerkProvider (esES), DM Sans font, metadata,
// Providers, and Toaster. Renders the stats script and main content area.
//
import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Colore.ar",
  description: "Creá dibujos para colorear a medida, imprimilos y pintalos.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
          className={`${dmSans.variable} ${sourceSerif4.variable} ${ibmPlexMono.variable} antialiased`}
        >
          <Script
            src="/stats.js"
            data-website-id="7dbb19cc-b89c-4b9b-84e6-98df42fc191d"
            data-host-url={process.env.NEXT_PUBLIC_APP_URL}
            strategy="afterInteractive"
          />
          <Providers>
            <div className="flex min-h-dvh flex-col">{children}</div>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
