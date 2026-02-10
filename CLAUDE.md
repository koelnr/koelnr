# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

All commands run from the root directory unless noted:

### apps/web (Vite SPA)
- **Dev server:** `bun run --cwd apps/web dev`
- **Build:** `bun run --cwd apps/web build` (runs `tsc -b && vite build`)
- **Lint:** `bun run --cwd apps/web lint`
- **Preview production build:** `bun run --cwd apps/web preview`
- **Add shadcn component:** `bunx --bun shadcn@latest add <component>` (run from `apps/web`)

### apps/online (Next.js)
- **Dev server:** `bun run --cwd apps/online dev`
- **Build:** `bun run --cwd apps/online build`
- **Lint:** `bun run --cwd apps/online lint`
- **Install deps:** `bun install` (from root) or `cd apps/online && bun install` (scoped)

## Architecture

Bun monorepo with workspaces (`apps/*`, `packages/*`). Currently two apps:

- **apps/web** — React 19 SPA with Vite 7, TypeScript, Tailwind CSS v4, and React Compiler
- **apps/online** — Next.js App Router application with server actions and React Compiler

The `packages/` directory exists for shared code but has no packages yet.

## Key Technical Choices

### Shared
- **Package manager:** Bun (lockfile: `bun.lock`)
- **UI components:** shadcn/ui (new-york style, neutral base color, CSS variables, lucide icons)
- **Styling:** Tailwind CSS v4. Theme variables using oklch colors. Dark mode via `.dark` class
- **Path alias:** `@/*` maps to `src/*`
- **Utility:** `cn()` helper at `@/lib/utils` (clsx + tailwind-merge)
- **React Compiler:** Enabled — never use manual `useMemo`/`useCallback`; the compiler handles memoization
- **TypeScript:** Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`

### apps/web (Vite SPA)
- **Framework:** Vite 7 with React 19
- **Routing:** React Router v7 with file-based route organization under `src/routes/`
- **Animations:** GSAP with ScrollTrigger and ScrollSmoother for scroll-driven animations
- **Firebase:** Initialized for analytics; config via `VITE_*` env vars in `.env.local`
- **Config:** shadcn config at `apps/web/components.json`

### apps/online (Next.js)
- **Framework:** Next.js with App Router
- **Validation:** Zod for form validation and type inference
- **Server Actions:** Next.js server actions for form submissions
- **Font:** Satoshi (loaded via Fontshare CDN)
- **Config:** shadcn config at `apps/online/components.json`

## Coding Patterns & Best Practices

### Component Structure

#### apps/web (Vite SPA)
- Page sections live in `src/routes/<page>/components/` — each section is a standalone component
- Layout components (`navbar`, `footer`) live in `src/components/`
- Animation wrappers (`scroll-reveal`, `smooth-scroll`) live in `src/components/animations/`
- shadcn/ui primitives live in `src/components/ui/` — do not modify these directly; add shadcn components via CLI
- SVG assets exported as React components go in `src/assets/`

#### apps/online (Next.js)
- Page components consolidate all sections inline — define component functions within the page file
- Form components live in `src/components/forms/` — client components that use server actions
- Server actions defined in `src/app/actions.ts` — use Zod for validation
- Shared components live in `src/components/`
- shadcn/ui primitives live in `src/components/ui/`

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

### Forms & Server Actions (apps/online)

- Form components are client components (`"use client"`) in `src/components/forms/`
- Server actions defined in `src/app/actions.ts` with `"use server"` directive
- Use Zod for schema validation and type inference
- Form components use `useTransition` for loading states and error handling
- Server actions return `{ success: boolean, message: string, errors?: Record<string, string> }`
- Display validation errors inline below each field
- Show success/error messages in a banner at the top of the form
- Reset form on successful submission

### Authentication (apps/online)

- Auth pages in `src/app/(auth)/` route group: `/sign-in`, `/sign-up`, `/forgot-password`
- Auth forms in `src/components/forms/`: `sign-in-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`
- Auth actions in `src/app/actions.ts`: `signIn`, `signUp`, `forgotPassword`, `signInWithGoogle`
- Currently using placeholder actions — Firebase Auth integration pending
- All auth forms include email/password and Google OAuth options
- Forms redirect to `/dashboard` on successful authentication

### General

- Imports use the `@/` path alias — never use relative paths that go above `src/`
- Keep components focused: one section per file, minimal logic in components
- No global state management yet — data flows from `siteConfig` through props
- React Compiler is active — do not add manual memoization
