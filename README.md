# ah-bestia

The source for [ahbestia.com](https://ahbestia.com), David Barbosa's bilingual portfolio for software engineering and photography.

> This project is under active development. The current site includes the main portfolio experiences, photography galleries, and the first developer lab; content and case studies will continue to evolve.

## What's here

- A developer profile with experience, selected work, and contact information.
- Developer Labs for small web experiments, currently featuring an interactive fixed-gear calculator.
- A photography portfolio with seven series, responsive image delivery, and an accessible full-screen lightbox.
- Complete English and Spanish routes and interface copy.
- Light and dark themes that respect the visitor's system preference and persist their selection.
- SEO foundations including canonical URLs, language alternates, Open Graph metadata, JSON-LD, `robots.txt`, and an XML sitemap.
- Progressive animation with reduced-motion support; the photography gallery loads GSAP only when the enhanced desktop experience is eligible to run.

## Built with

- [Astro 7](https://astro.build) and strict TypeScript
- [GSAP](https://gsap.com) and ScrollTrigger for the enhanced photography experience
- Astro Assets and Sharp for responsive image optimization
- Plain CSS backed by a shared design-token system
- pnpm

The site is statically generated. JavaScript is reserved for interactions such as navigation, theme switching, the photo lightbox, animation, and the fixed-gear calculator.

## Getting started

### Requirements

- Node.js 22.12 or newer
- pnpm

Install the dependencies:

```sh
pnpm install
```

Start Astro's background development server:

```sh
pnpm astro dev --background
```

The site is available at [localhost:4321](http://localhost:4321). The root route redirects to the English developer experience.

Manage the background server with:

```sh
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
```

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm astro dev --background` | Start the local development server in the background |
| `pnpm check` | Run Astro and TypeScript checks, then validate CSS token usage |
| `pnpm check:tokens` | Check styles for undefined tokens and disallowed one-off values |
| `pnpm build` | Generate the production site in `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm deploy:gh-page` | Build and publish `dist/` to the remote `gh-page` branch |
| `pnpm deploy:gh-page -- --dry-run` | Validate the deployment push without publishing it |

Before opening a pull request or deploying, run:

```sh
pnpm check
pnpm build
```

## Routes

Every public experience is generated in English and Spanish:

| Route | Description |
| --- | --- |
| `/en/dev/`, `/es/dev/` | Developer portfolio |
| `/en/dev/labs/`, `/es/dev/labs/` | Developer experiments |
| `/en/dev/labs/[slug]/`, `/es/dev/labs/[slug]/` | Individual interactive lab |
| `/en/ph/`, `/es/ph/` | Photography portfolio |
| `/en/ph/[slug]/`, `/es/ph/[slug]/` | Individual photography series |

The legacy `/:lang/dev/projects/` route redirects to the Labs archive.

## Project structure

```text
.
|-- public/                 # Static files, CNAME, robots.txt, and favicons
|-- scripts/                # CSS-token validation and GitHub Pages deployment
|-- src/
|   |-- assets/             # Source photography and shared images
|   |-- components/         # Portfolio sections and interactive UI
|   |-- data/               # Lab and photography-series definitions
|   |-- i18n/               # English and Spanish content and UI labels
|   |-- layouts/            # Shared document shell, metadata, and structured data
|   |-- pages/              # Astro file-based routes
|   `-- styles/             # Global styles and local font setup
|-- astro.config.mjs        # Site URL, sitemap, and locale configuration
`-- tokens.css              # Shared color, type, spacing, shadow, and motion tokens
```

## Working with content

- Update shared interface and portfolio copy in `src/i18n/content.ts`. Keep English and Spanish entries in sync.
- Define photography series in `src/data/photoGalleries.ts` and store their source images under `src/assets/photography/galleries/`.
- Define developer experiments in `src/data/labs.ts`; their routes are generated from the project slug.
- Reuse values from `tokens.css` when styling components. `pnpm check:tokens` rejects color literals, undefined variables, and un-tokenized typography or elevation values in project styles.

## Project principles

Changes should remain mobile-first, accessible, multilingual, and usable in both themes. Prefer semantic HTML and progressive enhancement, respect reduced-motion preferences, optimize images and client-side work, and preserve the site's canonical, alternate-language, and structured metadata.

## Deployment

The production site is configured for `https://ahbestia.com` and uses the `public/CNAME` file for its custom domain. `pnpm deploy:gh-page` creates a production build, verifies that `dist/` is not empty, and pushes the generated site to `origin/gh-page` without replacing the source branch or checking generated files into it.

For Astro-specific implementation details, see the [Astro documentation](https://docs.astro.build).
