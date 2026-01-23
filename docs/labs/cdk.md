# Lab: CDK (Extra)

This lab is extra content. It focuses on using CDK primitives (overlay, focus, portals) to build accessible UI surfaces.

## Index
- [Lab: CDK (Extra)](#lab-cdk-extra)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Overlay basics](#1-overlay-basics)
    - [2) Focus management](#2-focus-management)
    - [3) Portals](#3-portals)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
CDK provides low-level building blocks for overlays, focus management, and portals. Use them instead of bespoke DOM hacks to keep keyboard and screen-reader support predictable.

## Demo
The demo is a checklist covering overlay plan, focus helpers (cdkFocusInitial/FocusTrap), portal usage, accessibility labels, and focus restoration.

## Goals
- Build an overlay with escape/backdrop close.
- Trap focus inside and restore to trigger on close.
- Render content via a portal when relocating DOM.

## Prerequisites
- Standalone components and OnPush.
- Basic accessibility patterns (labels, focus order).

## Key concepts
- Overlay: attach/detach, backdrop clicks, escape key, focus restore.
- Focus: cdkFocusInitial, FocusTrap; avoid trapping without a close path.
- Portals: move content without breaking semantics; keep aria labelling intact.

## Guided exercise
You will build a small overlay with focus trapping, accessible labelling, and focus restoration.

## Minimum implementation

### 1) Overlay basics
- Create OverlayRef with a backdrop; close on escape/backdrop.
- Position relative to a trigger.

### 2) Focus management
- Set cdkFocusInitial on the primary action.
- Use FocusTrap to keep focus inside.
- Restore focus to trigger on close.

### 3) Portals
- Render overlay content via PortalOutlet.
- Keep aria-labelledby/aria-label on the surface.

## Checklist
- [ ] Overlay closes on escape/backdrop.
- [ ] Focus trapped inside; cdkFocusInitial set.
- [ ] Focus returns to trigger on close.
- [ ] Portal used if content moves.
- [ ] Surface is labelled for screen readers.

## Common pitfalls
- Trapping focus without a close path.
- Forgetting to restore focus to trigger.
- Moving content without preserving labels.

## A11y and UX
- Use aria-labelledby on the surface.
- Provide a visible close button.
- Ensure focus styles are visible.

## Suggested tests
- Unit: open overlay, ensure focus inside; after close focus returns to trigger.
- Unit/manual: escape/backdrop closes overlay.
- (Optional) Portal usage renders content in the target outlet.

## References
- https://material.angular.io/cdk/categories
