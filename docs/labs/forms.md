# Lab: Forms (Signal Forms)

This lab adapts the official Angular docs into a focused, practical exercise. The goal is to learn the essentials without copying the docs verbatim.

## Index
- [Overview](#overview)
- [Demo](#demo)
- [Goals](#goals)
- [Prerequisites](#prerequisites)
- [Key concepts](#key-concepts)
- [Guided exercise](#guided-exercise)
- [Comparison with other approaches](#comparison-with-other-approaches)
- [Minimum implementation](#minimum-implementation)
  - [1) Create a form model](#1-create-a-form-model)
  - [2) Create the field tree](#2-create-the-field-tree)
  - [3) Bind fields in the template](#3-bind-fields-in-the-template)
  - [4) Read field values](#4-read-field-values)
  - [5) Update field values](#5-update-field-values)
  - [6) Handle submit and reset](#6-handle-submit-and-reset)
  - [7) Validation and field state](#7-validation-and-field-state)
  - [8) Basic input types](#8-basic-input-types)
  - [9) Model design best practices](#9-model-design-best-practices)
  - [10) Migration notes (existing apps)](#10-migration-notes-existing-apps)
- [Checklist](#checklist)
- [Common pitfalls](#common-pitfalls)
- [A11y and UX](#a11y-and-ux)
- [Suggested tests](#suggested-tests)
- [References](#references)

## Overview
Signal Forms is an experimental forms API built on Angular signals. It focuses on type-safe models, automatic two-way binding, and centralized validation rules. Because the API is experimental, avoid production use unless you accept the risk of breaking changes.

## Demo
Build a small "Trainer contact" form that demonstrates model-driven fields, validation, and field state messaging. The demo should be usable as a starting point for a real lab page in `/labs/forms`.

## Goals
- Build a small form using a signal-based form model.
- Bind fields with the `FormField` directive.
- Define validation rules in the schema (not in templates or custom controls).
- Update form data programmatically with `set` or `update`.
- Render validation feedback using field state signals.

## Prerequisites
- Angular v21+.
- Basic understanding of signals and standalone components.
- Familiarity with modern template control flow (`@if`, `@for`).
- Import Signal Forms APIs from `@angular/forms/signals`.

## Key concepts
- `signal({ ... })`: holds the form model data.
- `form(modelSignal, (schema) => { ... })`: defines the field tree and validation rules.
- `FormField` directive: connects a form field to an input for two-way data binding.
- `field().value()` and `field().value.set(...)`: read and update values.
- Validation rules live in the schema callback (e.g., `required`, `email`).
- Field state signals: `valid()`, `invalid()`, `touched()`, `dirty()`, `pending()`, `errors()`.

Notes:
- Signal Forms is experimental. Treat it as lab-only.
- Use defined defaults in your model (avoid `undefined` for fields).
- Keep validation in the schema, not inside controls or templates.

## Guided exercise
**Story:** on `/labs/forms`, build a "Trainer contact" form that collects a name, email, and a terms checkbox.

**UI basics:**
- Text input for name and email.
- Checkbox for accepting terms.
- Submit button disabled while invalid.
- Inline message when the form is invalid.

## Comparison with other approaches
Angular offers three form approaches. Use this snapshot to decide which lab path to take:

- **Signal Forms:** model lives in a writable signal, schema-based validation, types inferred from the model.
- **Reactive Forms:** model lives in FormControl/FormGroup, validators attached to controls, explicit typing.
- **Template-driven Forms:** model lives in component properties, validation via template directives, minimal typing.

**Choose Signal Forms when:**
- You are building a new signal-based app.
- You want inferred types from a single model definition.
- You are ok with experimental APIs.

**Choose Reactive Forms when:**
- You need stable production APIs today.
- Your form logic is complex or already reactive.

**Choose Template-driven Forms when:**
- You are prototyping simple forms quickly.
- Most validation fits directly in the template.

## Minimum implementation
### 1) Create a form model
- Use a `signal` model with defaults for every field.

```ts
type TrainerContactModel = {
  name: string;
  email: string;
  acceptTerms: boolean;
};
```

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'pdx-lab-forms',
  templateUrl: './forms-lab.html',
  styleUrl: './forms-lab.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsLabPage {
  readonly model = signal<TrainerContactModel>({
    name: '',
    email: '',
    acceptTerms: false,
  });
}
```

### 2) Create the field tree
- Use `form(modelSignal, schema)` to define fields and validators.
- Add `FormField` to the component imports.

```ts
import { FormField, email, form, required } from '@angular/forms/signals';

readonly trainerForm = form(this.model, (schema) => {
  required(schema.name, { message: 'Name is required' });
  required(schema.email, { message: 'Email is required' });
  email(schema.email, { message: 'Enter a valid email' });
  required(schema.acceptTerms, { message: 'You must accept the terms' });
});
```

```ts
@Component({
  selector: 'pdx-lab-forms',
  templateUrl: './forms-lab.html',
  styleUrl: './forms-lab.css',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsLabPage {}
```

### 3) Bind fields in the template

```html
<section class="lab-panel">
  <h1>Signal Forms: Trainer contact</h1>

  <form (submit)="onSubmit($event)" class="form-stack">
    <label class="field">
      <span class="field__label">Name</span>
      <input type="text" [formField]="trainerForm.name" />
    </label>

    <label class="field">
      <span class="field__label">Email</span>
      <input type="email" [formField]="trainerForm.email" />
    </label>

    @if (trainerForm.email().touched() && trainerForm.email().invalid()) {
      <ul class="field-errors" role="alert" aria-live="polite">
        @for (error of trainerForm.email().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }

    <label class="field field--checkbox">
      <input type="checkbox" [formField]="trainerForm.acceptTerms" />
      <span>I accept the terms</span>
    </label>

    @if (trainerForm().invalid()) {
      <p class="status status--error">Fix the validation errors to continue.</p>
    }

    <div class="actions">
      <button type="button" (click)="reset()">Reset</button>
      <button type="submit" [disabled]="trainerForm().invalid()">Save</button>
    </div>
  </form>

  <pre class="debug">{{ model() | json }}</pre>
</section>
```

### 4) Read field values
Use `field().value()` to read reactive field values.

```html
<p class="debug-line">Email: {{ trainerForm.email().value() }}</p>
```

### 5) Update field values
Use `field().value.set(...)` to update field values programmatically.

```ts
/** Provide the current email value for debug UIs. */
getEmailValue(): string {
  return this.trainerForm.email().value();
}

/** Pre-fill the email field with a sample value. */
prefillEmail(): void {
  this.trainerForm.email().value.set('trainer@pokedex.dev');
}
```

### 6) Handle submit and reset

```ts
/** Reset the form data to its initial defaults. */
reset(): void {
  this.model.set({
    name: '',
    email: '',
    acceptTerms: false,
  });
}

/**
 * Handle submit intent and keep the form data in sync.
 * @param event Native submit event from the form.
 */
onSubmit(event: SubmitEvent): void {
  event.preventDefault();
  if (this.trainerForm().invalid()) return;
  // In the lab, keep the model as the source of truth.
}
```

### 7) Validation and field state
Field state signals drive UI feedback.

```html
@if (trainerForm.name().touched() && trainerForm.name().invalid()) {
  <p class="field-error" role="alert">
    {{ trainerForm.name().errors()[0]?.message }}
  </p>
}
```

```ts
/** Return the overall form validity for status displays. */
isValid(): boolean {
  return this.trainerForm().valid();
}
```

### 8) Basic input types
Signal Forms works with standard input types:

```html
<!-- Text -->
<input type="text" [formField]="trainerForm.name" />

<!-- Email -->
<input type="email" [formField]="trainerForm.email" />

<!-- Checkbox -->
<input type="checkbox" [formField]="trainerForm.acceptTerms" />
```

Common additions you may need in other labs:

```html
<!-- Number -->
<input type="number" [formField]="profileForm.age" />

<!-- Date and time -->
<input type="date" [formField]="profileForm.startDate" />
<input type="time" [formField]="profileForm.startTime" />

<!-- Textarea -->
<textarea [formField]="profileForm.notes" rows="4"></textarea>

<!-- Radio group -->
<label>
  <input type="radio" value="basic" [formField]="profileForm.plan" />
  Basic
</label>
<label>
  <input type="radio" value="pro" [formField]="profileForm.plan" />
  Pro
</label>

<!-- Select -->
<select [formField]="profileForm.country">
  <option value="">Select a country</option>
  @for (country of countries(); track country.code) {
    <option [value]="country.code">{{ country.label }}</option>
  }
</select>
```

Notes:
- `<select multiple>` is not supported by `FormField` yet.
- Number inputs coerce to numbers; date/time store strings.

### 9) Model design best practices
- Initialize all fields with empty values.
- Avoid optional properties or `undefined`.
- Prefer static shapes and hide/disable fields via schema rules.

### 10) Migration notes (existing apps)
Signal Forms can interop with Reactive Forms using `compatForm` for top-down migration.

```ts
import { signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { compatForm } from '@angular/forms/signals/compat';

const passwordControl = new FormControl('', {
  validators: [Validators.required],
  nonNullable: true,
});

const userModel = signal({
  email: '',
  password: passwordControl,
});

const f = compatForm(userModel);
```

Accessing values:
- `f.password().value()` returns the control value.
- `f().value()` returns the raw model, which still contains the FormControl.

To preserve status classes (ng-valid, ng-dirty), configure Signal Forms:

```ts
import { NG_STATUS_CLASSES, provideSignalFormsConfig } from '@angular/forms/signals';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
});
```

## Checklist
- [x] Form model uses a `signal`.
- [x] Validation rules defined in the schema callback.
- [x] Template uses `FormField` for binding.
- [x] Submit button disables when invalid.
- [x] Field state drives validation feedback.

## Common pitfalls
- Using `ngModel` instead of Signal Forms bindings.
- Putting validation logic inside template expressions or custom inputs.
- Leaving fields as `undefined`, which complicates validation and UI state.
- Assuming `<select multiple>` is supported (it is not).

## A11y and UX
- Use labels with visible text for each field.
- Keep button `type` explicit.
- Provide error summaries in plain text.
- Ensure focus is visible when navigating by keyboard.
- Announce errors with `role="alert"` or `aria-live` on error containers.

## Suggested tests
- Form starts invalid and disables Save.
- Marking acceptTerms true and filling valid inputs enables Save.
- Reset returns the model to defaults.
- Prefill updates the email field and the model.

## References
- https://angular.dev/guide/forms/signals/overview
- https://angular.dev/essentials/signal-forms
- https://angular.dev/guide/forms/signals/models
- https://angular.dev/guide/forms/signals/model-design
- https://angular.dev/guide/forms/signals/validation
- https://angular.dev/guide/forms/signals/field-state-management
- https://angular.dev/guide/forms/signals/custom-controls
- https://angular.dev/guide/forms/signals/comparison
- https://angular.dev/guide/forms/signals/migration
