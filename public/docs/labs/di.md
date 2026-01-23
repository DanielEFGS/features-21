# Lab: Dependency Injection

This lab adapts the official Angular docs into a focused, practical exercise. The goal is to learn the essentials without copying the docs verbatim.

## Index
- [Lab: Dependency Injection](#lab-dependency-injection)
  - [Index](#index)
  - [Overview](#overview)
  - [Demo](#demo)
  - [Goals](#goals)
  - [Prerequisites](#prerequisites)
  - [Key concepts](#key-concepts)
  - [Guided exercise](#guided-exercise)
  - [Minimum implementation](#minimum-implementation)
    - [1) Create a service](#1-create-a-service)
    - [2) Provide it with providedIn](#2-provide-it-with-providedin)
    - [3) Inject with inject()](#3-inject-with-inject)
    - [4) Use injection context properly](#4-use-injection-context-properly)
    - [5) Define dependency providers](#5-define-dependency-providers)
    - [6) Use hierarchical injectors](#6-use-hierarchical-injectors)
  - [Checklist](#checklist)
  - [Common pitfalls](#common-pitfalls)
  - [A11y and UX](#a11y-and-ux)
  - [Suggested tests](#suggested-tests)
  - [References](#references)

## Overview
Dependency Injection (DI) lets you request services without manually creating them. Angular wires dependencies for you, manages lifetimes, and enables easy reuse across components and services.

## Demo
Build a small “lab notes” panel that uses a shared service for state and injects it in two components. One component adds notes, the other displays them.

## Goals
- Define services with `@Injectable`.
- Use `providedIn: 'root'` for singleton services.
- Inject dependencies with `inject()`.
- Understand injection context boundaries.
- Use hierarchical providers when scope matters.

## Prerequisites
- Standalone components and signals.
- Basic TypeScript classes.
- Understanding of component lifecycles.

## Key concepts
- Services are reusable classes that hold logic or data.
- `@Injectable({ providedIn: 'root' })` registers a singleton provider.
- `inject()` is the preferred way to get dependencies.
- Providers can be scoped at root, route, component, or directive levels.

## Guided exercise
**Story:** build a “notes service” that stores short tips. Two components share the same service instance to add and list notes. Add a component-level provider to override the instance.

**UI basics:**
- Input + button to add a note.
- List of notes rendered below.
- Optional toggle showing whether the provider is root or local.

## Minimum implementation
### 1) Create a service
```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LabNotesService {
  readonly notes = signal<string[]>([]);

  add(note: string): void {
    this.notes.update((current) => [...current, note]);
  }
}
```

### 2) Provide it with providedIn
```ts
@Injectable({ providedIn: 'root' })
export class LabNotesService {}
```

### 3) Inject with inject()
```ts
import { Component, inject } from '@angular/core';
import { LabNotesService } from './lab-notes.service';

@Component({
  selector: 'app-notes-panel',
  templateUrl: './notes-panel.html',
  styleUrl: './notes-panel.css'
})
export class NotesPanelComponent {
  private readonly notesService = inject(LabNotesService);
  readonly notes = this.notesService.notes;
}
```

### 4) Use injection context properly
```ts
const notesService = inject(LabNotesService); // valid in constructor, field initializer, or factory
```

### 5) Define dependency providers
```ts
import { Component } from '@angular/core';
import { LabNotesService } from './lab-notes.service';

@Component({
  selector: 'app-notes-host',
  providers: [LabNotesService],
  template: '<app-notes-panel></app-notes-panel>'
})
export class NotesHostComponent {}
```

### 6) Use hierarchical injectors
- Root provider gives a single instance app-wide.
- Component providers create a new instance per component subtree.
- Route providers scope services to a route branch.

## Checklist
- [ ] The lab uses a clear goal, concepts, and prerequisites section.
- [ ] The guided exercise uses two components sharing a service.
- [ ] The service uses `@Injectable` with `providedIn: 'root'`.
- [ ] Components use `inject()` instead of constructor injection.
- [ ] Provider scope is demonstrated (root vs component).
- [ ] A11y labels and focus states are present.
- [ ] Suggested tests cover the service and component interaction.

## Common pitfalls
- Creating new instances manually instead of using providers.
- Using constructor injection when a field initializer works.
- Forgetting to provide a service at root or component scope.
- Calling `inject()` outside of an injection context.

## A11y and UX
- Label the input and keep buttons keyboard accessible.
- Provide clear empty and error states.
- Keep focus styles visible for interaction controls.

## Suggested tests
- Notes service updates when add is called.
- Two components share the same notes when using root provider.
- Component-level provider isolates notes when scoped locally.

## References
- https://angular.dev/guide/di
- https://angular.dev/guide/di/creating-and-using-services
- https://angular.dev/guide/di/dependency-providers
