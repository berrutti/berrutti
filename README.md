# Hacker's Blog

A minimal blog built with web components, designed for speed and simplicity.

## Features

- **Zero npm dependencies** - No build step required
- **Web components** - Modular without the complexity
- **Minimal CSS** - Fast loading and mobile-friendly
- **GitHub Pages ready** - Deploy with a single push

## Structure

```
/
├── index.html          # Main blog page
├── about.html          # About page
├── styles.css          # Minimal stylesheet
└── components/
    ├── blog-nav.js     # Navigation web component
    └── blog-post.js    # Blog post web component
```

## How Web Components Work

This blog uses two custom web components:

### `<blog-nav>`
Creates a simple navigation bar. Usage:
```html
<blog-nav></blog-nav>
```

### `<blog-post>`
Formats blog posts with title, date, and content. Usage:
```html
<blog-post title="Post Title" date="2025-09-14" slug="post-slug">
    <p>Your blog post content goes here...</p>
</blog-post>
```

## Adding New Posts

1. Open `index.html`
2. Add a new `<blog-post>` element with your content
3. Commit and push to GitHub

## Deployment

This blog is designed to work with GitHub Pages:

1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your blog will be live at `https://username.github.io/repository-name`

## Philosophy

This blog embraces web standards and simplicity:
- HTML for structure
- CSS for styling  
- Minimal JavaScript for web components
- No frameworks, no build tools, no complexity

The result is a fast, accessible blog that works everywhere and loads instantly.
