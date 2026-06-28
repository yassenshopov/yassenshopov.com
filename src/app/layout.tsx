import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, Great_Vibes, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { LoadingProvider } from '@/components/LoadingProvider';
import { personJsonLd, webSiteJsonLd } from '@/lib/structured-data';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});
const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
});
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://yassenshopov.com'),
  title: {
    default: 'Yassen Shopov',
    template: '%s \u2022 Yassen Shopov',
  },
  description:
    'Personal website of Yassen Shopov \u2014 Software Engineer, Content Creator, and Notion Template Designer. Explore blog posts, projects, digital art, and productivity tools.',
  keywords: [
    'Yassen Shopov',
    'software engineer',
    'content creator',
    'Notion templates',
    'web development',
    'digital design',
    'productivity',
    'life engineering',
  ],
  authors: [{ name: 'Yassen Shopov', url: 'https://yassenshopov.com' }],
  creator: 'Yassen Shopov',
  publisher: 'Yassen Shopov',
  category: 'technology',
  applicationName: 'Yassen Shopov',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/logo.png', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Yassen Shopov \u2022 Life Engineering',
    description:
      'Digital creator and developer building Notion templates, web applications, and digital solutions that help people achieve their goals.',
    siteName: 'Yassen Shopov',
    locale: 'en_US',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/resources/images/main_page/Main_Thumbnail.webp',
        width: 1200,
        height: 630,
        alt: 'Yassen Shopov \u2014 Life Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yassen Shopov \u2022 Life Engineering',
    description:
      'Digital creator and developer building Notion templates, web applications, and digital solutions.',
    creator: '@yassenshopov',
    images: ['/resources/images/main_page/Main_Thumbnail.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${greatVibes.variable} ${outfit.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd(), webSiteJsonLd()]),
          }}
        />
        {/* Scroll-reveal elements start hidden and are un-hidden by JS once
            observed (see components/Reveal.tsx). Without JS the observer never
            runs, so force everything visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            {/* Global chrome (Navbar + Footer + <main id="main-content">) lives
                in the shared <Layout> component that every page wraps itself in,
                and in not-found.tsx. Rendering <Navbar> here too would duplicate
                the nav landmark on every page. */}
            {children}
          </LoadingProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
