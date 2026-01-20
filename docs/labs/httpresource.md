# Lab: httpResource

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
`httpResource` gives you reactive data fetching built on top of `HttpClient`. It returns a `Resource` signal that keeps track of the request state (value, loading, error) and re-fetches when its inputs change.

## Goals
- Fetch data reactively with `httpResource`.
- Model UI states (loading, error, empty, success).
- Use typed parsing/validation for response shape.
- Trigger reloads in a predictable way.

## Prerequisites
- Familiarity with `HttpClient`.
- Understanding of signals and computed.
- Basic routing and lab layout.

## Key concepts
- `httpResource(() => requestConfig)`: creates a reactive resource.
- `resource.value()`: returns the latest value (or `undefined` while loading).
- `resource.status()`: returns `'idle' | 'loading' | 'error' | 'success'`.
- `resource.error()`: exposes the last error (if any).
- `resource.reload()`: forces a reload.

Notes:
- `httpResource` is reactive; any signal it reads will re-trigger the request.
- Keep parsing/validation close to the resource for consistent state.
- Control how often inputs change to avoid unnecessary requests (debounce or explicit apply).

## Guided exercise
**Story:** on `/labs/httpresource`, build a mini “Pokemon lookup” that fetches a Pokemon by name and displays its basic info.

**UI basics:**
- Search input + “Load” button.
- Result card with name + id + type list.
- Loading and error messaging.

## Optimization strategies
- **Debounce input** by keeping a `pendingQuery` signal and only applying on button click or Enter.
- **Throttle re-fetches** by deriving the request from a debounced signal (e.g., RxJS `debounceTime` + `toSignal`).
- **Avoid queueing** by disabling the Load button while loading.

### Debounce with a pending signal
```ts
readonly pendingQuery = signal('pikachu');
readonly query = signal('pikachu');

applyQuery(): void {
  const next = this.pendingQuery().trim().toLowerCase();
  if (!next) return;
  this.query.set(next);
  this.pokemonResource.reload();
}
```

### Debounce typing with RxJS + toSignal
```ts
const input$ = new Subject<string>();
readonly query = toSignal(input$.pipe(debounceTime(400)), { initialValue: 'pikachu' });
```

### Prevent queued requests while loading
```html
<button type="button" (click)="applyQuery()" [disabled]="status() === 'loading'">
  Load
</button>
```

## Minimum implementation
### 1) Define state and request inputs
- `query`: a signal holding the requested name.
- `requestConfig`: computed to build the request config.

```ts
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

type PokemonDto = {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
};

type PokemonView = {
  id: number;
  name: string;
  types: string[];
};

@Component({
  selector: 'pdx-lab-httpresource',
  templateUrl: './httpresource-lab.html',
  styleUrl: './httpresource-lab.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpResourceLabPage {
  private readonly http = inject(HttpClient);
  readonly query = signal('pikachu');

  readonly requestConfig = computed(() => ({
    url: `https://pokeapi.co/api/v2/pokemon/${this.query().trim().toLowerCase()}`,
    method: 'GET' as const
  }));
}
```

### 2) Create the resource with parsing

```ts
readonly pokemonResource = httpResource<PokemonView>(() => this.requestConfig(), {
  parse: (payload) => ({
    id: (payload as PokemonDto).id,
    name: (payload as PokemonDto).name,
    types: (payload as PokemonDto).types.map((entry) => entry.type.name)
  })
});
```

### 3) Derive UI state

```ts
readonly status = computed(() => this.pokemonResource.status());
readonly pokemon = computed(() => this.pokemonResource.value() ?? null);
readonly errorMessage = computed(() => {
  return this.pokemonResource.error() ? 'Unable to load Pokemon.' : '';
});
```

### 4) Template wiring

```html
<section class="lab-panel">
  <h1>httpResource: Pokemon lookup</h1>

  <div class="search-row">
    <label class="field-label" for="pokemon-name">Pokemon name</label>
    <input
      id="pokemon-name"
      type="text"
      [value]="query()"
      (input)="query.set($any($event.target).value)"
    />
    <button type="button" (click)="pokemonResource.reload()">Load</button>
  </div>

  @if (status() === 'loading') {
    <p class="status">Loading...</p>
  } @else if (status() === 'error') {
    <p class="status status--error">{{ errorMessage() }}</p>
  } @else if (pokemon()) {
    <article class="pokemon-card">
      <h2>{{ pokemon()!.name }}</h2>
      <p>ID: {{ pokemon()!.id }}</p>
      <ul>
        @for (type of pokemon()!.types; track type) {
          <li>{{ type }}</li>
        }
      </ul>
    </article>
  } @else {
    <p class="status">Search for a Pokemon to begin.</p>
  }
</section>
```

## Checklist
- [ ] Request config uses `computed`.
- [ ] `httpResource` parses data into a UI shape.
- [ ] Loading, error, and empty states are rendered.
- [ ] Reload uses `pokemonResource.reload()`.

## Common pitfalls
- Building URLs directly in the template.
- Not handling the empty state when `value()` is undefined.
- Using `effect` instead of `httpResource` for data fetching.
- Triggering a request on every keystroke without debounce.

## A11y and UX
- Label inputs with `for` + `id`.
- Provide visible focus styles.
- Announce loading/error states with clear text.

## Suggested tests
- Changing `query` triggers a new request.
- Error state shows when API rejects.
- Reload triggers a new fetch.

## References
- https://angular.dev/guide/http/http-resource
