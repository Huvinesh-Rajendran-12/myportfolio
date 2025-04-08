import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

// Configure fonts using next/font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // CSS variable for Inter (if needed elsewhere)
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start-2p", // CSS variable for Press Start 2P
});

export const metadata: Metadata = {
  title: "Retro Robot Portfolio [Sunset]", // Updated title
  description: "2D pixel robot portfolio with a synthwave sunset theme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply font variables to body */}
      {/* Default font set in globals.css, variables available if needed */}
      <body className={`${inter.variable} ${pressStart2P.variable}`}>
        {children}
      </body>
    </html>
  );
}
