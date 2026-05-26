import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Life Engineering \u2014 a blog and newsletter by Yassen Shopov covering productivity, personal development, creativity, and intentional living.",
  keywords: [
    "blog",
    "life engineering",
    "productivity",
    "personal development",
    "newsletter",
    "Yassen Shopov",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog \u2022 Yassen Shopov",
    description:
      "Life Engineering \u2014 weekly stories, reflections and insights on productivity, creativity, and intentional living.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/resources/images/main_page/Main_Thumbnail.webp",
        width: 1200,
        height: 630,
        alt: "Life Engineering Blog by Yassen Shopov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog \u2022 Yassen Shopov",
    description:
      "Life Engineering \u2014 weekly stories, reflections and insights.",
    images: ["/resources/images/main_page/Main_Thumbnail.webp"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
