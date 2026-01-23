# Lab: Signals

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
Signals are Angular's native reactive state primitive. A signal holds a value, a computed derives new values, and an effect runs side effects when dependencies change.

## Goals
- Model local state with signals.
- Derive values with computed to keep templates clean.
- Use effect only for side effects (not for derived state).
- Update signals with set or update (no mutate).

## Prerequisites
- Know the basics of standalone components.
- Use modern control flow: `@if` and `@for`.
- Understand the Pokedex feature layout.
- Use `NgOptimizedImage` for static images.

## Key concepts
- `signal(initialValue)`: synchronous source of truth.
- `computed(() => ...)`: derived value recomputed on dependency changes.
- `effect(() => ...)`: runs side effects when dependencies change.
- `update(fn)`: immutable update for arrays or objects.
- `set(value)`: replace the full value.

Notes:
- Do not use `mutate` on signals.
- Keep heavy logic out of templates.
- Effects are for non-reactive APIs (storage, analytics, DOM).

## Guided exercise
**Story:** on `/labs/signals`, build a quick-compare panel that lets the user pick up to 3 Pokemon and shows a derived summary.

**UI basics:**
- A small list of Pokemon (mock or local data) with "Add" and "Remove" buttons.
- A summary like "Selected: 2/3" and a limit indicator.
- A details block that updates based on the current selection.

## Minimum implementation
### 1) Base state with signals
- `availablePokemon`: fixed list for the lab.
- `selectedNames`: selected Pokemon names.

```ts
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

type PokemonSummary = {
  name: string;
  type: string;
  spriteUrl: string;
};

@Component({
  selector: 'pdx-lab-signals',
  templateUrl: './signals-lab.html',
  styleUrl: './signals-lab.css',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsLabPage {
  readonly availablePokemon = signal<PokemonSummary[]>([
    { name: 'pikachu', type: 'electric', spriteUrl: '/assets/pokemon/pikachu.png' },
    { name: 'bulbasaur', type: 'grass', spriteUrl: '/assets/pokemon/bulbasaur.png' },
    { name: 'charmander', type: 'fire', spriteUrl: '/assets/pokemon/charmander.png' },
  ]);

  readonly selectedNames = signal<string[]>([]);

  add(name: string): void {
    this.selectedNames.update((current) => {
      if (current.includes(name)) return current;
      if (current.length >= 3) return current;
      return [...current, name];
    });
  }

  remove(name: string): void {
    this.selectedNames.update((current) => current.filter((item) => item !== name));
  }
}
```

### 2) Derived values with computed
- Selected count.
- Filtered detail list.
- Summary label.

```ts
readonly selectedCount = computed(() => this.selectedNames().length);

readonly selectedDetails = computed(() => {
  const selected = this.selectedNames();
  return this.availablePokemon().filter((item) => selected.includes(item.name));
});

readonly summaryText = computed(() => {
  const count = this.selectedCount();
  return `Selected: ${count}/3`;
});

readonly isLimitReached = computed(() => this.selectedCount() >= 3);
```

### 3) Controlled side effect
Use an effect to persist selection to sessionStorage on the client.

```ts
readonly persistSelection = effect(() => {
  const value = this.selectedNames();
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem('lab-signals-selection', JSON.stringify(value));
});
```

### 4) Template with modern control flow

```html
<section class="lab-panel">
  <h1>Signals: quick compare</h1>

  <p class="summary">{{ summaryText() }}</p>

  <ul class="pokemon-list">
    @for (item of availablePokemon(); track item.name) {
      <li class="pokemon-item">
        <span>{{ item.name }}</span>
        <button type="button" (click)="add(item.name)" [disabled]="isLimitReached()">Add</button>
        <button type="button" (click)="remove(item.name)">Remove</button>
      </li>
    }
  </ul>

  @if (selectedDetails().length === 0) {
    <p class="empty">Select up to 3 Pokemon to compare.</p>
  } @else {
    <div class="details">
      @for (item of selectedDetails(); track item.name) {
        <article class="detail-card">
          <img [ngSrc]="item.spriteUrl" [alt]="item.name" width="80" height="80" />
          <h2>{{ item.name }}</h2>
          <p>Type: {{ item.type }}</p>
        </article>
      }
    </div>
  }
</section>
```

## Checklist
- [x] Selection state uses `signal`.
- [x] Derived values use `computed`.
- [x] No heavy logic in the template.
- [x] No `mutate` usage.
- [x] There is one real side effect using `effect`.

## Common pitfalls
- Filtering inside the template instead of a computed.
- Using `effect` to compute state instead of `computed`.
- Mutating arrays with `push` or `splice` without returning a new array.

## A11y and UX
- Ensure visible focus on buttons.
- Use `button` with `type="button"`.
- Provide empty-state feedback.

## Suggested tests
- Initial render shows 0 selected.
- Add up to 3 items and lock the add button.
- Remove an item and verify `summaryText` updates.

## References
- https://angular.dev/guide/signals
- https://angular.dev/guide/signals#computed
- https://angular.dev/guide/signals#effects
- https://angular.dev/guide/signals#linked-signal
