import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css"; // Global styles
import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import { ButtonSprinkles } from "@/shared/ui/ButtonSprinkles";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://awaluddin.dev"),
  title: {
    default: "Awaluddin | Backend Engineer",
    template: "%s | Awaluddin",
  },
  description:
    "Backend Developer portfolio featuring system architecture, distributed systems, and technical projects.",
  keywords: ["Backend Engineer", "Software Engineer", "System Architecture", "Node.js", "Awaluddin", "Portfolio"],
  authors: [{ name: "Awaluddin", url: "https://awaluddin.dev" }],
  creator: "Awaluddin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Awaluddin | Backend Engineer",
    description: "Backend Developer portfolio featuring system architecture and technical projects.",
    siteName: "Awaluddin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awaluddin | Backend Engineer",
    description: "Backend Developer portfolio featuring system architecture and technical projects.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased selection:bg-neu-accent/30"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <ButtonSprinkles />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
