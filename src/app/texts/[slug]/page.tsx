import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './post.module.css';

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

function getPost(slug: string): Post | null {
  const postsDirectory = path.join(process.cwd(), 'posts');
  
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const filenames = fs.readdirSync(postsDirectory);
  const filename = filenames.find(f => 
    f.replace(/\.(md|txt)$/, '') === slug
  );
  
  if (!filename) {
    return null;
  }

  const filePath = path.join(postsDirectory, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Extract title from first line if it starts with #
  const lines = fileContent.split('\n');
  const title = lines[0].startsWith('#') 
    ? lines[0].replace('#', '').trim()
    : slug.replace(/-/g, ' ').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  
  // Get file creation date
  const stats = fs.statSync(filePath);
  const date = stats.birthtime.toISOString().split('T')[0];
  
  return {
    slug,
    title,
    date,
    content: fileContent
  };
}

export default function Post({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  
  if (!post) {
    notFound();
  }

  // Convert content to simple HTML (basic markdown parsing)
  const htmlContent = post.content
    .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
    .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
    .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<h|<p)/gm, '<p>')
    .replace(/(?<!>)$/gm, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>)/g, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/g, '$1');

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h1>{post.title}</h1>
      </header>
      
      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      <footer className={styles.footer}>
        <Link href="/texts" className={styles.back}>
          ← escape
        </Link>
        <span className={styles.dateBottom}>{post.date}</span>
      </footer>
    </article>
  );
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  return filenames
    .filter(filename => filename.endsWith('.md') || filename.endsWith('.txt'))
    .map(filename => ({
      slug: filename.replace(/\.(md|txt)$/, '')
    }));
} 