# Lab: PWA (Extra)

This lab is extra content. It focuses on installability, app-shell caching, and update flows. It stays within the repo’s rule: cache static assets only, no PokéAPI caching.

## Index
- [Lab: PWA (Extra)](#lab-pwa-extra)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) App shell only](#1-app-shell-only)
    - [2) Manifest + icons](#2-manifest--icons)
    - [3) Update flow](#3-update-flow)
    - [4) Validation](#4-validation)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
PWA installability requires a manifest, service worker, and HTTPS. The Angular service worker can pre-cache your app shell for fast reloads and offline fallback. Do not cache PokéAPI responses; keep dynamic data in the client caching layer.

## Demo
The demo shows a PWA readiness checklist: manifest, app-shell cache, avoiding API caching, update prompt, and optional offline fallback.

## Goals
- Enable the Angular service worker for the app shell.
- Keep API responses out of the service worker cache.
- Provide a clear update prompt using SwUpdate.
- Validate installability and offline shell rendering.

## Prerequisites
- Standalone components and OnPush.
- Basic service worker lifecycle concepts.
- Access to devtools Application tab.

## Key concepts
- App shell: pre-cache static assets only.
- Manifest: `name`, `short_name`, `start_url`, `display`, icons (192/512).
- Update flow: SwUpdate `VERSION_READY` → prompt → `activateUpdate()` → reload.
- No API caching: avoid `dataGroups` for external APIs.
- Validation: Lighthouse PWA checks + offline reload of the shell.

## Guided exercise
You will add installability and an update prompt while keeping the cache limited to the app shell.

## Minimum implementation

### 1) App shell only
- Run `ng add @angular/pwa` to scaffold manifest + SW.
- Inspect `ngsw-config.json`: default assetGroups cache index/JS/CSS/icons.
- Do not add PokéAPI URLs to `dataGroups`.

### 2) Manifest + icons
- Set `name`, `short_name`, `start_url`, `scope`, `display`.
- Provide icons 192px and 512px.

### 3) Update flow
- Listen to SwUpdate `versionUpdates` for `VERSION_READY`.
- Prompt users; on accept, call `activateUpdate()` then reload.

### 4) Validation
- Lighthouse PWA checks (manifest + SW present).
- Simulate offline and reload; shell renders.
- Confirm API calls are not served from SW cache.

## Checklist
- [ ] Service worker enabled (Angular PWA).
- [ ] No API endpoints cached in SW config.
- [ ] Manifest filled with name/short_name/start_url/display/icons.
- [ ] Update prompt wired to SwUpdate `VERSION_READY`.
- [ ] Offline shell renders; APIs fail gracefully.

## Common pitfalls
- Caching API responses (stale data, quota use).
- Forgetting update UX; users stay on old versions.
- Missing icon sizes causing install prompts to fail.

## A11y and UX
- Make the update prompt keyboard focusable; announce via aria-live.
- Provide a clear offline message when data is unavailable.

## Suggested tests
- Unit: mock SwUpdate and assert `activateUpdate()` is called after acceptance.
- Manual: devtools Application > manifest + service worker present.
- Manual: offline reload shows shell; APIs fail as expected.

## References
- https://angular.dev/guide/pwa
- https://angular.dev/guide/pwa/config
- https://angular.dev/api/service-worker/SwUpdate
