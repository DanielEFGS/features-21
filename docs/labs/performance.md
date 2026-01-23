# Lab: Performance (Extra)

This lab is extra content. It focuses on practical guardrails: budgets, defer/lazy strategies, asset loading, and network discipline. Scope stays educational and avoids deep tuning.

## Index
- [Lab: Performance (Extra)](#lab-performance-extra)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Budgets](#1-budgets)
    - [2) Defer/lazy](#2-deferlazy)
    - [3) Assets](#3-assets)
    - [4) Network discipline](#4-network-discipline)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
Performance improves by shipping less and waiting less. Set budgets, defer non-critical work, control assets (images/fonts), and keep the network lean. Measure with devtools and build output.

## Demo
The demo shows a guardrails checklist: budgets, defer plan, image/font hygiene, and network discipline.

## Goals
- Define JS/CSS budgets and watch for regressions.
- Defer or lazy-load non-critical UI.
- Optimize images/fonts to avoid layout shift.
- Reduce duplicate or excessive concurrent requests.

## Prerequisites
- SSR/hydration basics.
- Familiarity with defer blocks and route render modes.
- Ability to read bundle outputs/network waterfall.

## Key concepts
- Budgets: fail builds or alert when JS/CSS grows.
- Defer/lazy: delay secondary UI until needed.
- Assets: NgOptimizedImage, explicit sizes, font preconnect + swap.
- Network: dedupe requests, cap concurrency, avoid SW API caching.

## Guided exercise
You will add budgets, pick defer candidates, and propose asset/network fixes for the app.

## Minimum implementation

### 1) Budgets
- Define JS/CSS budgets in tooling/angular config.
- Note current bundle sizes for baseline.

### 2) Defer/lazy
- Identify offscreen/secondary routes or widgets to defer.
- Avoid hydrating hidden UI until requested.

### 3) Assets
- Use NgOptimizedImage with width/height.
- Preconnect fonts/CDN; set font-display: swap.
- Lazy-load non-critical media.

### 4) Network discipline
- Keep detail fetch concurrency capped (8 here).
- Dedupe identical requests in the data layer.
- Do not cache APIs in the service worker.

## Checklist
- [ ] Budgets defined and monitored.
- [ ] Defer/lazy plan for non-critical UI.
- [ ] Images/fonts optimized with minimal layout shift.
- [ ] Network deduplication and concurrency controls in place.

## Common pitfalls
- Ignoring budgets after first setup.
- Hydrating hidden UI.
- Heavy fonts without preconnect/swap.
- Caching APIs in the service worker.

## A11y and UX
- Keep skeletons/fallbacks accessible with discernible text.
- Avoid layout jumps that break focus/reading order.

## Suggested tests
- Manual: compare bundle sizes vs budgets; run Lighthouse for LCP/CLS sanity.
- Unit: ensure data-layer concurrency cap remains configured.
- Manual: verify deferred/lazy pieces load on demand without blocking first paint.

## References
- https://angular.dev/guide/performance
- https://angular.dev/guide/defer
- https://angular.dev/guide/images
