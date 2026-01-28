import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ToastItem = {
  id: string;
  message: string;
};

/**
 * Read-only demo used in the Animations lab.
 */
@Component({
  selector: 'app-animations-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './animations-demo.html',
  styleUrl: './animations-demo.css'
})
export class AnimationsDemoComponent {
  private readonly nextId = signal(0);
  readonly toasts = signal<ToastItem[]>([]);

  readonly toastCount = computed(() => this.toasts().length);
  readonly statusText = computed(() =>
    this.toastCount() === 0
      ? $localize`:@@animDemoEmpty:No toasts in the queue.`
      : $localize`:@@animDemoActive:Active toasts: ${this.toastCount()}`
  );

  /**
   * Adds a new toast message to the list.
   */
  addToast(): void {
    const id = this.nextId().toString(10);
    const messageIndex = (this.nextId() % 5) + 1;
    const message = $localize`:@@animDemoSaved:Saved update #${messageIndex}`;
    this.nextId.update((value) => value + 1);
    this.toasts.update((current) => [...current, { id, message }]);
  }

  /**
   * Removes a toast by id.
   * @param id Toast id.
   */
  removeToast(id: string): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  /**
   * Clears all toasts.
   */
  clearAll(): void {
    this.toasts.set([]);
  }
}
