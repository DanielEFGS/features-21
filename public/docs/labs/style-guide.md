# Lab: Style Guide

This lab adapts the official Angular docs into a focused, practical exercise. The goal is to learn the essentials without copying the docs verbatim.

## Index
- [Lab: Style Guide](#lab-style-guide)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Naming conventions](#1-naming-conventions)
    - [2) File + folder structure](#2-file--folder-structure)
    - [3) Component API design](#3-component-api-design)
    - [4) Lint + format](#4-lint--format)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
A style guide is not aesthetics — it is a consistency contract. In Angular, consistent naming, file layout, and component APIs reduce cognitive load, make refactors safer, and keep PRs reviewable.

The goal is to apply a small set of rules everywhere:
- predictable names (selectors, classes, files)
- predictable structure (feature folders, colocated templates/styles/tests)
- predictable APIs (typed inputs/outputs, minimal template logic)

## Demo
Build a small “Naming validator” panel where a developer types:
- a selector
- a component class name
- a file name

The UI derives validity and shows suggested fixed versions.

## Goals
- Apply consistent naming for selectors, files, and classes.
- Organize files by feature with predictable colocations.
- Define component APIs that are typed and stable.
- Enforce consistency with lint + formatting.

## Prerequisites
- Standalone components.
- Basic TypeScript types.
- Modern template control flow (`@if`, `@for`).
- Your repo already uses lab demos with code tabs.

## Key concepts
- Selector naming: prefix + kebab-case.
- Class naming: PascalCase + suffix.
- File naming: kebab-case with matching `.ts/.html/.css/.spec.ts` names.
- Feature-first structure: group by feature, not by type.
- Component API: typed inputs/outputs, minimal coupling.

## Guided exercise
**Story:** you are adding a new feature “Trainer profile”. Your task is to apply the style guide from day one.

**UI basics:**
- One “trainer-profile” feature folder.
- Standalone page + one child component.
- Clean, typed API between them.
- Lint/format checks pass.

## Minimum implementation

### 1) Naming conventions
Rules (baseline):
- selector: `<project-prefix>-<kebab-case>` (pick one unique prefix for the repo, `app-` is common but `f21-` is fine too; document the choice and keep it stable)
- component class: `<PascalCase>Component`
- file name: `<kebab-case>.(ts|html|css|spec.ts)` (no `.component.` suffix)
  - `trainer-profile.ts`
  - `trainer-profile.html`
  - `trainer-profile.css`
  - `trainer-profile.spec.ts`

### 2) File + folder structure
Recommended:
- `src/app/features/<feature>/...`
- colocate: component `.ts/.html/.css/.spec.ts` together
- keep shared UI in `src/app/shared/...`

### 3) Component API design
- prefer `input()` and `output()` style APIs (typed)
- avoid “god components”
- keep template logic small: push derivations to computed/signals

### 4) Lint + format
- formatter for consistent diffs
- lint for naming + unused + import order
- tests for stable behavior

## Checklist
- [ ] Selector uses correct prefix and kebab-case.
- [ ] Class name is PascalCase and ends with Component.
- [ ] File name uses kebab-case with matching file extensions.
- [ ] Feature-first folder structure is applied.
- [ ] Inputs/outputs are typed and minimal.
- [ ] Template stays simple; logic is derived in code.
- [ ] Lint + format pass.

## Common pitfalls
- Inconsistent prefixes across apps/features.
- “shared” becoming a dumping ground.
- Overusing template expressions instead of derived state.
- Re-exporting everything from barrel files until cycles appear.

## A11y and UX
- Labels connected via `for` + `id`.
- Buttons use `type="button"` where appropriate.
- Visible focus styles.

## Suggested tests
- Valid selector/class/file show “valid”.
- Invalid input produces correct suggestions.
- “Apply suggestion” updates state.

## References
- https://angular.dev/style-guide
- https://angular.dev/guide/components
- https://angular.dev/guide/signals
