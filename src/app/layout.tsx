import type { Metadata } from "next";
import { Inter, Space_Grotesk, Great_Vibes, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { LoadingProvider } from '@/components/LoadingProvider';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yassen Shopov",
  description: "Personal website of Yassen Shopov - Software Engineer and Content Creator",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.svg", type: "image/svg+xml" }
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "Yassen Shopov • Life Engineering",
    description: "Hi there, I'm Yassen Shopov, and this is my website. I'm a Notion-certified blogger and content creator with a focus on self-improvement and life design.",
    images: ["https://yassenshopov.com/resources/images/main_page/Main_Thumbnail.webp"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${spaceGrotesk.variable} ${greatVibes.variable} ${outfit.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            <Navbar />
            {children}
          </LoadingProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
