/**
 * Read-only code samples used by the Performance demo tabs.
 */
export const PERFORMANCE_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <p class="eyebrow">Performance</p>
    <h3>Guardrails checklist</h3>
    <p class="subtitle">Budgets, defer plan, assets, and network discipline.</p>
  </header>

  <ul class="checklist" aria-label="Performance checklist">
    @for (item of items; track item.key) {
      <li class="check">
        <label>
          <input
            type="checkbox"
            [checked]="state()[item.key]"
            (change)="toggle(item.key)"
          />
          <span class="check__label">{{ item.label }}</span>
        </label>
        <p class="check__desc">{{ item.description }}</p>
      </li>
    }
  </ul>

  <div class="summary" [class.summary--ok]="readiness().missing.length === 0">
    <p class="score">Readiness: {{ readiness().score }}%</p>
    @if (readiness().missing.length === 0) {
      <p>Guardrails set: budgets, defer, assets, and network controls.</p>
    } @else {
      <p>Missing: {{ readiness().missing.join(', ') }}</p>
    }
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type PerfKey = 'budgets' | 'defer' | 'images' | 'fonts' | 'network';

type PerfItem = {
  key: PerfKey;
  label: string;
  description: string;
};

const ITEMS: PerfItem[] = [
  { key: 'budgets', label: 'Budgets set', description: 'JS/CSS limits defined and monitored.' },
  { key: 'defer', label: 'Defer plan', description: 'Non-critical views/widgets deferred or lazy.' },
  { key: 'images', label: 'Images optimized', description: 'NgOptimizedImage + sizes; lazy non-critical.' },
  { key: 'fonts', label: 'Fonts tamed', description: 'Preconnect + font-display swap.' },
  { key: 'network', label: 'Network disciplined', description: 'Concurrency capped, dedupe in place.' }
];

@Component({
  selector: 'app-performance-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './performance-demo.html',
  styleUrl: './performance-demo.css'
})
export class PerformanceDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<PerfKey, boolean>>({
    budgets: true,
    defer: false,
    images: true,
    fonts: false,
    network: true
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: PerfKey): void {
    this.state.update((current) => ({ ...current, [key]: !current[key] }));
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

.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.65rem;
}

.check {
  border: 2px solid var(--ink-900);
  padding: 0.6rem 0.75rem;
  background: var(--paper-2);
}

.check__label {
  font-weight: 700;
  margin-left: 0.35rem;
}

.check__desc {
  margin: 0.35rem 0 0;
  color: var(--ink-700);
  font-size: 0.9rem;
}

.summary {
  border: 2px solid var(--ink-900);
  padding: 0.7rem 0.85rem;
  background: #fff;
}

.summary--ok {
  background: #e9f9ed;
}

.score {
  margin: 0 0 0.35rem;
  font-weight: 800;
}
`
};
