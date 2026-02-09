# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

All commands run from the root directory unless noted:

- **Dev server:** `bun run --cwd apps/web dev`
- **Build:** `bun run --cwd apps/web build` (runs `tsc -b && vite build`)
- **Lint:** `bun run --cwd apps/web lint`
- **Preview production build:** `bun run --cwd apps/web preview`
- **Install deps:** `bun install` (from root)
- **Add shadcn component:** `bunx --bun shadcn@latest add <component>` (run from `apps/web`)

## Architecture

Bun monorepo with workspaces (`apps/*`, `packages/*`). Currently one app:

- **apps/web** — React 19 SPA with Vite 7, TypeScript, Tailwind CSS v4, and React Compiler

The `packages/` directory exists for shared code but has no packages yet.

## Key Technical Choices

- **Package manager:** Bun (lockfile: `bun.lock`)
- **UI components:** shadcn/ui (new-york style, neutral base color, CSS variables, lucide icons). Config at `apps/web/components.json`
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. Theme variables in `apps/web/src/index.css` using oklch colors. Dark mode via `.dark` class
- **Path alias:** `@/*` maps to `apps/web/src/*`
- **Utility:** `cn()` helper at `@/lib/utils` (clsx + tailwind-merge)
- **React Compiler:** Enabled — never use manual `useMemo`/`useCallback`; the compiler handles memoization
- **TypeScript:** Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- **Routing:** React Router v7 with file-based route organization under `src/routes/`
- **Animations:** GSAP with ScrollTrigger and ScrollSmoother for scroll-driven animations
- **Firebase:** Initialized for analytics; config via `VITE_*` env vars in `.env.local`

## Coding Patterns & Best Practices

### Component Structure

- Page sections live in `src/routes/<page>/components/` — each section is a standalone component
- Layout components (`navbar`, `footer`) live in `src/components/`
- Animation wrappers (`scroll-reveal`, `smooth-scroll`) live in `src/components/animations/`
- shadcn/ui primitives live in `src/components/ui/` — do not modify these directly; add shadcn components via CLI
- SVG assets exported as React components go in `src/assets/`

### Data & Configuration

- All site content (copy, pricing, nav items, testimonials, etc.) is centralized in `src/config/site.ts` as a single `siteConfig` object with `as const`
- Components derive their types from `siteConfig` using indexed access types: `type Service = SiteConfig["services"][number]`
- When adding new sections, add the data to `siteConfig` first, then build the component to consume it

### Styling

- Always use `cn()` for combining class names — it handles Tailwind class conflicts via tailwind-merge
- Use Tailwind utility classes; avoid inline styles
- Use CVA (class-variance-authority) for component variants (see `button.tsx`, `badge.tsx`)
- Theme colors use CSS variables defined in `index.css` — reference them via Tailwind (e.g., `bg-primary`, `text-muted-foreground`)
- Font: Satoshi (loaded via Fontshare CDN in `index.html`)

### Animations

- Wrap sections with `<ScrollReveal>` for entrance animations (supports direction, delay, stagger)
- `<SmoothScroll>` wraps the entire page in the root layout — do not nest another instance
- GSAP is the animation library; do not introduce Framer Motion or other animation libs

### TypeScript

- Strict mode is enforced — no `any` types, no unused variables
- Use `type` keyword for type-only imports (`import type { ... }`)
- Derive types from config objects rather than duplicating type definitions

### General

- Imports use the `@/` path alias — never use relative paths that go above `src/`
- Keep components focused: one section per file, minimal logic in components
- No global state management yet — data flows from `siteConfig` through props
- React Compiler is active — do not add manual memoization
