const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const turndownService = new TurndownService();
const blogDir = path.join(__dirname, '../../blog');
const outputFile = path.join(__dirname, '../src/data/blog-posts.json');

function parseDate(dateStr, content) {
  const months = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12'
  };
  
  try {
    // First try to extract date from content
    const contentDateMatch = content.match(/^([A-Za-z]+ \d+, \d{4})/m);
    if (contentDateMatch) {
      dateStr = contentDateMatch[1];
    }

    const parts = dateStr.trim().split(' ');
    if (parts.length >= 3) {
      const month = months[parts[0]];
      const day = parts[1].replace(',', '').padStart(2, '0');
      const year = parts[2];
      if (!month || isNaN(parseInt(day)) || isNaN(parseInt(year))) {
        throw new Error('Invalid date format');
      }
      return `${year}-${month}-${day}`;
    }
    throw new Error('Invalid date format');
  } catch (e) {
    // If date parsing fails, try to extract year and month from the directory structure
    try {
      const stats = fs.statSync(path.join(blogDir, slug));
      return stats.mtime.toISOString().split('T')[0];
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  }
}

function extractPostData(htmlContent, slug) {
  const $ = cheerio.load(htmlContent);
  const title = $('article h1').first().text().replace(' :Emoji:', '');
  const tags = $('p#tags').text().split('•').map(tag => tag.trim()).filter(Boolean);
  const date = $('time#date').text();
  const author = $('p#author').text().replace('by ', '');
  const coverImage = $('article img').first().attr('src');
  
  // Remove newsletter signup forms and related articles
  $('div#mc_embed_signup').remove();
  $('aside').remove();
  
  // Get the main content
  const articleContent = $('article').clone();
  articleContent.find('h1').first().remove();
  articleContent.find('p#tags').remove();
  articleContent.find('time#date').remove();
  articleContent.find('p#author').remove();
  articleContent.find('img').first().remove();
  
  const content = turndownService.turndown(articleContent.html());

  return {
    slug,
    title: title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: content.split('\n')[0].slice(0, 160) + '...',
    date: parseDate(date, content),
    coverImage: coverImage ? coverImage.replace('../../', '/') : '/resources/images/blog/default-cover.webp',
    tags: tags.length ? tags : ['Uncategorized'],
    content,
    author: author || 'Yassen Shopov'
  };
}

async function migrateBlogPosts() {
  const blogPosts = [];
  const dirs = fs.readdirSync(blogDir)
    .filter(dir => fs.statSync(path.join(blogDir, dir)).isDirectory());

  for (const dir of dirs) {
    const htmlPath = path.join(blogDir, dir, 'index.html');
    if (fs.existsSync(htmlPath)) {
      try {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const postData = extractPostData(htmlContent, dir);
        blogPosts.push(postData);
        console.log(`✓ Migrated: ${dir}`);
      } catch (error) {
        console.error(`✗ Failed to migrate ${dir}:`, error.message);
      }
    }
  }

  const output = { posts: blogPosts.sort((a, b) => b.date.localeCompare(a.date)) };
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`\nSuccessfully migrated ${blogPosts.length} blog posts to ${outputFile}`);
}

migrateBlogPosts().catch(console.error); 