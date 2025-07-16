import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import styles from './texts.module.css';

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

function getPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'posts');
  
  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter(filename => filename.endsWith('.md') || filename.endsWith('.txt'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const slug = filename.replace(/\.(md|txt)$/, '');
      
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
    });

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function Texts() {
  const posts = getPosts();

  return (
    <div className={styles.container}>
      <h1>texts</h1>
      
      {posts.length === 0 ? (
        <p>no posts yet. add .md or .txt files to the posts folder to get started.</p>
      ) : (
        <div className={styles.posts}>
          {posts.map(post => (
            <article key={post.slug} className={styles.post}>
              <Link href={`/texts/${post.slug}`}>
                <h2>{post.title}</h2>
                <div className={styles.date}>{post.date}</div>
                <div className={styles.preview}>
                  {post.content.replace(/^#.*\n/, '').substring(0, 200)}...
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
      
      <Link href="/" className={styles.back}>
        ← return
      </Link>
    </div>
  );
} 