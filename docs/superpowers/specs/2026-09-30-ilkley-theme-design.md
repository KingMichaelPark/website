# Design Spec: Custom Ilkley Theme & Zola Modernization

## 1. Overview
This project upgrades the personal website/blog (`mhpark.me`) to the latest version of Zola (v0.23.x), replaces the external `tabi` theme with a custom direct-site theme inspired by Ilkley, West Yorkshire, preserves the custom animated rotator banner in `sass/rach.css`, and implements clean Tera templates and modular SCSS styles.

## 2. Goals & Success Criteria
- **Zola Modernization:** Update deployment configurations to build seamlessly on Zola 0.23.x locally (`mise` / `.tool-versions`) and on GitHub Pages CI (`.github/workflows/pages.yml`).
- **Autonomous Direct-Site Theme:** Remove dependencies on `themes/tabi`; templates live directly in `templates/` and styling in `sass/`.
- **Ilkley Visual Aesthetic:** A Yorkshire-inspired palette (Victorian gritstone, purple heather, River Wharfe blue, bluebell woods, dusty moorland sandstone) with dual-mode (Dark & Light) support and manual toggle.
- **Typography:** Modern clean sans-serif (`Inter` / system stack) paired with developer monospace (`JetBrains Mono` / `Cascadia Code` / system mono) for code and technical accents.
- **Rotator Banner Preservation:** Retain the moving/rotating banner from `rach.css` under the navigation bar.
- **Interactive Enhancements:** Lightweight theme switcher with system preference detection and FOUC prevention; clipboard copy button for code blocks.
- **Zero Broken Links or Templates:** All 20+ posts, project cards (`/projects/`), `/about-me/`, taxonomy listings (`/tags/`, `/categories/`), feeds (`atom.xml`, `rss.xml`), and 404 page render error-free under `zola check` and `zola build`.

## 3. Architecture & Project Layout

```
.
├── .github/
│   └── workflows/
│       └── pages.yml                # Shalzz Zola deploy action updated to v0.23.1
├── .tool-versions                   # zola latest
├── mise.toml                        # zola = "latest" (0.23.6)
├── config.toml                      # Updated configuration without theme = "tabi"
├── content/                         # Markdown content (posts, projects, about-me)
├── sass/
│   ├── style.scss                   # Main SCSS entry point compiled by Zola
│   ├── _variables.scss              # Color tokens, fonts, spacing, theme variables
│   ├── _base.scss                   # Reset, typography, layout container (max-width: 760px)
│   ├── _components.scss             # Post lists, cards, tags, pagination, code blocks, footer
│   └── rach.css                     # Preserved moving banner & rotator styling
├── static/
│   ├── js/
│   │   ├── theme.js                 # Theme switcher & local storage persistence
│   │   └── copy-code.js             # Code block copy button
│   ├── me.webp                      # Rotator banner avatar asset
│   └── me512.png                    # Home page profile image
└── templates/
    ├── base.html                    # Root skeleton (head, header, nav, banner, main, footer)
    ├── index.html                   # Home page (bio + recent posts)
    ├── page.html                    # Single post layout with metadata & tags
    ├── section.html                 # Post listing with pagination
    ├── cards.html                   # Project gallery card grid
    ├── taxonomy_list.html           # Taxonomy index (tags, categories)
    ├── taxonomy_single.html         # Posts tagged with specific term
    ├── 404.html                     # Custom 404 page
    └── shortcodes/
        └── resize_image.html        # Image resize shortcode helper
```

## 4. Visual Design & Theme System

### 4.1 Color Tokens & Ilkley Palette
The theme defines CSS custom properties bound to `data-theme="dark"` and `data-theme="light"`:

| Token | Dark Mode (Victorian Gritstone) | Light Mode (Moorland Sandstone) | Note / Inspiration |
|-------|---------------------------------|---------------------------------|-------------------|
| `--color-bg` | `#1c1a19` | `#f6f2ec` | Weathered gritstone / Sunlit moorland sandstone |
| `--color-surface` | `#282523` | `#ffffff` | Dark stone surface / Clean card background |
| `--color-border` | `#3d3835` | `#e0d8cc` | Mortar seam / Sandstone border |
| `--color-text` | `#ede6dc` | `#242220` | Dusty moorland / Dark Victorian stone |
| `--color-text-muted` | `#aba194` | `#615952` | Lichen / Peat earth |
| `--color-primary` | `#70a4c2` | `#1e5e80` | River Wharfe cool water blue |
| `--color-accent` | `#bf86cf` | `#6b2f77` | Yorkshire heather bloom / violet |
| `--color-code-bg` | `#141312` | `#242220` | Charcoal slate / High contrast dark code block |
| `--color-code-text` | `#e4dfd7` | `#e4dfd7` | Light code text on slate background |

### 4.2 Typography
- **Primary Body Font Stack:**
  `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Code & Tech Accents Stack:**
  `'JetBrains Mono', 'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- **Vertical Rhythm & Sizing:**
  - Base font-size: `17px` / `1.1rem`
  - Body line-height: `1.75`
  - Reading container width: `760px` max, centered with `margin: 0 auto; padding: 0 1.25rem`

### 4.3 Rotator Banner (`sass/rach.css`)
- Underneath the site navigation bar, the `.banner` container runs horizontally.
- The `a#rotator img` asset (`me.webp`) moves smoothly with `@keyframes move` back and forth across the screen and rotates on hover.
- Banner borders and background colors inherit theme CSS variables so it harmonizes in both light and dark modes.

## 5. Templates & Data Architecture

1. **`base.html`:**
   - Pre-hydration theme script in `<head>` to avoid flash of incorrect theme.
   - Meta tags: Viewport, description, OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`), Twitter card, favicon links.
   - Global header with site title, menu navigation (`posts`, `tags`, `projects`, `about-me`), theme switch toggle button, and rotator banner.
   - Main content block `<main id="content">{% block content %}{% endblock %}</main>`.
   - Global footer with verified social media links (Bluesky, GitHub, Hacker News, Mastodon), email, Atom/RSS feed links, and subtle copyright/generator notice.
   - Deferred script includes (`/js/theme.js`, `/js/copy-code.js`).

2. **`index.html`:**
   - Extends `base.html`.
   - Renders intro profile header (avatar `me512.png`, bio markdown from `content/_index.md`).
   - Retrieves recent posts from section `posts/_index.md` (up to `section.extra.max_posts | default(value=5)`).
   - Displays post date, title, tags, and summary snippet (splitting on `<!-- more -->`).

3. **`section.html`:**
   - Extends `base.html`.
   - Handles `/posts/` section with paginated listing (`paginator.pages`).
   - Includes pagination navigation (`paginator.previous`, `paginator.next`, page index numbers).

4. **`page.html`:**
   - Extends `base.html`.
   - Displays post title, published date (formatted via `%d %B %Y`), estimated reading time (`page.reading_time min read`), and category/tag pills.
   - Renders `page.content | safe`.
   - Post navigation: Link back to `/posts/`.

5. **`cards.html`:**
   - Extends `base.html`.
   - Applied to `/projects/` section (`template = "cards.html"`).
   - Renders responsive CSS grid of project cards.
   - Each card displays project image (`page.extra.local_image` via `get_url`), title, markdown description or summary, tags, and link to GitHub/canonical URL.

6. **`taxonomy_list.html` & `taxonomy_single.html`:**
   - Displays all terms with post counts (`taxonomy_list.html`).
   - Lists posts categorized or tagged under a specific term (`taxonomy_single.html`).

7. **`404.html`:**
   - Extends `base.html`.
   - Clean "404 - Page Not Found" message in Ilkley theme styling with a button to return home.

## 6. Client Interactivity Details

### 6.1 Theme Switching (`theme.js`)
- Stores preference in `localStorage.getItem("theme")` (`"dark"`, `"light"`, or `null`).
- Default: `window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"`.
- Sets `document.documentElement.setAttribute("data-theme", theme)`.
- Updates toggle button icon (moon for dark, sun for light) and aria attributes (`aria-label="Switch to light mode"`).

### 6.2 Code Block Copy Button (`copy-code.js`)
- Iterates over all `pre > code` elements.
- Injects a small `<button class="copy-code-button">Copy</button>` into the parent `<pre>`.
- Uses `navigator.clipboard.writeText(codeText)` with fallback.
- Provides immediate visual feedback ("Copied!") for 2 seconds.

## 7. Configuration Updates (`config.toml`)
- Remove `theme = "tabi"`.
- Set `compile_sass = true`.
- Clean out deprecated tabi-specific sections (`[extra.giscus]`, `[extra.utterances]`, `[extra.hyvortalk]`, etc.) while retaining all personal metadata:
  - `title`, `base_url`, `description`, `generate_feeds = true`, `taxonomies = [{name = "tags", feed = true}, {name = "categories", feed = true}]`.
  - `menu` array with posts, tags, projects, about-me.
  - `socials` array with bluesky, github, hacker-news, mastodon.
  - `extra.author` with name and avatar.
  - Markdown syntax highlighting enabled with dark theme.

## 8. CI/CD Workflow (`.github/workflows/pages.yml`)
- Update `shalzz/zola-deploy-action@v0.22.1` to `shalzz/zola-deploy-action@v0.23.1`.

## 9. Verification Strategy
1. **Compilation Check:** Run `zola check` in the repository to guarantee all internal links, taxonomies, markdown files, and template variables resolve properly.
2. **Build Verification:** Run `zola build` to ensure Sass compiles from `sass/style.scss` and `sass/rach.css` without errors.
3. **Route Verification:** Verify generated output in `public/`:
   - `/index.html` (Home)
   - `/posts/index.html` (Posts list with pagination)
   - `/posts/2026-03-10-nerd-font-icon-picker-fzf-lua/index.html` (Single post with code, tags, resize_image)
   - `/projects/index.html` (Cards layout with age.nvim)
   - `/about-me/index.html` (About page)
   - `/tags/index.html` and single tag pages
   - `/categories/index.html` and single category pages
   - `/atom.xml` and `/rss.xml`
   - `/404.html`
4. **VCS Integrity:** Use `jj --no-pager status` and `jj --no-pager diff --git` to ensure all commits are clean and atomic.
