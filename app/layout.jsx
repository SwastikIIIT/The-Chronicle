import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Chronicle",
  description: "Security system.Provides complete user's login history with time stampings and user agent profile. ",
  icons: {
    shortcut:"/favicon.svg"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
      <SessionWrapper>
        {children}
        </SessionWrapper>
        <Toaster />
      </body>
    </html>
  );
}
