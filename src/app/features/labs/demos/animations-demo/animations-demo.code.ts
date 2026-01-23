/**
 * Read-only code samples used by the Animations demo tabs.
 */
export const ANIMATIONS_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">Animations</p>
      <h3>Toast queue</h3>
      <p class="subtitle">Enter/leave motion with a staggered list.</p>
    </div>
    <div class="header-actions">
      <button type="button" (click)="addToast()">Add toast</button>
      <button type="button" class="ghost" (click)="clearAll()" [disabled]="toastCount() === 0">
        Clear all
      </button>
    </div>
  </header>

  <p class="status">{{ statusText() }}</p>

  <ul class="toast-list">
    @for (toast of toasts(); track toast.id; let index = $index) {
      <li
        class="toast-item"
        [style.--index]="index"
        animate.enter="toast-enter"
        animate.leave="toast-leave"
      >
        <div class="toast">
          <span>{{ toast.message }}</span>
          <button type="button" class="close" (click)="removeToast(toast.id)">Close</button>
        </div>
      </li>
    }
  </ul>

  @if (toastCount() === 0) {
    <p class="empty">Add a toast to see the entry animation.</p>
  }
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ToastItem = {
  id: string;
  message: string;
};

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
    this.toastCount() === 0 ? 'No toasts in the queue.' : \`Active toasts: \${this.toastCount()}\`
  );

  /**
   * Adds a new toast message to the list.
   */
  addToast(): void {
    const id = this.nextId().toString(10);
    const messageIndex = (this.nextId() % 5) + 1;
    const message = \`Saved update #\${messageIndex}\`;
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

.header-actions button {
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

.header-actions .ghost {
  background: transparent;
}

.header-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-600);
}

.toast-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.6rem;
}

.toast-item {
  transition: opacity 220ms ease, transform 220ms ease;
  transition-delay: calc(40ms * var(--index));
  @starting-style {
    opacity: 0;
    transform: translateY(8px);
  }
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 2px solid var(--ink-900);
  background: var(--paper-2);
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
}

.toast-enter {
  animation: toast-in 220ms ease-out;
}

.toast-leave {
  animation: toast-out 180ms ease-in;
}

.close {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.2rem 0.5rem;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  cursor: pointer;
}

.empty {
  margin: 0;
  font-size: 0.85rem;
  color: var(--ink-600);
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
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(16px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-item,
  .toast,
  .toast-enter,
  .toast-leave {
    animation: none !important;
    transition: none !important;
  }
}
`
};
