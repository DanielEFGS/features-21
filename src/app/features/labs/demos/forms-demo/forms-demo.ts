import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { email, FormField, form, required } from '@angular/forms/signals';

type TrainerContactModel = {
  name: string;
  email: string;
  acceptTerms: boolean;
};

/**
 * Read-only demo used in the Signal Forms lab.
 */
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
    required(schema.name, { message: $localize`:@@formsDemoNameReq:Name is required.` });
    required(schema.email, { message: $localize`:@@formsDemoEmailReq:Email is required.` });
    email(schema.email, { message: $localize`:@@formsDemoEmailValid:Enter a valid email address.` });
    required(schema.acceptTerms, { message: $localize`:@@formsDemoTermsReq:Accept the terms to continue.` });
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
    if (this.canSubmit()) return $localize`:@@formsDemoReady:Ready to save.`;
    if (this.hasFeedback()) return $localize`:@@formsDemoFix:Fix the highlighted fields to continue.`;
    return $localize`:@@formsDemoComplete:Complete the fields to enable Save.`;
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
