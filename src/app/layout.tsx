import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css"; // Global styles
import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import { ButtonSprinkles } from "@/shared/ui/ButtonSprinkles";

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
  title: "Awaluddin | Backend Engineer",
  description:
    "Backend Developer portfolio featuring system architecture and technical projects.",
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
      </body>
    </html>
  );
}
