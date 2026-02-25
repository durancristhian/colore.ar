import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
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
        <body className={`${dmSans.variable} antialiased`}>
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
