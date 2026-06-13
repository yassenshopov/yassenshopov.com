import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library Tier List",
  description:
    "A tier list of the books, films, and series consumed by Yassen Shopov \u2014 ranked from S to D.",
  alternates: {
    canonical: "/library/tier-list",
  },
  openGraph: {
    title: "Library Tier List \u2022 Yassen Shopov",
    description:
      "Books, movies, and series ranked into tiers by Yassen Shopov.",
    url: "/library/tier-list",
    type: "website",
    images: [
      {
        url: "/resources/images/main_page/Main_Thumbnail.webp",
        width: 1200,
        height: 630,
        alt: "Library Tier List by Yassen Shopov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Library Tier List \u2022 Yassen Shopov",
    description:
      "Books, movies, and series ranked into tiers by Yassen Shopov.",
    images: ["/resources/images/main_page/Main_Thumbnail.webp"],
  },
};

export default function LibraryTierListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
