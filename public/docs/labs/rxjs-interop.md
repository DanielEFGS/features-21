# Lab: RxJS interop

This lab adapts the official Angular docs into a focused, practical exercise. The goal is to learn the essentials without copying the docs verbatim.

## Index
- [Lab: RxJS interop](#lab-rxjs-interop)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Create a signal from an Observable](#1-create-a-signal-from-an-observable)
    - [2) Create an Observable from a signal](#2-create-an-observable-from-a-signal)
    - [3) Output interop for components and directives](#3-output-interop-for-components-and-directives)
    - [4) Unsubscribe safely with takeUntilDestroyed](#4-unsubscribe-safely-with-takeuntildestroyed)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
RxJS interop lets you move data between Observables and Angular signals in a safe, idiomatic way. It also gives you helpers to bridge component outputs and to avoid memory leaks when subscribing.

## Demo
Build a small “signal-powered search helper” that:
- Debounces user input into a `query` signal.
- Emits a typed output when the user clicks “Apply”.
- Exposes that output as an Observable for logging.

## Goals
- Convert Observables to signals with `toSignal`.
- Convert signals to Observables with `toObservable`.
- Use output interop when an output is backed by RxJS.
- Unsubscribe automatically with `takeUntilDestroyed`.

## Prerequisites
- Basic RxJS knowledge (Observable, Subject, pipe).
- Understanding of signals, computed, and effects.
- Familiarity with component outputs.

## Key concepts
- `toSignal(observable, options)` gives you a signal that updates with emissions.
- `toObservable(signal, options)` gives you an Observable view of a signal.
- `outputFromObservable` and `outputToObservable` bridge outputs to RxJS.
- `takeUntilDestroyed` handles cleanup without manual Subjects.

Notes:
- `toSignal` runs in an injection context by default (constructor or `inject`).
- Provide `initialValue` for predictable first render.
- Use `requireSync: true` only when your Observable can emit synchronously.
- `takeUntilDestroyed` accepts an optional `DestroyRef` if used outside an injection context.

## Guided exercise
**Story:** on `/labs/rxjs-interop`, build a mini “search helper” that converts input events to a debounced signal, and also exposes output streams for parent listeners.

**UI basics:**
- A search input with live preview of the debounced query.
- A button that emits an output event.
- A log panel that listens to the output as an Observable.

## Minimum implementation
### 1) Create a signal from an Observable
```ts
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-rxjs-interop-demo',
  templateUrl: './rxjs-interop-demo.html',
  styleUrl: './rxjs-interop-demo.css'
})
export class RxjsInteropDemo {
  private readonly input$ = new Subject<string>();

  readonly query = toSignal(
    this.input$.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' }
  );

  readonly hasQuery = computed(() => this.query().trim().length > 0);

  onInput(value: string): void {
    this.input$.next(value);
  }
}
```

### 2) Create an Observable from a signal
```ts
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

const query$ = toObservable(this.query).pipe(
  map((value) => value.trim().toLowerCase())
);
```

### 3) Output interop for components and directives
```ts
import { Component, output } from '@angular/core';
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rxjs-output-demo',
  templateUrl: './rxjs-output-demo.html',
  styleUrl: './rxjs-output-demo.css'
})
export class RxjsOutputDemo {
  private readonly actions$ = new Subject<string>();

  readonly action = outputFromObservable(this.actions$);
  readonly action$ = outputToObservable(this.action);

  emitAction(value: string): void {
    this.actions$.next(value);
  }
}
```

### 4) Unsubscribe safely with takeUntilDestroyed
```ts
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-rxjs-cleanup-demo',
  template: '<p>Check the console for ticks.</p>'
})
export class RxjsCleanupDemo {
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => console.log('tick'));
  }
}
```

## Checklist
- [ ] The lab uses a clear goal, concepts, and prerequisites section.
- [ ] The guided exercise is practical and uses a real UI interaction.
- [ ] `toSignal` uses `initialValue` for predictable UI.
- [ ] `toObservable` bridges a signal into an RxJS pipeline.
- [ ] Output interop is used for at least one component output.
- [ ] `takeUntilDestroyed` is used for any manual subscription.
- [ ] A11y labels and focus states are present.
- [ ] Suggested tests cover the main behaviors.

## Common pitfalls
- Creating `toSignal` outside an injection context.
- Forgetting `initialValue` and rendering `undefined`.
- Using `requireSync` with asynchronous Observables.
- Manually managing a `destroy$` Subject when `takeUntilDestroyed` is available.

## A11y and UX
- Keep input labels connected with `for` + `id`.
- Provide keyboard-accessible buttons and clear focus styles.
- Announce loading or empty states with text.

## Suggested tests
- Debounced input updates the signal after the delay.
- Output Observable emits when the button triggers.
- Subscription is cleaned up on destroy.

## References
- https://angular.dev/ecosystem/rxjs-interop
- https://angular.dev/ecosystem/rxjs-interop/output-interop
- https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed
