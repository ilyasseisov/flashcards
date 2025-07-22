import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

// font declaration
export const rota = localFont({
  src: [
    // {
    //   path: "../public/fonts/Rota-Medium.otf",
    //   weight: "500",
    //   style: "normal",
    // },
    {
      path: "../public/fonts/Rota-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Rota-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-rota",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Flashcards",
  description: "A collection of flashcards for learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={rota.variable} lang="en">
      <body className="font-rota antialiased">{children}</body>
    </html>
  );
}
