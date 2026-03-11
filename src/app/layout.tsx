import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
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
  title: "SDD Navigator",
  description: "Specification-driven development coverage dashboard",
};

// @req SCD-UI-006
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <header className="border-b border-foreground/10 px-6 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-lg font-semibold">
                SDD Navigator
              </Link>
              <Link href="/requirements" className="text-sm hover:underline">
                Requirements
              </Link>
              <Link href="/tasks" className="text-sm hover:underline">
                Tasks
              </Link>
            </nav>
            <ThemeToggle />
          </header>
          <main className="px-6 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
