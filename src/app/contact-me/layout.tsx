import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Yassen Shopov \u2014 for collaborations, freelance projects, or just to say hi.',
  alternates: {
    canonical: '/contact-me',
  },
  openGraph: {
    title: 'Contact \u2022 Yassen Shopov',
    description:
      'Get in touch with Yassen Shopov for collaborations, freelance projects, or just to say hi.',
    url: '/contact-me',
    type: 'website',
    images: [
      {
        url: '/resources/images/main_page/Main_Thumbnail.webp',
        width: 1200,
        height: 630,
        alt: 'Contact Yassen Shopov',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact \u2022 Yassen Shopov',
    description: 'Get in touch with Yassen Shopov for collaborations or projects.',
    images: ['/resources/images/main_page/Main_Thumbnail.webp'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
