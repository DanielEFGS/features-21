# Lab: Tailwind

This lab adapts the Angular + Tailwind docs into a focused, practical exercise. The goal is to learn the essentials without copying the docs verbatim.

## Index
- [Lab: Tailwind](#lab-tailwind)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Automated setup (recommended)](#1-automated-setup-recommended)
    - [2) Manual setup](#2-manual-setup)
    - [3) First utility usage](#3-first-utility-usage)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
Tailwind is a utility-first CSS framework you can add to Angular without leaving HTML. Use Angular CLI’s `ng add` for a one-command install, or configure PostCSS manually.

## Demo
Toggle Tailwind utility classes for a preview card (spacing, border, shadow, accent) and see the final class string update live.

## Goals
- Add Tailwind via `ng add @angular/tailwindcss`.
- Understand the manual PostCSS setup and `@tailwind` imports.
- Apply a small set of utilities to a component safely.
- Keep lab routes running in CSR without affecting SSR builds.

## Prerequisites
- Standalone components and OnPush change detection.
- Modern control flow (`@if`, `@for`).
- Basic familiarity with Tailwind utilities (spacing, border, color, typography).

## Key concepts
- Automated install: `ng add @angular/tailwindcss` configures dependencies and build.
- Manual install: install `tailwindcss postcss autoprefixer`, add `postcss.config.cjs`, import `@tailwind` layers.
- Utilities apply directly in templates; avoid `ngClass`—prefer string/class bindings.
- Labs run in CSR; Tailwind here is scoped to the client build.

## Guided exercise
**Story:** Enable Tailwind in a small feature, then apply a handful of utilities to a preview card and verify classes update.

**UI basics:**
- One preview card that shows applied classes.
- Toggles for padding, border radius, shadow, and accent color.
- A read-only class string to copy.

## Minimum implementation

### 1) Automated setup (recommended)
- Run `ng add @angular/tailwindcss`.
- Confirm `tailwind.config.js` (or `.cjs`) and `postcss.config.cjs` are generated.
- Ensure `src/styles.css` imports `@tailwind base; @tailwind components; @tailwind utilities;`.

### 2) Manual setup
- Install: `npm install tailwindcss @tailwindcss/postcss postcss`.
- Create `postcss.config.cjs` with `plugins: { 'tailwindcss/postcss': {} }`.
- Add `@tailwind base; @tailwind components; @tailwind utilities;` to `src/styles.css` (or `.scss`).

### 3) First utility usage
- Add a small template using classes like `p-4`, `rounded-lg`, `shadow-md`, `bg-slate-100`, `text-sm`, `font-medium`.
- Bind a computed string for the class list instead of `ngClass`.

## Checklist
- [ ] Tailwind installed (automated or manual).
- [ ] `@tailwind` layers imported in global styles.
- [ ] PostCSS config present.
- [ ] Demo renders with selected utilities.
- [ ] No `ngClass`; use class bindings/strings.
- [ ] Lab runs in CSR.

## Common pitfalls
- Forgetting to import `@tailwind` layers in `styles.css`.
- Leaving `ngClass` behind instead of simple bindings.
- Missing PostCSS config when doing manual setup.
- Not restarting the dev server after install (cached build).

## A11y and UX
- Use labeled controls for toggles.
- Ensure focus styles remain visible even with Tailwind resets.
- Keep sufficient contrast when using utility colors.

## Suggested tests
- Demo shows the class string that matches selected toggles.
- Toggling options updates the class string and applied classes.
- Page renders without errors in CSR mode.

## References
- https://angular.dev/guide/tailwind
- https://tailwindcss.com/docs/installation/using-vite
