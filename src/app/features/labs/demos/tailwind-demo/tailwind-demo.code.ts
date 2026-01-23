/**
 * Read-only code samples used by the Tailwind demo tabs.
 */
export const TAILWIND_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">Tailwind</p>
      <h3>Utility preview</h3>
      <p class="subtitle">Toggle common utilities and see the applied class string.</p>
    </div>
  </header>

  <div class="grid">
    <fieldset class="toggles">
      <legend>Options</legend>
      <div class="toggle-list">
        @for (option of options; track option.key) {
          <label class="toggle">
            <input
              type="checkbox"
              [checked]="activeToggles()[option.key]"
              (change)="toggle(option.key)"
            />
            <div>
              <p class="toggle__title">{{ option.label }}</p>
              <p class="toggle__hint">{{ option.description }}</p>
            </div>
          </label>
        }
      </div>
    </fieldset>

    <div class="preview">
      <p class="preview__label">Preview card</p>
      <div class="card" [class]="classList()">
        <p class="card__title">Utility stack</p>
        <p class="card__body">Spacing, radius, shadow, accent, and outline are all toggleable.</p>
      </div>
      <p class="preview__label">Class string</p>
      <code class="class-string">{{ classList() }}</code>
    </div>
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ToggleKey = 'padding' | 'radius' | 'shadow' | 'accent' | 'outline';

type ToggleOption = {
  key: ToggleKey;
  label: string;
  className: string;
  description: string;
};

const TOGGLE_OPTIONS: ToggleOption[] = [
  { key: 'padding', label: 'Padding', className: 'p-5', description: 'Apply generous spacing.' },
  { key: 'radius', label: 'Rounded corners', className: 'rounded-xl', description: 'Soften edges.' },
  { key: 'shadow', label: 'Shadow', className: 'shadow-md', description: 'Lift the card slightly.' },
  { key: 'accent', label: 'Accent background', className: 'bg-slate-100', description: 'Subtle neutral fill.' },
  { key: 'outline', label: 'Outline', className: 'ring-2 ring-slate-400', description: 'Add a focus ring style.' }
];

@Component({
  selector: 'app-tailwind-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tailwind-demo.html',
  styleUrl: './tailwind-demo.css'
})
export class TailwindDemoComponent {
  readonly options = TOGGLE_OPTIONS;
  readonly activeToggles = signal<Record<ToggleKey, boolean>>({
    padding: true,
    radius: true,
    shadow: true,
    accent: true,
    outline: false
  });

  readonly classList = computed(() => {
    const active = this.activeToggles();
    const base = ['text-sm', 'font-medium', 'border', 'border-slate-900', 'transition-colors'];
    const selected = this.options
      .filter((option) => active[option.key])
      .map((option) => option.className);
    return [...base, ...selected].join(' ');
  });

  toggle(key: ToggleKey): void {
    this.activeToggles.update((current) => ({ ...current, [key]: !current[key] }));
  }
}
`,
  css: `.demo {
  display: grid;
  gap: 1rem;
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

.grid {
  display: grid;
  gap: 1rem;
}

.toggles {
  border: 2px solid var(--ink-900);
  padding: 0.75rem;
  background: var(--paper-2);
}

.toggles legend {
  font-weight: 700;
  padding: 0 0.25rem;
}

.toggle-list {
  display: grid;
  gap: 0.65rem;
  margin-top: 0.5rem;
}

.toggle {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
  align-items: start;
}

.toggle__title {
  margin: 0;
  font-weight: 700;
  font-size: 0.9rem;
}

.toggle__hint {
  margin: 0.1rem 0 0;
  font-size: 0.8rem;
  color: var(--ink-600);
}

.preview {
  display: grid;
  gap: 0.5rem;
}

.preview__label {
  margin: 0;
  font-weight: 700;
  font-size: 0.85rem;
}

.card {
  border: 2px dashed var(--ink-500);
}

.card__title {
  margin: 0 0 0.35rem;
  font-weight: 700;
}

.card__body {
  margin: 0;
  font-size: 0.9rem;
  color: var(--ink-700);
}

.class-string {
  display: block;
  border: 2px solid var(--ink-900);
  background: var(--paper-2);
  padding: 0.5rem 0.6rem;
  font-size: 0.8rem;
  word-break: break-word;
}
`
};
