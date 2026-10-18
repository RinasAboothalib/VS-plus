# Visual Studios Plus — website

React + Vite single-page site for Visual Studios Plus (Colombo). Motion is built with GSAP (ScrollTrigger) and Lenis smooth scrolling.

## Run

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # production build into dist/
npm run preview    # serve the production build
```

The app uses client-side routing, so any static host needs a fallback that serves `index.html` for unknown paths.

## Structure

```
public/assets/        images, client logos, photo archive (full + thumb)
src/data/site.js      all copy and lists: clients, films, case studies, services, stats …
src/data/photos.json  the 115-photo archive index (file, thumb, category, size)
src/pages/            one component per route
src/components/       layout (Nav, Footer, BackToTop, SheetDock), home sections, work pieces
src/context/          page meta + footer CTA, contact sheet, page transitions
src/lib/              motion helpers (GSAP/Lenis), storage, scroll reveals
src/styles/           global styles
legacy-static/        the previous static HTML build, kept for reference (safe to delete)
```

## Routes

`/` · `/work/` · `/work/:slug/` (4 films) · `/photography/` (`?category=food|fashion|jewellery|hospitality`) · `/services/` · `/about/` · `/contact/` · anything else → 404.

## Editing content

Most text and lists live in `src/data/site.js`. To add photos, put the file in `public/assets/photos/full/`, a ~900px WebP in `public/assets/photos/thumb/`, and an entry in `src/data/photos.json`.

The contact form opens the visitor's e-mail app with the brief filled in; there is no server-side form handling.
