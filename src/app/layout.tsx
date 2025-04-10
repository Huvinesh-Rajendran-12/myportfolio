import type { Metadata } from "next";
import { Inter, Press_Start_2P, VT323 } from "next/font/google";
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

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323", // CSS variable for VT323
});

export const metadata: Metadata = {
  title: "Huvinesh's Portfolio", // Updated title
  description: "Let's make software awesome again.",
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
      <body className={`${inter.variable} ${pressStart2P.variable} ${vt323.variable}`}>
        {children}
      </body>
    </html>
  );
}
