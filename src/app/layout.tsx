import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css"; // Global styles
import { ButtonSprinkles } from "@/shared/ui/ButtonSprinkles";
import { ChatWidget } from "@/widgets/chat/ChatWidget";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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
  metadataBase: new URL(process.env.SITE_URL || "https://awaluddin.dev"),
  title: {
    default: "Awaluddin | Backend Engineer",
    template: "%s | Awaluddin",
  },
  description:
    "Backend Developer portfolio featuring system architecture, distributed systems, and technical projects.",
  keywords: [
    "Backend Engineer",
    "Software Engineer",
    "System Architecture",
    "Node.js",
    "Awaluddin",
    "Portfolio",
  ],
  authors: [{ name: "Awaluddin", url: "https://awaluddin.dev" }],
  creator: "Awaluddin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Awaluddin | Backend Engineer",
    description:
      "Backend Developer portfolio featuring system architecture and technical projects.",
    siteName: "Awaluddin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awaluddin | Backend Engineer",
    description:
      "Backend Developer portfolio featuring system architecture and technical projects.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231B262C'/><text x='50%' y='55%' dominant-baseline='central' text-anchor='middle' font-size='56' font-family='sans-serif' font-weight='bold' fill='%233282B8'>A</text><circle cx='80' cy='20' r='10' fill='%2314FFEC'/></svg>",
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
      className={`dark bg-canvas text-primary ${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased selection:bg-subtle selection:text-primary min-h-screen bg-canvas text-secondary"
        suppressHydrationWarning
      >
        {children}
        <ButtonSprinkles />
        <ChatWidget />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
