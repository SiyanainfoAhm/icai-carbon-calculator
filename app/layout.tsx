import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICAI Carbon Emission Calculator",
  description: "A standardized GHG emission reporting and monitoring portal for ICAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} data-design-theme="modern_esg" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
