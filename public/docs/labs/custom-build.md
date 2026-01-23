# Lab: Custom build (Extra)

This lab is extra content. It focuses on planning a custom build pipeline: goals, tradeoffs, caching, SSR checks, and rollback. Keep changes intentional and documented.

## Index
- [Lab: Custom build (Extra)](#lab-custom-build-extra)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Goals and constraints](#1-goals-and-constraints)
    - [2) Pipeline outline](#2-pipeline-outline)
    - [3) Caching and artifacts](#3-caching-and-artifacts)
    - [4) SSR/CSR checks](#4-ssrcsr-checks)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
Customize the build only when you have a clear goal (faster CI, custom transforms). Changing defaults increases maintenance and SSR/hydration risk, so document goals, steps, and rollback.

## Demo
The demo shows a pipeline checklist: goals/constraints, steps, cache plan, SSR checks, and rollback/observability.

## Goals
- Document why you need a custom build.
- Outline steps, tools, and artifacts.
- Plan cache keys and invalidation.
- Include SSR/CSR validation and rollback.

## Prerequisites
- Comfort with CLI builders and CI.
- Basic Vite/ESBuild awareness.

## Key concepts
- Goals/constraints: metrics + guardrails before changing anything.
- Pipeline outline: lint → test → build (SSR/CSR), tools and artifacts.
- Caching: node_modules/.angular cache keyed by lockfile; artifact uploads.
- SSR checks: smoke render + hydration watch; keep renderMode intact.
- Rollback/observability: know how to revert and observe failures.

## Guided exercise
You will draft a build strategy that balances speed and safety, with explicit caches and validation steps.

## Minimum implementation

### 1) Goals and constraints
- Write the target metrics (build time, bundle size) and constraints (SSR, source maps).
- Assign ownership for maintaining the pipeline.

### 2) Pipeline outline
- Describe steps and tools (Angular CLI/Vite + any plugins).
- List expected artifacts (dist, coverage, logs).

### 3) Caching and artifacts
- Cache node_modules and .angular/cache keyed by the lockfile.
- Upload dist artifacts; invalidate cache on config/builder changes.

### 4) SSR/CSR checks
- Add SSR build + smoke render; watch for hydration errors.
- Keep lint/test stages; ensure renderMode is unchanged.

## Checklist
- [ ] Goals/constraints documented.
- [ ] Pipeline steps/tools and artifacts listed.
- [ ] Cache keys/invalidation rules defined.
- [ ] SSR/CSR validation included.
- [ ] Rollback/observability noted.

## Common pitfalls
- Changing builders without SSR validation.
- Stale caches after config changes.
- Missing rollback path.

## A11y and UX
- Keep build prompts/logs readable; avoid hiding actionable errors.

## Suggested tests
- Pipeline dry-run: build SSR/CSR and smoke-render a route.
- Verify cache invalidation by bumping the lockfile and observing cache miss.
- Lint/test stages stay green after pipeline changes.

## References
- https://angular.dev/guide/cli-builder
