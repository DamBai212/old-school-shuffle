import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Old School Shuffle";

export const metadata: Metadata = {
  title: siteName,
  description: "A retro-inspired Next.js starter with TypeScript and Docker."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
