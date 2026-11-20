
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MentorLagbe | Smart Tuition & Mentorship",
    template: "%s | MentorLagbe",
  },
  description:
    "Discover trusted tutors, explore tuition opportunities, and find your perfect learning connection with MentorLagbe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#F7F4EC] antialiased`}
      >
        <Navbar />

        <main className="min-h-[calc(100vh-82px)]">
          {children}
        </main>

        <Footer />

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}
