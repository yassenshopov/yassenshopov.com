import type { Metadata } from "next";
import { Inter, Merriweather, Great_Vibes } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-merriweather",
});
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "Yassen Shopov",
  description: "Personal website of Yassen Shopov - Software Engineer and Content Creator",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/logo.svg", type: "image/svg+xml" }
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
        className={`${inter.variable} ${merriweather.variable} ${greatVibes.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
