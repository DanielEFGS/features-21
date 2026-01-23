# Lab: Animations

This lab adapts the official Angular docs into a focused, practical exercise. The goal is to learn the essentials without copying the docs verbatim.

## Index
- [Overview](#overview)
- [Goals](#goals)
- [Prerequisites](#prerequisites)
- [Key concepts](#key-concepts)
- [Guided exercise](#guided-exercise)
- [Minimum implementation](#minimum-implementation)
- [Checklist](#checklist)
- [Common pitfalls](#common-pitfalls)
- [A11y and UX](#a11y-and-ux)
- [Suggested tests](#suggested-tests)
- [References](#references)

## Overview
Angular's modern animation story focuses on CSS-based motion with two compiler APIs: `animate.enter` and `animate.leave`. You can pair these with standard CSS animations, transitions, and the View Transitions API for route changes.

## Goals
- Use `animate.enter` and `animate.leave` for element entry/exit.
- Build reusable CSS animations with keyframes or transitions.
- Trigger animations with state changes and control flow.
- Understand how route view transitions are enabled and styled.

## Prerequisites
- Standalone components and OnPush.
- Modern control flow (`@if`, `@for`).
- Comfortable with CSS transitions and keyframes.

## Key concepts
- `animate.enter`: applies classes when elements enter the DOM.
- `animate.leave`: applies classes when elements leave the DOM.
- `@starting-style`: provides a from-state for CSS transitions.
- `animationComplete()`: required for function-based `animate.leave`.
- `withViewTransitions()`: enables route transitions using the browser API.

Notes:
- `animate.enter`/`animate.leave` are compiler APIs, not directives.
- Do not mix legacy Angular animations with `animate.enter`/`animate.leave` in the same component.
- View transition CSS must live in global styles.

## Guided exercise
**Story:** on `/labs/animations`, animate a "Toast queue" where items enter, leave, and stagger.

**UI basics:**
- Button to add a toast.
- List of toasts with close buttons.
- A "Clear all" action.

## Minimum implementation
### 1) Animate entering and leaving elements

```html
@if (isOpen()) {
  <div class="toast" animate.enter="toast-enter" animate.leave="toast-leave">
    Toast saved.
  </div>
}
```

```css
.toast-enter {
  animation: toast-in 220ms ease-out;
}

.toast-leave {
  animation: toast-out 180ms ease-in;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}
```

### 2) Use transitions with @starting-style

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 160ms ease, transform 160ms ease;
  @starting-style {
    opacity: 0;
    transform: translateY(10px);
  }
}
```

### 3) Stagger a list

```html
<ul class="toast-list">
  @for (toast of toasts(); track toast.id) {
    <li class="toast-item" style="--index: {{ toast.index }}">
      <div class="toast" animate.enter="toast-enter" animate.leave="toast-leave">
        {{ toast.message }}
      </div>
    </li>
  }
</ul>
```

```css
.toast-item {
  transition: opacity 220ms ease, transform 220ms ease;
  transition-delay: calc(40ms * var(--index));
  @starting-style {
    opacity: 0;
    transform: translateY(8px);
  }
}
```

### 4) Route transitions (View Transitions API)

```ts
import { provideRouter, withViewTransitions } from '@angular/router';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withViewTransitions())]
});
```

```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: fade-up 200ms ease;
}
```

## Checklist
- [ ] Entry and exit motion uses `animate.enter` and `animate.leave`.
- [ ] CSS animations are reusable and named.
- [ ] Staggering uses delay based on index.
- [ ] Route transitions are enabled with `withViewTransitions()`.
- [ ] Motion respects reduced-motion users.

## Common pitfalls
- Putting `animate.leave` on a child of the removed node (it will not run).
- Forgetting `animationComplete()` when using function callbacks.
- Mixing legacy animations with `animate.enter`/`animate.leave` in the same component.
- Defining view transition CSS in component styles (it must be global).

## A11y and UX
- Respect `prefers-reduced-motion` to disable or simplify motion.
- Keep durations short and purposeful.
- Avoid motion that blocks interaction.

## Suggested tests
- Enter/leave classes are applied and removed.
- Clearing the list removes items after leave animation.
- Route transitions are skipped when only fragment changes.

## References
- https://angular.dev/guide/animations
- https://angular.dev/guide/animations/css
- https://angular.dev/guide/routing/route-transition-animations
