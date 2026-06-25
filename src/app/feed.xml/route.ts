import blogData from '@/data/blog-posts.json';
import { toRFC822 } from '@/lib/format-date';

const SITE_URL = 'https://yassenshopov.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripMarkdown(md: string): string {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/---+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function GET() {
  const sortedPosts = [...blogData.posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestDate = sortedPosts[0]
    ? toRFC822(sortedPosts[0].date)
    : toRFC822(new Date().toISOString());

  const items = sortedPosts
    .map((post) => {
      const plainContent = stripMarkdown(post.content);
      const truncated =
        plainContent.length > 2000 ? plainContent.slice(0, 2000) + '\u2026' : plainContent;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${toRFC822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <content:encoded><![CDATA[${truncated}]]></content:encoded>
      <author>yassenshopov00@gmail.com (Yassen Shopov)</author>
${post.tags.map((tag: string) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
>
  <channel>
    <title>Life Engineering by Yassen Shopov</title>
    <link>${SITE_URL}/blog</link>
    <description>Weekly stories, reflections and insights on productivity, creativity, and intentional living.</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>Life Engineering by Yassen Shopov</title>
      <link>${SITE_URL}/blog</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
