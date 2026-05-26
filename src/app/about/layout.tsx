import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Yassen Shopov \u2014 a digital creator, software engineer, and Notion template designer passionate about productivity, creativity, and life design.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About \u2022 Yassen Shopov",
    description:
      "Learn about Yassen Shopov \u2014 a digital creator, software engineer, and Notion template designer passionate about productivity, creativity, and life design.",
    url: "/about",
    type: "profile",
    images: [
      {
        url: "/resources/images/main_page/YassenShopov.jpg",
        width: 500,
        height: 500,
        alt: "Yassen Shopov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About \u2022 Yassen Shopov",
    description:
      "Digital creator, software engineer, and Notion template designer.",
    images: ["/resources/images/main_page/YassenShopov.jpg"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
