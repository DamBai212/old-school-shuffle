import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Old School Shuffle";

export const metadata: Metadata = {
  title: siteName,
  description:
    "Playlist-led music writing, curated listening queues, and a stream-shaped after-hours blog built with Next.js."
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
