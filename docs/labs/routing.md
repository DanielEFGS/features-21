# Lab: Routing

This lab adapts the official Angular docs into a focused, practical exercise. The goal is to learn the essentials without copying the docs verbatim.

## Index
- [Lab: Routing](#lab-routing)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Provide routes](#1-provide-routes)
    - [2) Add an outlet and navigation](#2-add-an-outlet-and-navigation)
    - [3) Read route state](#3-read-route-state)
    - [4) Guard and resolve data](#4-guard-and-resolve-data)
    - [5) Customize router behavior](#5-customize-router-behavior)
    - [6) Rendering strategy notes](#6-rendering-strategy-notes)
    - [7) Testing routing and navigation](#7-testing-routing-and-navigation)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
Angular Router keeps navigation in a single-page app fast and predictable. It swaps views in place, provides URL-driven state, and integrates with rendering strategies like CSR, SSR, and SSG.

## Demo
Build a small “Lab hub” that routes between two pages: a lab list and a lab detail. Add a guard that blocks navigation when the lab id is missing, and a resolver that loads the lab metadata before rendering.

## Goals
- Define routes using standalone configuration.
- Use `RouterOutlet` and link navigation.
- Read route params and query params safely.
- Use guards and resolvers to control access and data.
- Customize routing behavior with feature flags.
- Test navigation without spinning up the whole app.

## Prerequisites
- Standalone components and `provideRouter`.
- Signals and computed for local UI state.
- Basic TypeScript types and routing concepts.

## Key concepts
- Routes map URLs to components or lazy-loaded features.
- `RouterOutlet` is where the active route renders.
- `ActivatedRoute` exposes params, data, and resolved values.
- Guards and resolvers run before navigation completes.
- Router features are configured through `provideRouter` options.

## Guided exercise
**Story:** create a “labs hub” with `/labs` and `/labs/:id` routes. Show a list of labs, then navigate to a detail view with data loaded by a resolver. Add a guard that prevents invalid IDs.

**UI basics:**
- A list of labs on the left.
- A detail panel on the right.
- A simple “Back to labs” link.

## Minimum implementation
### 1) Provide routes
```ts
import { provideRouter, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'labs', loadComponent: () => import('./labs-page').then((m) => m.LabsPage) },
  {
    path: 'labs/:id',
    loadComponent: () => import('./lab-detail-page').then((m) => m.LabDetailPage),
    canMatch: [labIdGuard],
    resolve: { lab: labResolver }
  },
  { path: '', pathMatch: 'full', redirectTo: 'labs' }
];

export const appConfig = {
  providers: [provideRouter(routes)]
};
```

### 2) Add an outlet and navigation
```html
<nav class="lab-nav">
  <a routerLink="/labs" routerLinkActive="is-active">Labs</a>
</nav>
<router-outlet></router-outlet>
```

### 3) Read route state
```ts
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

const route = inject(ActivatedRoute);
const labId = toSignal(route.paramMap.pipe(map((params) => params.get('id') ?? '')), {
  initialValue: ''
});
```

### 4) Guard and resolve data
```ts
import { inject } from '@angular/core';
import { CanMatchFn, ResolveFn, Router } from '@angular/router';

export const labIdGuard: CanMatchFn = (route) => {
  const id = route.paramMap.get('id');
  return Boolean(id);
};

export const labResolver: ResolveFn<LabSummary> = (route) => {
  const router = inject(Router);
  const id = route.paramMap.get('id');
  if (!id) {
    router.navigateByUrl('/labs');
    return null as never;
  }
  return LAB_LOOKUP[id];
};
```

### 5) Customize router behavior
```ts
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ anchorScrolling: 'enabled' }));
```

### 6) Rendering strategy notes
- Use CSR for interactive lab pages.
- Use SSR for content-heavy pages and fast first paint.
- Use SSG for stable content like docs or landing pages.

### 7) Testing routing and navigation
```ts
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';

await TestBed.configureTestingModule({
  providers: [provideRouter(routes)]
}).compileComponents();

const harness = await RouterTestingHarness.create();
await harness.navigateByUrl('/labs/pokedex');
expect(harness.routeNativeElement?.textContent).toContain('Pokedex');
```

## Checklist
- [ ] The lab uses a clear goal, concepts, and prerequisites section.
- [ ] The guided exercise includes navigation, guards, and resolvers.
- [ ] Routes are defined with `provideRouter` and lazy loading.
- [ ] Route state is read with typed params or data signals.
- [ ] Router behavior is customized with `with...` helpers.
- [ ] A11y labels and focus states are present.
- [ ] Suggested tests cover navigation behavior.

## Common pitfalls
- Navigating without `routerLink` and losing SPA behavior.
- Accessing `ActivatedRoute` snapshots when you need reactive updates.
- Forgetting to handle missing params in guards or resolvers.
- Not updating scroll behavior when using sticky headers.

## A11y and UX
- Use visible focus styles for nav links.
- Keep navigation order logical and keyboard friendly.
- Announce loading states for route transitions.

## Suggested tests
- Navigating to `/labs/:id` renders the expected content.
- Missing ids redirect back to `/labs`.
- Resolver data shows before the component renders.

## References
- https://angular.dev/guide/routing
- https://angular.dev/guide/routing/testing
- https://angular.dev/guide/routing/rendering-strategies
