import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description:
    "Books, films, and media consumed by Yassen Shopov \u2014 rated, reviewed, and catalogued for fellow curious minds.",
  alternates: {
    canonical: "/library",
  },
  openGraph: {
    title: "Library \u2022 Yassen Shopov",
    description:
      "Books, films, and media consumed and reviewed by Yassen Shopov.",
    url: "/library",
    type: "website",
    images: [
      {
        url: "/resources/images/main_page/Main_Thumbnail.webp",
        width: 1200,
        height: 630,
        alt: "Library by Yassen Shopov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Library \u2022 Yassen Shopov",
    description:
      "Books, films, and media consumed and reviewed by Yassen Shopov.",
    images: ["/resources/images/main_page/Main_Thumbnail.webp"],
  },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
