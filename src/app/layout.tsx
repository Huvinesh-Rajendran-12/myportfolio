import type { Metadata } from "next";
import { Inter, Press_Start_2P, VT323 } from "next/font/google";
import SoundToggle from "@/components/SoundToggle";
import { ThemeProvider } from "@/context/ThemeContext";
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
  title: "Huvinesh's Portfolio - Software Engineer",
  description: "Software Engineer specializing in AI, Healthcare, and Web Development. Explore my projects, skills, and experience in a unique synthwave-themed portfolio.",
  keywords: ["software engineer", "web development", "AI", "healthcare", "React", "Next.js", "TypeScript"],
  openGraph: {
    title: "Huvinesh's Portfolio - Software Engineer",
    description: "Software Engineer specializing in AI, Healthcare, and Web Development",
    type: "website",
    images: ["/unnamed.png"],
  },
  icons: {
    icon: "/unnamed.png",
    apple: "/unnamed.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical assets */}
        <link rel="preload" href="/sounds/startup.mp3" as="audio" type="audio/mpeg" />
        <link rel="preload" href="/sounds/keypress.mp3" as="audio" type="audio/mpeg" />
        <link rel="preload" href="/sounds/navigate.mp3" as="audio" type="audio/mpeg" />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href={`https://fonts.googleapis.com/css2?family=VT323&display=swap`}
          as="style"
        />
        <link
          rel="preload"
          href={`https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap`}
          as="style"
        />
      </head>
      <body className={`${inter.variable} ${pressStart2P.variable} ${vt323.variable}`}>
        <ThemeProvider>
          <SoundToggle />
          {/* Skip navigation link for accessibility */}
          <a 
            href="#main-content" 
            className="skip-nav-link"
            aria-label="Skip to main content"
          >
            Skip to main content
          </a>
          <main id="main-content">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
