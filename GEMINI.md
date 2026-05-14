# Astro Mochi Tones Project Instructions

This project is a blog theme system built with **Astro** and **Material Design 3**. It is structured to allow both theme development and site content management within the same repository.

## Project Overview

- **Core Technologies:** Astro (v5), TypeScript, MDX, Material Design 3 (`@material/web`).
- **Architecture:**
    - `package/`: The core theme logic, components, layouts, and styles. This is intended to be an Astro integration/package.
    - `src/`: The site-specific content and pages.
    - `src/content/blog/`: Markdown and MDX files for blog posts.
    - `public/`: Static assets (images, icons).
- **Key Features:**
    - Material Design 3 UI components and dynamic color system.
    - Waline comment system integration.
    - Local instant search via Fuse.js.
    - MDX support with custom components (Express, Data, Container).

## Building and Running

### Development
To start the development server for the site:
```bash
npm run dev
```

### Production
To build the site for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

### Theme Publishing
To publish/sync the theme code in `package/`:
```bash
.\publish-theme.ps1
```

## Development Conventions

### Content Management
- **Blog Posts:** Located in `src/content/blog/`. Use `.md` or `.mdx`.
- **Frontmatter:** Posts must include `title` and `date`. Optional fields include `cover`, `description`, `tags`, `categories`, and `draft`.
- **Validation:** Schema is defined in `src/config.ts` using `astro:content`.

### Components
- **Theme Components:** Located in `package/src/components/`.
- **Site Components:** Located in `src/components/` (if any specific overrides are needed, though mostly used from the package).
- **Styling:** Primarily uses Material Design 3 components and global CSS in `package/src/styles/global.css`.

### Configuration
- **Main Config:** `astro.config.ts` in the root.
- **Site Metadata:** Configured within the `MochiTones` integration in `astro.config.ts`.
- **Social/Friends:** Managed in `src/data/friends.ts`.

### Coding Standards
- **TypeScript:** Strictly used for all logic and component scripts.
- **Material Design:** Follow Material Design 3 principles for UI updates.
- **Surgical Edits:** When modifying the theme, ensure compatibility with the site structure in `src/`.
