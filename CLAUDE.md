# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

All commands run from the `apps/web` directory:

- **Dev server:** `bun run --cwd apps/web dev`
- **Build:** `bun run --cwd apps/web build` (runs `tsc -b && vite build`)
- **Lint:** `bun run --cwd apps/web lint`
- **Preview production build:** `bun run --cwd apps/web preview`
- **Install deps:** `bun install` (from root)
- **Add shadcn component:** `bunx --bun shadcn@latest add <component>` (from `apps/web`)

## Architecture

Bun monorepo with workspaces (`apps/*`, `packages/*`). Currently one app:

- **apps/web** — React 19 SPA with Vite 7, TypeScript, Tailwind CSS v4, and React Compiler (via babel-plugin-react-compiler)

The `packages/` directory exists for shared code but has no packages yet.

## Key Technical Choices

- **Package manager:** Bun (lockfile: `bun.lock`)
- **UI components:** shadcn/ui (new-york style, neutral base color, CSS variables, lucide icons). Config at `apps/web/components.json`
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. Theme variables defined in `apps/web/src/index.css` using oklch colors. Dark mode via `.dark` class
- **Path alias:** `@/*` maps to `apps/web/src/*`
- **Utility:** `cn()` helper at `@/lib/utils` (clsx + tailwind-merge)
- **React Compiler:** Enabled — avoid manual `useMemo`/`useCallback`; the compiler handles memoization
- **TypeScript:** Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
