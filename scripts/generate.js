#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const BLOG_CONFIG = {
  title: 'Matias Berrutti',
  description: 'Thoughts on technology, programming, and digital minimalism',
  baseUrl: 'https://yourusername.github.io/berrutti',
  author: 'Matias Berrutti',
  language: 'en-us'
};

function extractPostMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const titleMatch = content.match(/<title>(.*?) - Matias Berrutti<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'Untitled';
  
  const titleRegex = /<h1 class="post-title">([^<]*)<\/h1>/;
  const dateRegex = /<time class="post-date" datetime="([^"]*)">/;
  
  const titleFromH1 = content.match(titleRegex);
  const dateFromTime = content.match(dateRegex);
  
  if (!titleFromH1 || !dateFromTime) {
    console.warn(`Could not extract metadata from ${filePath}`);
    return null;
  }
  
  const dateStr = dateFromTime[1];
  const slug = path.basename(filePath, '.html');
  
  const descMatch = content.match(/<p>(.*?)<\/p>/);
  const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '') : '';
  
  const relativePath = path.relative(process.cwd(), filePath);
  const url = `${BLOG_CONFIG.baseUrl}/${relativePath}`;
  
  return {
    title,
    description,
    url,
    guid: url,
    date: new Date(dateStr),
    pubDate: new Date(dateStr).toUTCString()
  };
}

function generateRSS(posts) {
  const sortedPosts = posts.sort((a, b) => b.date - a.date);
  const lastBuildDate = new Date().toUTCString();
  
  const rssItems = sortedPosts.map(post => `
        <item>
            <title>${escapeXML(post.title)}</title>
            <description>${escapeXML(post.description)}</description>
            <link>${post.url}</link>
            <guid>${post.guid}</guid>
            <pubDate>${post.pubDate}</pubDate>
        </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>${escapeXML(BLOG_CONFIG.title)}</title>
        <description>${escapeXML(BLOG_CONFIG.description)}</description>
        <link>${BLOG_CONFIG.baseUrl}</link>
        <language>${BLOG_CONFIG.language}</language>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        ${rssItems}
    </channel>
</rss>`;
}

function generateArchive(posts) {
  const sortedPosts = posts.sort((a, b) => b.date - a.date);
  
  const postsByYear = sortedPosts.reduce((acc, post) => {
    const year = post.date.getFullYear();
    const month = post.date.toLocaleDateString('en-US', { month: 'long' });
    const yearMonth = `${month} ${year}`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(post);
    return acc;
  }, {});
  
  const archiveItems = Object.entries(postsByYear).map(([yearMonth, posts]) => {
    const postList = posts.map(post => {
      const day = post.date.getDate();
      const relativePath = path.relative(process.cwd(), post.url.replace(BLOG_CONFIG.baseUrl + '/', ''));
      return `                    <li><a href="${relativePath}">${post.title}</a> <span class="archive-date">– ${yearMonth.split(' ')[0]} ${day}</span></li>`;
    }).join('\n');
    
    return `                <h3>${yearMonth}</h3>
                <ul>
${postList}
                </ul>`;
  }).join('\n                \n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Archive - Matias Berrutti</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="blog-nav">
        <a href="index.html" class="nav-home">Home</a>
        <a href="about.html">About</a>
        <a href="archive.html">Archive</a>
        <a href="rss.xml">RSS</a>
    </nav>
    
    <main>
        <header>
            <h1>Archive</h1>
            <p>All posts, organized by date</p>
        </header>
        
        <article class="blog-post">
            <div class="post-content">
${archiveItems}
                
                <p class="archive-footer">More posts coming soon...</p>
            </div>
        </article>
    </main>

</body>
</html>`;
}

function escapeXML(str) {
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function main() {
  console.log('🔍 Scanning for blog posts...');
  
  const postFiles = await glob('posts/**/*.html');
  
  if (postFiles.length === 0) {
    console.warn('⚠️  No blog posts found in posts/ directory');
    return;
  }
  
  console.log(`📝 Found ${postFiles.length} blog posts`);
  
  const posts = [];
  for (const file of postFiles) {
    const metadata = extractPostMetadata(file);
    if (metadata) {
      posts.push(metadata);
      console.log(`   ✓ ${metadata.title} (${metadata.date.toDateString()})`);
    }
  }
  
  if (posts.length === 0) {
    console.error('❌ No valid blog posts found');
    return;
  }
  
  const rssXML = generateRSS(posts);
  const archiveHTML = generateArchive(posts);
  
  fs.writeFileSync('rss.xml', rssXML);
  fs.writeFileSync('archive.html', archiveHTML);
  
  console.log(`✅ Generated RSS feed with ${posts.length} posts -> rss.xml`);
  console.log(`✅ Generated archive page with ${posts.length} posts -> archive.html`);
}

main().catch(console.error);