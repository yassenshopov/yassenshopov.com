const SITE_URL = "https://yassenshopov.com";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yassen Shopov",
    url: SITE_URL,
    sameAs: [
      "https://github.com/yassenshopov",
      "https://linkedin.com/in/yassenshopov",
      "https://x.com/yassenshopov",
      "https://yassenshopov.gumroad.com",
    ],
    jobTitle: "Software Engineer",
    description:
      "Digital creator and developer building Notion templates, web applications, and digital solutions.",
    image: `${SITE_URL}/resources/images/main_page/YassenShopov.jpg`,
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Yassen Shopov",
    url: SITE_URL,
    description:
      "Personal website of Yassen Shopov — Software Engineer, Content Creator, and Notion Template Designer.",
    author: { "@type": "Person", name: "Yassen Shopov" },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  description: string;
  date: string;
  coverImage: string;
  author: string;
  slug: string;
  tags: string[];
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: post.author,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags,
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${SITE_URL}${item.href}`,
    })),
  };
}
