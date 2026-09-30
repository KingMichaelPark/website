# Ilkley Theme & Zola Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the website toolchain to Zola 0.23.x, remove the deleted `tabi` theme dependency, implement an Ilkley-inspired custom theme with direct templates and modular SCSS, preserve the `rach.css` banner, and verify zero build/check errors.

**Architecture:** Direct-site template architecture in `templates/` with modular SCSS in `sass/` compiled directly by Zola into `public/`. Dual-mode (Dark Gritstone & Light Sandstone) color palette managed via CSS custom properties and a lightweight vanilla JS switcher.

**Tech Stack:** Zola 0.23.x, Tera template engine, SCSS (via Zola's built-in Sass compiler), vanilla JavaScript, GitHub Actions (`shalzz/zola-deploy-action@v0.23.1`), Jujutsu (jj).

---

### Task 1: Update Zola Configuration & CI Workflow

**Files:**
- Modify: `.github/workflows/pages.yml`
- Modify: `config.toml`
- Verify: `.tool-versions`
- Verify: `mise.toml`

- [ ] **Step 1: Update GitHub Pages workflow action to v0.23.1**

Update `.github/workflows/pages.yml` so that GitHub Actions uses the latest Zola 0.23 deploy action release:

```yaml
---
name: Zola on GitHub Pages

on:
 push:
  branches:
   - main

jobs:
 build:
  name: Publish site
  runs-on: ubuntu-latest
  steps:
   - name: Checkout main
     uses: actions/checkout@v4
   - name: Build and deploy
     uses: shalzz/zola-deploy-action@v0.23.1
     env:
      GITHUB_TOKEN: ${{ secrets.RW }}
```

- [ ] **Step 2: Clean `config.toml` of tabi-specific settings**

Remove `theme = "tabi"` and outdated tabi theme configuration while retaining site metadata, menus, taxonomies, and highlighting:

```toml
# The URL the site will be built for
base_url = "https://mhpark.me"
title = "Mike's Blog"
description = "The personal, rarely updated, blog of Michael Park"

# Compile all Sass files in sass/
compile_sass = true
generate_feeds = true
feed_filenames = ["atom.xml", "rss.xml"]

taxonomies = [
    {name = "tags", feed = true},
    {name = "categories", feed = true},
]

[markdown]
highlight_code = true

[markdown.highlighting]
theme = "github-dark"
style = "class"

[extra]
email = "webmaster@mhpark.me"
base_url = "https://mhpark.me"
default_language = "en"

menu = [
    { name = "posts", url = "posts", trailing_slash = true },
    { name = "tags", url = "tags", trailing_slash = true },
    { name = "projects", url = "projects", trailing_slash = true },
    { name = "about-me", url = "about-me", trailing_slash = false },
]

socials = [
    { name = "bluesky", url = "https://bsky.app/profile/mhpark.me" },
    { name = "github", url = "https://github.com/KingMichaelPark/" },
    { name = "hacker-news", url = "https://news.ycombinator.com/user?id=Zizizizz" },
    { name = "mastodon", url = "https://fosstodon.org/@mdawg" },
]

[extra.author]
name = "Michael Park"
avatar = "me512.png"
```

- [ ] **Step 3: Run `zola check` to verify theme error is replaced by missing template errors**

Run: `zola check`
Expected: Zola no longer complains `Failed to load theme tabi`. It will report missing templates (e.g. `index.html`), confirming direct template resolution is active.

- [ ] **Step 4: Commit configuration update**

Run:
```bash
jj desc -m "build(config): update zola configuration and CI deploy action for 0.23.x"
jj new -m "feat(css): build Ilkley modular SCSS theme and restore rach banner"
```

---

### Task 2: Restore `rach.css` Banner & Build Ilkley SCSS Theme

**Files:**
- Modify: `sass/rach.css`
- Create: `sass/_variables.scss`
- Create: `sass/_base.scss`
- Create: `sass/_components.scss`
- Create: `sass/style.scss`

- [ ] **Step 1: Restore rotating banner animation in `sass/rach.css`**

Write the complete moving rotator banner styles to `sass/rach.css`:

```css
@-webkit-keyframes move {
  from {
    left: 100%;
  }
  to {
    left: 0%;
  }
}

@keyframes move {
  from {
    left: 100%;
  }
  to {
    left: 0%;
  }
}

.banner {
  height: 50px;
  max-height: 50px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  margin-bottom: 2rem;
}

a#rotator {
  text-decoration: none;
  height: 100%;
  padding-right: 20px;
  left: 100%;
  position: absolute;
  -webkit-animation: move 12s ease infinite alternate;
  animation: move 12s ease infinite alternate;
  display: flex;
  align-items: center;
}

a#rotator img {
  overflow: hidden;
  height: 42px;
  max-height: 42px;
  border-radius: 50%;
  transition: transform 0.5s ease;
}

a#rotator img:hover {
  transform: rotate(360deg);
}

@media (prefers-reduced-motion: reduce) {
  a#rotator {
    left: 50%;
    transform: translateX(-50%);
    animation: none;
  }
}
```

- [ ] **Step 2: Create `sass/_variables.scss` with Ilkley color tokens**

Create `sass/_variables.scss`:

```scss
// Typography
$font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
$font-mono: 'JetBrains Mono', 'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

// Dark theme defaults (Victorian gritstone, heather purple, River Wharfe blue)
:root {
  --color-bg: #1c1a19;
  --color-surface: #282523;
  --color-surface-hover: #34302d;
  --color-border: #3d3835;
  --color-text: #ede6dc;
  --color-text-muted: #aba194;
  --color-primary: #70a4c2;
  --color-primary-hover: #8fc0dc;
  --color-accent: #bf86cf;
  --color-accent-hover: #d2a1e0;
  --color-code-bg: #141312;
  --color-code-text: #ede6dc;
  --color-tag-bg: rgba(191, 134, 207, 0.15);
  --color-tag-text: #d8aee4;
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.4);
}

// Light theme overrides (Sunlit Yorkshire sandstone, dry moorland buff, deep river & heather)
[data-theme="light"] {
  --color-bg: #f7f4ef;
  --color-surface: #ffffff;
  --color-surface-hover: #faf8f5;
  --color-border: #e3dcd1;
  --color-text: #242220;
  --color-text-muted: #665f58;
  --color-primary: #1e5e80;
  --color-primary-hover: #14445e;
  --color-accent: #6b2f77;
  --color-accent-hover: #502159;
  --color-code-bg: #242220;
  --color-code-text: #f7f4ef;
  --color-tag-bg: rgba(107, 47, 119, 0.1);
  --color-tag-text: #6b2f77;
  --shadow-card: 0 2px 8px rgba(36, 34, 32, 0.08);
}

// Explicit dark theme selector
[data-theme="dark"] {
  --color-bg: #1c1a19;
  --color-surface: #282523;
  --color-surface-hover: #34302d;
  --color-border: #3d3835;
  --color-text: #ede6dc;
  --color-text-muted: #aba194;
  --color-primary: #70a4c2;
  --color-primary-hover: #8fc0dc;
  --color-accent: #bf86cf;
  --color-accent-hover: #d2a1e0;
  --color-code-bg: #141312;
  --color-code-text: #ede6dc;
  --color-tag-bg: rgba(191, 134, 207, 0.15);
  --color-tag-text: #d8aee4;
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 3: Create `sass/_base.scss` with layout & typography**

Create `sass/_base.scss`:

```scss
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: $font-sans;
  font-size: 1.0625rem;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

main.content {
  flex: 1 0 auto;
  padding-bottom: 3rem;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--color-text);
  line-height: 1.3;
  margin-top: 1.8rem;
  margin-bottom: 0.8rem;
  font-weight: 700;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }

a {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
  transition: color 0.15s ease;

  &:hover {
    color: var(--color-primary-hover);
  }
}

p {
  margin-top: 0;
  margin-bottom: 1.4rem;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

blockquote {
  margin: 1.5rem 0;
  padding: 0.75rem 1.25rem;
  border-left: 4px solid var(--color-accent);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-style: italic;

  p:last-child {
    margin-bottom: 0;
  }
}

hr {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: 2.5rem 0;
}
```

- [ ] **Step 4: Create `sass/_components.scss` for UI elements**

Create `sass/_components.scss`:

```scss
// Header & Navigation
header.site-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-title a {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.02em;

  &:hover {
    color: var(--color-primary);
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;

  a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;

    &:hover {
      color: var(--color-primary);
    }
  }
}

.theme-toggle-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: var(--color-surface-hover);
    border-color: var(--color-primary);
  }
}

// Author Bio (Home page)
.author-bio {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);

  img.author-avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 2px solid var(--color-accent);
    object-fit: cover;
    flex-shrink: 0;
  }

  .author-title {
    margin: 0 0 0.5rem;
    font-size: 1.75rem;
  }
}

// Post Listings
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
}

.post-meta {
  font-family: $font-mono;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.4rem;
}

.post-title {
  margin: 0 0 0.6rem;
  font-size: 1.35rem;

  a {
    color: var(--color-text);
    text-decoration: none;

    &:hover {
      color: var(--color-primary);
    }
  }
}

.post-summary {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 0.8rem;
}

.read-more {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }
}

// Badges & Taxonomies
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.tag-badge {
  font-family: $font-mono;
  font-size: 0.75rem;
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
    color: var(--color-tag-text);
  }
}

// Project Cards Grid
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary);
  }

  .project-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 0;
  }

  .project-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .project-title {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;

    a {
      color: var(--color-text);
      text-decoration: none;
      &:hover { color: var(--color-primary); }
    }
  }

  .project-desc {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    flex: 1;
    margin-bottom: 1rem;
  }
}

// Code Blocks & Copy Button
pre {
  background-color: var(--color-code-bg);
  color: var(--color-code-text);
  font-family: $font-mono;
  font-size: 0.9rem;
  padding: 1.25rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  overflow-x: auto;
  position: relative;
  margin: 1.5rem 0;

  code {
    background: none;
    padding: 0;
    font-size: inherit;
    color: inherit;
  }
}

:not(pre) > code {
  font-family: $font-mono;
  font-size: 0.88em;
  padding: 0.2em 0.4em;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-accent);
}

.copy-code-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-family: $font-mono;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease, color 0.15s ease;

  &:hover {
    opacity: 1;
    color: var(--color-text);
  }

  &.copied {
    color: #81b29a;
    border-color: #81b29a;
  }
}

// Pagination
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
  margin-top: 2rem;
  font-family: $font-mono;
  font-size: 0.9rem;

  a {
    text-decoration: none;
    font-weight: 600;
  }
}

// Footer
footer.site-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 2.5rem 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;

  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .social-links {
    display: flex;
    gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;

    a {
      color: var(--color-text-muted);
      text-decoration: none;

      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
```

- [ ] **Step 5: Create `sass/style.scss` entry point**

Create `sass/style.scss` linking variables, base, components, and rach:

```scss
@import "variables";
@import "base";
@import "components";
@import "rach.css";
```

- [ ] **Step 6: Commit SCSS and banner implementation**

Run:
```bash
jj desc -m "feat(css): build Ilkley modular SCSS theme and restore rach banner"
jj new -m "feat(js): add theme switcher and code block copy scripts"
```

---

### Task 3: Client-side Interactivity (Theme Switcher & Copy Code)

**Files:**
- Create: `static/js/theme.js`
- Create: `static/js/copy-code.js`

- [ ] **Step 1: Create `static/js/theme.js`**

Create `static/js/theme.js` to manage light/dark toggling, localStorage persistence, and button state:

```javascript
(function () {
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    setTheme(current);
  });
})();
```

- [ ] **Step 2: Create `static/js/copy-code.js`**

Create `static/js/copy-code.js` to enhance code blocks with a copy button:

```javascript
document.addEventListener('DOMContentLoaded', function () {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(function (block) {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.type = 'button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code snippet to clipboard');

    button.addEventListener('click', function () {
      const code = block.querySelector('code');
      const text = code ? code.innerText : block.innerText;

      navigator.clipboard.writeText(text).then(function () {
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(function () {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        button.textContent = 'Failed';
      });
    });

    block.appendChild(button);
  });
});
```

- [ ] **Step 3: Commit JavaScript additions**

Run:
```bash
jj desc -m "feat(js): add theme switcher and code block copy scripts"
jj new -m "feat(templates): implement Ilkley Tera templates"
```

---

### Task 4: Root & Base Templates

**Files:**
- Create: `templates/base.html`
- Create: `templates/404.html`
- Delete / replace unused tabi partial overrides: `templates/partials/nav.html`, `templates/partials/header.html`

- [ ] **Step 1: Create `templates/base.html`**

Create `templates/base.html` with full metadata, FOUC prevention, header, banner rotator, content block, and footer:

```html
<!DOCTYPE html>
<html lang="{{ lang | default(value='en') }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}{{ config.title }}{% if page.title %} • {{ page.title }}{% elif section.title %} • {{ section.title }}{% endif %}{% endblock title %}</title>
  
  <meta name="description" content="{% if page.description %}{{ page.description }}{% elif section.description %}{{ section.description }}{% else %}{{ config.description }}{% endif %}">
  
  <!-- Pre-hydration theme setter to prevent FOUC -->
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>

  <!-- Typography & Styles -->
  <link rel="preconnect" href="https://rsms.me/">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <link rel="stylesheet" href="{{ get_url(path='style.css', cachebust=true) | safe }}">

  <!-- Feeds -->
  {% if config.generate_feeds %}
    <link rel="alternate" type="application/atom+xml" title="{{ config.title }} - Atom Feed" href="{{ get_url(path='atom.xml', trailing_slash=false) | safe }}">
    <link rel="alternate" type="application/rss+xml" title="{{ config.title }} - RSS Feed" href="{{ get_url(path='rss.xml', trailing_slash=false) | safe }}">
  {% endif %}

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="{{ get_url(path='fav/favicon.ico') | safe }}">

  {% block extra_head %}{% endblock extra_head %}
</head>
<body>
  <div class="site-wrapper">
    <header class="site-header">
      <div class="container">
        <nav class="navbar">
          <div class="nav-title">
            <a href="{{ get_url(path='/') }}">{{ config.title }}</a>
          </div>
          <ul class="nav-links">
            {% if config.extra.menu %}
              {% for item in config.extra.menu %}
                <li>
                  <a href="{{ get_url(path=item.url, trailing_slash=item.trailing_slash | default(value=true)) }}">{{ item.name }}</a>
                </li>
              {% endfor %}
            {% endif %}
            <li>
              <button id="theme-toggle" class="theme-toggle-btn" onclick="toggleTheme()" type="button" aria-label="Toggle dark/light theme">🌙</button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Preserved Rotating Banner -->
      <div class="banner">
        <a id="rotator" href="{{ get_url(path='/') }}" title="Home">
          <img src="{{ get_url(path='me.webp', trailing_slash=false) | safe }}" alt="Michael Park avatar" />
        </a>
      </div>
    </header>

    <main class="content container">
      {% block content %}{% endblock content %}
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <span>&copy; {{ now() | date(format="%Y") }} {{ config.extra.author.name }}. Built with <a href="https://www.getzola.org" rel="external">Zola</a>.</span>
        </div>
        <ul class="social-links">
          {% if config.extra.socials %}
            {% for s in config.extra.socials %}
              <li><a href="{{ s.url }}" rel="me external">{{ s.name }}</a></li>
            {% endfor %}
          {% endif %}
          {% if config.generate_feeds %}
            <li><a href="{{ get_url(path='atom.xml', trailing_slash=false) | safe }}">rss</a></li>
          {% endif %}
        </ul>
      </div>
    </footer>
  </div>

  <script src="{{ get_url(path='js/theme.js', cachebust=true) | safe }}" defer></script>
  <script src="{{ get_url(path='js/copy-code.js', cachebust=true) | safe }}" defer></script>
</body>
</html>
```

- [ ] **Step 2: Clean up obsolete partials and create `templates/404.html`**

Remove the outdated `templates/partials/nav.html` and `templates/partials/header.html` (which depended on deleted tabi macros).
Create `templates/404.html`:

```html
{% extends "base.html" %}

{% block title %}404 - Page Not Found • {{ config.title }}{% endblock title %}

{% block content %}
<div style="text-align: center; padding: 4rem 0;">
  <h1>404</h1>
  <p style="color: var(--color-text-muted); font-size: 1.25rem;">Looks like you've wandered out onto the moors. This page doesn't exist.</p>
  <p><a href="{{ get_url(path='/') }}" class="read-more">&larr; Return to Home</a></p>
</div>
{% endblock content %}
```

---

### Task 5: Content Templates (Index, Section, Page, Cards)

**Files:**
- Create: `templates/index.html`
- Create: `templates/section.html`
- Create: `templates/page.html`
- Create: `templates/cards.html`

- [ ] **Step 1: Create `templates/index.html`**

Create `templates/index.html` with author bio and recent posts list:

```html
{% extends "base.html" %}

{% block content %}
<div class="author-bio">
  <img src="{{ get_url(path=config.extra.author.avatar) }}" alt="{{ config.extra.author.name }}" class="author-avatar" />
  <div>
    <h1 class="author-title">{{ section.extra.header.title | default(value="Hello!") }}</h1>
    <div class="author-intro">
      {{ section.content | safe }}
    </div>
  </div>
</div>

<section class="recent-posts">
  <h2>Recent Posts</h2>
  {% set posts_section = get_section(path="posts/_index.md") %}
  <ul class="post-list">
    {% for post in posts_section.pages | slice(end=section.extra.max_posts | default(value=5)) %}
      <li class="post-item">
        <div class="post-meta">
          <time datetime="{{ post.date }}">{{ post.date | date(format="%d %B %Y") }}</time>
          {% if post.reading_time %}
            <span>&bull;</span>
            <span>{{ post.reading_time }} min read</span>
          {% endif %}
        </div>
        <h3 class="post-title"><a href="{{ post.permalink }}">{{ post.title }}</a></h3>
        {% if post.summary %}
          <div class="post-summary">{{ post.summary | safe }}</div>
        {% elif post.description %}
          <div class="post-summary">{{ post.description }}</div>
        {% endif %}
        <a href="{{ post.permalink }}" class="read-more">Read article &rarr;</a>
      </li>
    {% endfor %}
  </ul>
  <div style="margin-top: 1.5rem;">
    <a href="{{ get_url(path='posts/') }}" class="read-more">View all posts &rarr;</a>
  </div>
</section>
{% endblock content %}
```

- [ ] **Step 2: Create `templates/section.html` with pagination**

Create `templates/section.html` to support `/posts/`:

```html
{% extends "base.html" %}

{% block content %}
<header style="margin-bottom: 2rem;">
  <h1>{{ section.title | default(value="Posts") }}</h1>
  {% if section.description %}
    <p style="color: var(--color-text-muted);">{{ section.description }}</p>
  {% endif %}
</header>

<ul class="post-list">
  {% for post in paginator.pages %}
    <li class="post-item">
      <div class="post-meta">
        <time datetime="{{ post.date }}">{{ post.date | date(format="%d %B %Y") }}</time>
        {% if post.reading_time %}
          <span>&bull;</span>
          <span>{{ post.reading_time }} min read</span>
        {% endif %}
        {% if post.taxonomies.tags %}
          <span>&bull;</span>
          {% for tag in post.taxonomies.tags %}
            <a href="{{ get_taxonomy_url(kind='tags', term=tag) }}" class="tag-badge">#{{ tag }}</a>
          {% endfor %}
        {% endif %}
      </div>
      <h2 class="post-title"><a href="{{ post.permalink }}">{{ post.title }}</a></h2>
      {% if post.summary %}
        <div class="post-summary">{{ post.summary | safe }}</div>
      {% elif post.description %}
        <div class="post-summary">{{ post.description }}</div>
      {% endif %}
      <a href="{{ post.permalink }}" class="read-more">Read article &rarr;</a>
    </li>
  {% endfor %}
</ul>

{% if paginator.number_pagers > 1 %}
  <nav class="pagination">
    <div>
      {% if paginator.previous %}
        <a href="{{ paginator.previous }}">&larr; Newer Posts</a>
      {% endif %}
    </div>
    <span>Page {{ paginator.current_index }} of {{ paginator.number_pagers }}</span>
    <div>
      {% if paginator.next %}
        <a href="{{ paginator.next }}">Older Posts &rarr;</a>
      {% endif %}
    </div>
  </nav>
{% endif %}
{% endblock content %}
```

- [ ] **Step 3: Create `templates/page.html` for single post reading**

Create `templates/page.html`:

```html
{% extends "base.html" %}

{% block content %}
<article class="post-article">
  <header style="margin-bottom: 2rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem;">
    <h1>{{ page.title }}</h1>
    <div class="post-meta">
      {% if page.date %}
        <time datetime="{{ page.date }}">{{ page.date | date(format="%d %B %Y") }}</time>
      {% endif %}
      {% if page.reading_time %}
        <span>&bull;</span>
        <span>{{ page.reading_time }} min read</span>
      {% endif %}
      {% if page.taxonomies.categories %}
        <span>&bull;</span>
        {% for cat in page.taxonomies.categories %}
          <a href="{{ get_taxonomy_url(kind='categories', term=cat) }}" class="tag-badge">{{ cat }}</a>
        {% endfor %}
      {% endif %}
    </div>
    {% if page.taxonomies.tags %}
      <div class="tags-list">
        {% for tag in page.taxonomies.tags %}
          <a href="{{ get_taxonomy_url(kind='tags', term=tag) }}" class="tag-badge">#{{ tag }}</a>
        {% endfor %}
      </div>
    {% endif %}
  </header>

  <div class="post-content">
    {{ page.content | safe }}
  </div>

  <footer style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
    <a href="{{ get_url(path='posts/') }}" class="read-more">&larr; Back to all posts</a>
  </footer>
</article>
{% endblock content %}
```

- [ ] **Step 4: Create `templates/cards.html` for `/projects/`**

Create `templates/cards.html`:

```html
{% extends "base.html" %}

{% block content %}
<header style="margin-bottom: 2rem;">
  <h1>{{ section.title }}</h1>
  {% if section.content %}
    <div>{{ section.content | safe }}</div>
  {% endif %}
</header>

<div class="projects-grid">
  {% for page in section.pages %}
    <article class="project-card">
      {% if page.extra.local_image %}
        <img src="{{ get_url(path=page.extra.local_image) }}" alt="{{ page.title }}" class="project-img" />
      {% endif %}
      <div class="project-body">
        <h2 class="project-title"><a href="{{ page.permalink }}">{{ page.title }}</a></h2>
        {% if page.description %}
          <p class="project-desc">{{ page.description }}</p>
        {% endif %}
        {% if page.taxonomies.tags %}
          <div class="tags-list" style="margin-bottom: 1rem;">
            {% for tag in page.taxonomies.tags %}
              <span class="tag-badge">#{{ tag }}</span>
            {% endfor %}
          </div>
        {% endif %}
        <div>
          {% if page.extra.canonical_url %}
            <a href="{{ page.extra.canonical_url }}" class="read-more" rel="external">View on GitHub &rarr;</a>
          {% else %}
            <a href="{{ page.permalink }}" class="read-more">Learn more &rarr;</a>
          {% endif %}
        </div>
      </div>
    </article>
  {% endfor %}
</div>
{% endblock content %}
```

---

### Task 6: Taxonomy Templates (Tags & Categories)

**Files:**
- Create: `templates/taxonomy_list.html`
- Create: `templates/taxonomy_single.html`

- [ ] **Step 1: Create `templates/taxonomy_list.html`**

Create `templates/taxonomy_list.html`:

```html
{% extends "base.html" %}

{% block content %}
<header style="margin-bottom: 2rem;">
  <h1>{{ taxonomy.name | capitalize }}</h1>
</header>

<div class="tags-list" style="gap: 0.75rem;">
  {% for term in terms %}
    <a href="{{ term.permalink }}" class="tag-badge" style="font-size: 0.95rem; padding: 0.4rem 0.8rem;">
      {{ term.name }} <span style="opacity: 0.7;">({{ term.pages | length }})</span>
    </a>
  {% endfor %}
</div>
{% endblock content %}
```

- [ ] **Step 2: Create `templates/taxonomy_single.html`**

Create `templates/taxonomy_single.html`:

```html
{% extends "base.html" %}

{% block content %}
<header style="margin-bottom: 2rem;">
  <p style="color: var(--color-text-muted); font-family: var(--font-mono); margin-bottom: 0.25rem;">{{ taxonomy.name | capitalize }}</p>
  <h1>#{{ term.name }}</h1>
  <p style="color: var(--color-text-muted);">{{ term.pages | length }} post{% if term.pages | length > 1 %}s{% endif %}</p>
</header>

<ul class="post-list">
  {% for post in term.pages %}
    <li class="post-item">
      <div class="post-meta">
        <time datetime="{{ post.date }}">{{ post.date | date(format="%d %B %Y") }}</time>
        {% if post.reading_time %}
          <span>&bull;</span>
          <span>{{ post.reading_time }} min read</span>
        {% endif %}
      </div>
      <h2 class="post-title"><a href="{{ post.permalink }}">{{ post.title }}</a></h2>
      {% if post.summary %}
        <div class="post-summary">{{ post.summary | safe }}</div>
      {% elif post.description %}
        <div class="post-summary">{{ post.description }}</div>
      {% endif %}
      <a href="{{ post.permalink }}" class="read-more">Read article &rarr;</a>
    </li>
  {% endfor %}
</ul>

<div style="margin-top: 2rem;">
  <a href="{{ get_url(path=taxonomy.name) }}" class="read-more">&larr; All {{ taxonomy.name }}</a>
</div>
{% endblock content %}
```

- [ ] **Step 3: Commit templates implementation**

Run:
```bash
jj desc -m "feat(templates): implement Ilkley Tera templates"
jj new -m "chore(build): verify site check and build with Zola 0.23.6"
```

---

### Task 7: Comprehensive Verification & Route Testing

**Files:**
- Verify: Site build outputs

- [ ] **Step 1: Execute `zola check`**

Run: `zola check` in `/Users/mike/Personal/website`
Expected: `Checked site in ...: 0 errors.`

- [ ] **Step 2: Execute `zola build`**

Run: `zola build` in `/Users/mike/Personal/website`
Expected: `Building site... -> Success: Site built in public/`.

- [ ] **Step 3: Validate generated routes and assets**

Check that key output files exist and contain valid markup:
- `public/index.html` contains `me512.png` and rotator banner markup
- `public/style.css` contains compiled Ilkley CSS custom properties
- `public/posts/index.html` contains post summaries
- `public/projects/index.html` contains project cards
- `public/tags/index.html` contains tag badges
- `public/404.html` contains 404 text
- `public/atom.xml` and `public/rss.xml` exist

- [ ] **Step 4: Final commit and jj status check**

Run:
```bash
jj desc -m "chore(build): verify site check and build with Zola 0.23.6"
jj --no-pager status
```
Expected: Clean working copy snapshot on trunk.
