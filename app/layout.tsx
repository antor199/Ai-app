import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import BackgroundVideo from "./components/BackgroundVideo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Ai copilot | AI Workspace",
  description: "A production-ready, cinematic AI workspace.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} antialiased font-sans bg-deep-gradient text-foreground min-h-screen selection:bg-primary-glow/30 relative`}>
        <BackgroundVideo />
        {children}
      </body>
    </html>
  );
}
