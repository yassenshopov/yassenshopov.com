import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Art • Yassen Shopov',
  description:
    'Digital art portfolio by Yassen Shopov — illustrations, character work, and commissioned pieces. Open for commissions.',
  alternates: {
    canonical: 'https://yassenshopov.com/art',
  },
  openGraph: {
    title: 'Art • Yassen Shopov',
    description:
      'Digital art portfolio by Yassen Shopov — illustrations, character work, and commissioned pieces. Open for commissions.',
    url: 'https://yassenshopov.com/art',
    type: 'website',
    images: ['https://yassenshopov.com/resources/images/art/img1.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art • Yassen Shopov',
    description:
      'Digital art portfolio by Yassen Shopov — illustrations, character work, and commissioned pieces.',
    images: ['https://yassenshopov.com/resources/images/art/img1.webp'],
  },
};

export default function ArtLayout({ children }: { children: React.ReactNode }) {
  return children;
}
