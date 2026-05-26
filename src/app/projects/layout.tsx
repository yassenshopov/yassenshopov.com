import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore web applications and side projects built by Yassen Shopov \u2014 from productivity tools to creative experiments.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects \u2022 Yassen Shopov",
    description:
      "Web applications and side projects built by Yassen Shopov.",
    url: "/projects",
    type: "website",
    images: [
      {
        url: "/resources/images/main_page/Main_Thumbnail.webp",
        width: 1200,
        height: 630,
        alt: "Projects by Yassen Shopov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects \u2022 Yassen Shopov",
    description:
      "Web applications and side projects built by Yassen Shopov.",
    images: ["/resources/images/main_page/Main_Thumbnail.webp"],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
