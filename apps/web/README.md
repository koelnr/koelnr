# koelnr web

Doorstep car wash service landing page — React 19 SPA built with Vite, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **React 19** with React Compiler (auto-memoization via babel-plugin-react-compiler)
- **Vite 7** for dev server and bundling
- **TypeScript** in strict mode
- **Tailwind CSS v4** with oklch color theme and CSS variables
- **shadcn/ui** (new-york style) for UI primitives
- **GSAP** for scroll-driven animations (ScrollTrigger + ScrollSmoother)
- **React Router v7** for client-side routing
- **Firebase** for analytics
- **Lucide React** for icons

## Project Structure

```
src/
├── assets/                  # SVG components (logo, etc.)
├── components/
│   ├── animations/
│   │   ├── scroll-reveal.tsx    # GSAP scroll entrance animations
│   │   └── smooth-scroll.tsx    # GSAP smooth scrolling wrapper
│   ├── ui/                      # shadcn/ui primitives (button, card, badge, separator)
│   ├── navbar.tsx               # Fixed header with responsive mobile menu
│   └── footer.tsx               # Site footer with links and contact info
├── config/
│   └── site.ts              # Centralized site content and configuration
├── lib/
│   ├── firebase.ts          # Firebase initialization
│   └── utils.ts             # cn() helper, placeholder utilities
├── routes/
│   ├── router.ts            # React Router route definitions
│   ├── index.tsx            # Root layout (navbar + smooth scroll + footer)
│   └── home/
│       ├── index.tsx        # Home page — composes all sections
│       └── components/
│           ├── hero.tsx         # Hero banner with CTAs
│           ├── services.tsx     # Service cards grid
│           ├── pricing.tsx      # Subscription plans, add-ons, on-demand pricing
│           ├── about.tsx        # About section with stats
│           ├── testimonials.tsx # Customer reviews grid
│           └── contact.tsx      # Contact form and info cards
├── main.tsx                 # App entry point
└── index.css                # Tailwind theme (oklch colors, dark mode, fonts)
```

## Key Architecture Decisions

**Config-driven content** — All site copy, pricing, nav items, and testimonials live in `src/config/site.ts`. Components consume this config via props and derive their TypeScript types from it.

**Route-based organization** — Page components and their sections are grouped under `src/routes/<page>/`. Shared components live in `src/components/`.

**Animation system** — `ScrollReveal` provides entrance animations on scroll/mount with configurable direction, delay, and stagger. `SmoothScroll` wraps the entire page for smooth scrolling behavior. Both use GSAP.

**shadcn/ui components** — Added via CLI (`bunx --bun shadcn@latest add <component>`), stored in `src/components/ui/`. These use CVA for variant management and the `cn()` utility for class merging.

## Development

```bash
# from monorepo root
bun install
bun run --cwd apps/web dev
```

## Build

```bash
bun run --cwd apps/web build    # tsc -b && vite build
bun run --cwd apps/web preview  # preview production build locally
```

## Environment Variables

Firebase config via `.env.local`:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```
