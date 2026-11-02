# Visual Studios Plus — Design

The whole site follows the Figma file
[visual-studios](https://www.figma.com/design/j7TTAycibXNICg5Bhljhat/visual-studios?node-id=2-2), frame **home** (node `2:2`, 1728 × 6665).
Home and Contact are built from it directly; the other pages keep their own layouts with the same
type, colours, buttons, header, call to action and footer (see **Other pages**).
This file records the system, so new sections can match it.

Code: `src/styles/home.css` (tokens, nav, home, contact, footer), `src/styles/inner.css` (other
pages), `src/pages/Home.jsx`, `src/pages/Contact.jsx`, `src/components/TopNav.jsx`,
`src/components/FigmaCta.jsx`, `src/components/FigmaFooter.jsx`.

## Scale

The frame is 1728 px wide. One design pixel is the CSS variable `--u`:

```css
--u: min(1px, 100vw / 1728);
```

Write sizes as `calc(<figma px> * var(--u))`, so they scale down with the window and never grow past the
design on wide screens. Wrap small text and controls in `max(<floor>, …)` so they stay legible
(for example `max(16px, calc(20 * var(--u)))`). Below 768 px, sizes are set directly in the phone block
at the end of `home.css`.

## Colour

Sections alternate between **black** and **white**. Each section sets `data-theme="dark"` or
`data-theme="light"`. All colours are tokens, and a white section redefines them, so the same
component rules work on both.

| Token | Black section | White section | Use |
| --- | --- | --- | --- |
| `--fg-accent` | `#ffd400` yellow | `#0a0a0a` | Headings, eyebrows, buttons, service names, icons |
| `--fg-accent-2` | `#ffe14d` | `#0a0a0a` | Headline body colour, solid-button hover |
| `--fg-text` | `#ffffff` | `#0a0a0a` | Base text |
| `--fg-soft` | white 72% | black 72% | Footer and menu links |
| `--fg-sub` | white 70% | black 62% | Sub lines under headlines |
| `--fg-body` | white 62% | black 60% | Body copy, card format lines |
| `--fg-faint` | white 40% | black 40% | Service counter |
| `--fg-bg` | `#0a0a0a` | `#ffffff` | Section background; text on solid buttons and card labels |
| `--fg-panel` | `#141414` | `#f4f4f4` | Footer background |
| `--fg-tile` | `#1a1a1a` | `#eeeeee` | Placeholder behind images and videos |
| `--fg-tint`, `--fg-line` | white 5%, 25% | black 4%, 25% | Form card, field borders |
| `--fg-shadow` | black 60% | black 22% | Card shadows |

So in black sections headings and buttons are yellow and copy is white (solid yellow buttons carry
black text); white sections are black on white.

| Section | Theme |
| --- | --- |
| Hero (photo under a dark wash) | black |
| Client logos | white |
| What we do | white |
| Our Services | black |
| Projects | white |
| Portfolio | black |
| Contact us | white |
| Footer, phone menu | black |
| Contact page | white |

The nav bar has no background. It reads the section under it and turns black over white sections
(`body.nav-light`; the yellow wordmark SVG is drawn black with `filter: brightness(0)`), yellow
over black ones. Sections are square, with no rounded corners.

## Type

| Role | Font | Size (design px) | Weight | Notes |
| --- | --- | --- | --- | --- |
| Hero / page headline | Manrope | 96, line-height 1 | 800 | Letter-spacing −0.05em; middle line in `--fg-accent` (`.fgHero_accent`) |
| Sub line | Manrope | 24, line-height 1.5 | 600 | Letter-spacing −0.05em |
| Section eyebrow | Manrope | 40 | 600 | Written `[n]   Name`, e.g. `[1]   Our Services` (`.fgEyebrow`) |
| Statement | Manrope | 40 | 700 | Who-we-are paragraph |
| Service name | Manrope | 48 | 800 | |
| Body | Manrope | 15–18 | 500 | |
| Button | Manrope | 20 | 700 | Letter-spacing 1px |
| Footer text | Inter | 16 | 700 | Letter-spacing −0.1em |
| Footer wordmark | Inter | 200 | 700 | "Visual   Studios" with a superscript + |

Fonts load from Google Fonts in `index.html` (Manrope 500–800, Inter 700).

## Components

- **Top bar** (`TopNav`): fixed, 65 tall. Figma wordmark (`/assets/img/vsplus-logo.svg`, 211 × 34) on the
  left; **Work · Services ▾ · Photography · About · Contact** on the right. No background at any
  scroll position; slides away while scrolling down and back on scrolling up (`body.nav-hidden`).
  It turns black over light backgrounds: a section's `data-theme`, or failing that the brightness of
  the background under it.
- **Services menu**: hover (mouse) or click opens a dark panel listing the services. First the two
  with pages of their own (Social Media Marketing, Web Development, in yellow), then every service on
  the Services page by its anchor (`/services/#branding` and so on, from `data.services`), then
  "All services →". Links rise in as it opens; Escape, a click outside, or following a link closes it.
  "Services" is marked current on the Services and service pages.
- **Phone menu**: the links fold into a two-line **burger** that opens a full-screen black menu (Work,
  Services, Photography, About, Contact, then email, phone and social icons). "Services" opens its list
  in place. Escape or a new page closes it; page scroll stops while it is open.
- **Buttons** (`.fgBtn`): pill, radius 50, 57 tall, about 210 wide.
  `--solid`: yellow fill, black text. `--line`: 3px yellow border, yellow text, fills yellow on hover.
- **Image cards**: large radii (services 80, project cards 49, portfolio 40), `object-fit: cover`,
  deep black shadow on the stacked project cards.
- **Social icons**: 38 px yellow-outlined circles that fill yellow on hover (footer, phone menu).

## Home, top to bottom

1. **Hero** — Figma photo (`/assets/img/figma-hero.png`) stretched to the frame like the design
   (`object-fit: fill`; cropped to cover on phones) under a dark wash. Three-line headline,
   "We create content / That **grows** / brands", where the verb rolls through grows, builds, moves,
   sells (`HERO_VERBS`, the old hero's `WordRotator`: the new word rises in as the old one leaves
   upward, in a cell as wide as the widest word, so the lines above and below never move). Sub line,
   "Ready to grow" → `/contact/`.
2. **Client logos** — six logos from `/assets/logos/` at 50% opacity, scrolling endlessly.
3. **Who we are** — a full screen with the statement and three figures (50+, 10M+, 100%); it locks
   in place while they come in.
4. **[1] Our Services** — one pinned stage for the five lead services, in this order: Web & App
   Development, Digital Marketing Retainers, Branding & Strategy, TV Commercials, Reels & TikTok
   Campaigns (`SERVICE_ORDER`, names and links from `data.serviceList`). Scrolling hands from one to
   the next; a counter shows `03 / 05`. Each panel: name, description, "See more", and a looping film
   of that kind of work (`SERVICE_VIDEO`): Waga web film, "10 Marketing Facts", Hayleys brand film,
   the commercials reel, a Ritzbury product reel.
5. **[2] Projects** — pinned; five flagship projects (`data/projects.js`) rise from the bottom into
   the frame's three-deep card stack (front 1098 × 746, then 958 and 866 wide behind). Each card plays
   its own film where the site has one (YouTube-only projects show their cover). Cards open the post;
   "See more" → `/work/`, shown only once the last card has landed.
6. **[3] portfolio** — two rows of the latest Instagram covers drifting in opposite directions
   (`useFlowRows`); cards 259 × 329, every few 459 wide. "See more" → `/photography/`.
7. **[4] Contact us** (`FigmaCta`, also before the footer on every other page except Contact) —
   headline "Ready to grow / your brand?", sub line, "Start a project" → `/contact/` and "Email us".
   Contact details stay in the footer only.
8. **Footer** (`FigmaFooter`, on every page) — near-black band: email, phones, social icons centred on
   the column row, Information and services links, then the wordmark.

## Other pages

Work, Services, Social Media Marketing, Web Development, Photography, About, a project and 404 keep
their layouts. `inner.css` restyles what they share:

- **Type**: Manrope throughout; headings 800 with tight tracking; labels in plain 16 px bold, not
  small capitals.
- **Header** (`PageHero`): a black band like the home hero, with the title in yellow (sentence case,
  yellow full stop), the lede in white, and links and small print in white.
- **Sections**: the old cream bands are white, black bands stay black with yellow headings, and
  every section is square.
- **Buttons**: solid pills in the home style; text links (`.btnLink`) become 3px outlined pills that
  fill yellow on hover; filter chips are outlined pills that fill yellow when chosen.
- **Ending**: every page closes on Contact us, then the Figma footer. The old footer and its brief
  form are no longer used.

## Contact page

Side by side: the brief form (left, faint yellow card) and the headline "Let's make / something /
matter" with its sub line (right, stays in view while the form scrolls). No extra heading or button
above the form, and no separate contact-details panel (the footer carries those). Below 900 px the
headline comes first. The form is compact (one-line intro, small chips, three-row message box) so it
fits one screen at 1440 × 900.

## Motion

GSAP with ScrollTrigger (`src/lib/motion.js`); smooth scroll by Lenis. Everything is skipped under
`prefers-reduced-motion`, where pinned sections simply stack.

| Where | Motion |
| --- | --- |
| Hero (on load) | Photo settles from 112%; headline lines rise in turn; sub line and button follow |
| Logos | Rise in one after another |
| Who we are | Pinned once the logos have left the screen: words rise out of a faint blur in a staggered wave, the figures rise and count up, then the block lifts away and fades (all scrubbed) |
| Services entrance | Before its pin: heading and counter rise, the first panel comes up, its picture unmasks from the bottom |
| Section headings | Rise and fade in as they reach the screen |
| Services | Pinned: outgoing text lifts away and its picture shrinks out; incoming text rises and its picture unmasks from the bottom |
| Projects | Pinned: each card rises from the bottom; earlier cards step back in the stack; "See more" rises in after the last card |
| Portfolio | Rows slide in from opposite sides, then drift; hovering a row slows it, hovering a card zooms it |
| Contact us | Headline lines, sub line and buttons rise in turn |
| Footer | Columns and icons rise, then the wordmark slides up |
| Phone menu | Panel drops in; links rise one by one |

Easing: `expo.out` for entrances, `power3.out` for small rises, `power2.in` for exits.

## Phones (≤ 767 px)

Single column, 16 px gutters. The nav folds into the burger menu. Hero fills the screen; headline
44 px. Services stay pinned: name and text, then a full-width landscape picture (at most 36% of the
screen, 300 px), then a centred "See more". Projects stay pinned with tall full-width cards
(56% of the screen, up to 470 px) and "See more" right under the stack. Portfolio cards 120 × 152. Footer columns in two pairs, social icons below them, wordmark 13.5vw.

## Assets

Everything comes from the site's own `public/assets`, apart from two files taken from the Figma
frame: `img/figma-hero.png` (hero photo, 1024 × 1024 source) and `img/vsplus-logo.svg` (nav wordmark).

Films are muted, looping and inline (`LoopVideo` in `Home.jsx`), with their cover as the poster. Each
plays only while it is on screen and stays on its poster under reduced motion.
