import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work with me',
  description:
    'Hire Yassen Shopov to design and build your web product end to end — MVPs, web apps, dashboards, and redesigns shipped fast, by one person you can talk to.',
  alternates: {
    canonical: '/work-with-me',
  },
  openGraph: {
    title: 'Work with me • Yassen Shopov',
    description:
      'A product engineer who designs and builds web products end to end. Founders and teams hire me to turn ideas into fast, polished, shipped products.',
    url: '/work-with-me',
    type: 'website',
    images: [
      {
        url: '/resources/images/main_page/Main_Thumbnail.webp',
        width: 1200,
        height: 630,
        alt: 'Work with Yassen Shopov',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work with me • Yassen Shopov',
    description:
      'A product engineer who designs and builds web products end to end. Turn your idea into a shipped product.',
    images: ['/resources/images/main_page/Main_Thumbnail.webp'],
  },
};

export default function WorkWithMeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
