import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "רפאל אלבז - קבלן שיפוצים ובנייה",
  description: "רפאל אלבז - קבלן שיפוצים ובנייה מקצועי באזור ירושלים והסביבה. מעל 15 שנות ניסיון.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
