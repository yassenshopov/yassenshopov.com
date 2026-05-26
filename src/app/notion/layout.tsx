import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notion Templates",
  description:
    "Browse premium Notion templates by Yassen Shopov \u2014 financial dashboards, resume builders, goal trackers, and more.",
  keywords: [
    "Notion templates",
    "Notion",
    "productivity",
    "financial dashboard",
    "resume builder",
    "Yassen Shopov",
  ],
  alternates: {
    canonical: "/notion",
  },
  openGraph: {
    title: "Notion Templates \u2022 Yassen Shopov",
    description:
      "Premium Notion templates for finances, resumes, goals, and productivity.",
    url: "/notion",
    type: "website",
    images: [
      {
        url: "/resources/images/notion/Ultimate_Investing_Dashboard.webp",
        width: 1200,
        height: 630,
        alt: "Notion Templates by Yassen Shopov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notion Templates \u2022 Yassen Shopov",
    description:
      "Premium Notion templates for finances, resumes, goals, and productivity.",
    images: ["/resources/images/notion/Ultimate_Investing_Dashboard.webp"],
  },
};

export default function NotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
