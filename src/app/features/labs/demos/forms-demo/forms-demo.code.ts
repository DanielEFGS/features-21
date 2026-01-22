/**
 * Read-only code samples used by the Signal Forms demo tabs.
 */
export const FORMS_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">Signal Forms</p>
      <h3>Trainer contact form</h3>
      <p class="subtitle">Model-driven fields with schema validation and field state feedback.</p>
    </div>
    <div class="header-actions">
      <button type="button" class="ghost" (click)="prefill()">Prefill</button>
      <button type="button" class="ghost" (click)="reset()">Reset</button>
    </div>
  </header>

  <form class="form" (submit)="onSubmit($event)">
    <label class="field">
      <span class="field__label">Trainer name</span>
      <input type="text" [formField]="trainerForm.name" autocomplete="name" />
    </label>
    @if (showNameErrors()) {
      <ul class="field-errors" role="alert" aria-live="polite">
        @for (error of trainerForm.name().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }

    <label class="field">
      <span class="field__label">Email</span>
      <input type="email" [formField]="trainerForm.email" autocomplete="email" />
    </label>
    @if (showEmailErrors()) {
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
    @if (showTermsErrors()) {
      <p class="field-error" role="alert">Accept the terms to continue.</p>
    }

    <div class="form-footer">
      <p class="status" [class.status--error]="showSummary()">{{ statusText() }}</p>
      <button type="submit" [disabled]="!canSubmit()">Save</button>
    </div>
  </form>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { email, FormField, form, required } from '@angular/forms/signals';

type TrainerContactModel = {
  name: string;
  email: string;
  acceptTerms: boolean;
};

@Component({
  selector: 'app-forms-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
  imports: [FormField]
})
export class FormsDemoComponent {
  readonly model = signal<TrainerContactModel>({
    name: '',
    email: '',
    acceptTerms: false
  });

  readonly trainerForm = form(this.model, (schema) => {
    required(schema.name, { message: 'Name is required.' });
    required(schema.email, { message: 'Email is required.' });
    email(schema.email, { message: 'Enter a valid email address.' });
    required(schema.acceptTerms, { message: 'Accept the terms to continue.' });
  });

  readonly submitAttempted = signal(false);

  readonly hasTouched = computed(
    () =>
      this.trainerForm.name().touched() ||
      this.trainerForm.email().touched() ||
      this.trainerForm.acceptTerms().touched()
  );

  readonly hasFeedback = computed(() => this.submitAttempted() || this.hasTouched());
  readonly canSubmit = computed(() => this.trainerForm().valid());
  readonly showSummary = computed(() => this.hasFeedback() && this.trainerForm().invalid());

  readonly showNameErrors = computed(() => this.hasFeedback() && this.trainerForm.name().invalid());
  readonly showEmailErrors = computed(() => this.hasFeedback() && this.trainerForm.email().invalid());
  readonly showTermsErrors = computed(() => this.hasFeedback() && this.trainerForm.acceptTerms().invalid());

  readonly statusText = computed(() => {
    if (this.canSubmit()) return 'Ready to save.';
    if (this.hasFeedback()) return 'Fix the highlighted fields to continue.';
    return 'Complete the fields to enable Save.';
  });

  /**
   * Prefills the form with sample values.
   */
  prefill(): void {
    this.model.set({
      name: 'Misty',
      email: 'misty@pokedex.dev',
      acceptTerms: true
    });
    this.submitAttempted.set(false);
  }

  /**
   * Resets the form data to its initial defaults.
   */
  reset(): void {
    this.model.set({
      name: '',
      email: '',
      acceptTerms: false
    });
    this.submitAttempted.set(false);
  }

  /**
   * Handles submit intent and keeps the model as the source of truth.
   * @param event Native submit event from the form.
   */
  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.submitAttempted.set(true);
    if (this.trainerForm().invalid()) return;
  }
}
`,
  css: `.demo {
  display: grid;
  gap: 1rem;
}

.demo-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
}

.demo-header h3 {
  margin: 0.3rem 0 0;
  font-size: 1rem;
  font-weight: 700;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.65rem;
  color: var(--ink-600);
}

.subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--ink-600);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ghost {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.35rem 0.75rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink-900);
}

.form {
  display: grid;
  gap: 0.75rem;
  border: 2px solid var(--ink-900);
  background: var(--paper-2);
  padding: 0.9rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.field input[type='text'],
.field input[type='email'] {
  border: 2px solid var(--ink-900);
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
}

.field--checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.field--checkbox input {
  width: 16px;
  height: 16px;
}

.field-errors {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: #b42318;
}

.field-error {
  margin: 0;
  font-size: 0.75rem;
  color: #b42318;
}

.form-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.status {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-600);
}

.status--error {
  color: #b42318;
}

.form-footer button {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.35rem 0.9rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink-900);
}

.form-footer button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`
};
