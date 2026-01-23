# Lab: Testing (Extra)

This lab is extra content. It focuses on SSR-safe tests with Vitest, Http mocking, routing harnesses, and guarding client-only APIs. Keep it scoped to deterministic, fast specs.

## Index
- [Lab: Testing (Extra)](#lab-testing-extra)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) SSR-safe setup](#1-ssr-safe-setup)
    - [2) Mock HTTP](#2-mock-http)
    - [3) Router testing](#3-router-testing)
    - [4) Hydration guards](#4-hydration-guards)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
Tests must run without browser globals and remain deterministic. Use Angular testing utilities (RouterTestingHarness, HttpTestingController) and guard client-only APIs so specs work for SSR/hydration paths.

## Demo
The demo shows a testing readiness checklist: SSR-safe setup, HTTP mocking, router harness, hydration guards, and optional a11y smoke checks.

## Goals
- Configure specs without depending on window/document.
- Mock HTTP requests with HttpTestingController.
- Drive navigation using RouterTestingHarness.
- Guard hydration/client-only branches and assert both paths.

## Prerequisites
- Standalone components and Vitest basics.
- Familiarity with Angular testing utilities.

## Key concepts
- SSR-safe: avoid window/document; guard with typeof checks or platform flags.
- HttpTestingController: flush and verify requests in afterEach.
- RouterTestingHarness: navigate and assert rendered content.
- Hydration guard: test server/client branches explicitly.

## Guided exercise
You will build a spec for a component that loads data, navigates, and uses a client-only API, ensuring both server and client paths are covered.

## Minimum implementation

### 1) SSR-safe setup
- Import only the component under test.
- ProvideRouter with minimal routes.
- Mock client-only APIs with factories.

### 2) Mock HTTP
- Inject HttpTestingController.
- Flush expected responses; verify no outstanding requests.

### 3) Router testing
- Use RouterTestingHarness to navigate.
- Assert rendered content after navigation completes.

### 4) Hydration guards
- Guard any window/document access.
- Add tests for guarded branches (server vs client).

## Checklist
- [ ] No direct window/document access in specs.
- [ ] HTTP calls mocked and verified.
- [ ] Routing covered with RouterTestingHarness.
- [ ] Hydration/client-only branches tested.
- [ ] Optional a11y smoke check passes.

## Common pitfalls
- Leaving HTTP requests unflushed.
- Relying on real window/document in tests.
- Over-mocking routes; keep them minimal.

## A11y and UX
- For UI specs, ensure focusable elements and labels exist; a quick axe-core smoke check can catch regressions.

## Suggested tests
- Unit: component renders with mocked HTTP; update prompt or status text appears.
- Routing: harness navigation renders the target view.
- Hydration: guarded code path behaves in both server/client modes.

## References
- https://angular.dev/guide/testing
- https://angular.dev/api/router/testing/RouterTestingHarness
- https://angular.dev/api/common/http/testing/HttpTestingController
