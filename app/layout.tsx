import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cron Dashboard",
  description: "Aktive Cron-Jobs im Blick"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark">
      <body>{children}</body>
    </html>
  );
}
