import type { Metadata } from "next";
import { Inter, Press_Start_2P, VT323, Space_Mono } from "next/font/google";
import SoundToggle from "@/components/SoundToggle";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import "@/styles/design-improvements.css";

// Configure fonts using next/font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start-2p",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
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
    url: "https://portfolio.huvinesh.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Huvinesh Rajendran - Software Engineer Portfolio",
    description: "Software Engineer specializing in AI, Healthcare, and Web Development",
    images: ["/unnamed.png"],
  },
  icons: {
    icon: "/unnamed.png",
    apple: "/unnamed.png",
  },
  metadataBase: new URL("https://portfolio.huvinesh.com"),
  colorScheme: "dark",
  themeColor: "#2c3e50",
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
      <body className={`${inter.variable} ${pressStart2P.variable} ${vt323.variable} ${spaceMono.variable}`}>
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
