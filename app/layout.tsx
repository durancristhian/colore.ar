import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  description: "Colore.ar - Generate. Print. Paint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" /* className="dark" */>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="7dbb19cc-b89c-4b9b-84e6-98df42fc191d"
            strategy="afterInteractive"
          />
          <Providers>
            <div className="mx-auto w-full max-w-lg p-4">{children}</div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
