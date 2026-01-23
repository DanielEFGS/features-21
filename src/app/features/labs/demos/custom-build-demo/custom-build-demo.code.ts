/**
 * Read-only code samples used by the Custom build demo tabs.
 */
export const CUSTOM_BUILD_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <p class="eyebrow">Custom build</p>
    <h3>Pipeline plan checklist</h3>
    <p class="subtitle">Goals, steps, cache, SSR checks, and rollback.</p>
  </header>

  <ul class="checklist" aria-label="Custom build checklist">
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
      <p>Pipeline is planned with cache, SSR checks, and rollback.</p>
    } @else {
      <p>Missing: {{ readiness().missing.join(', ') }}</p>
    }
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type BuildKey = 'goals' | 'pipeline' | 'cache' | 'ssrChecks' | 'rollback';

type BuildItem = {
  key: BuildKey;
  label: string;
  description: string;
};

const ITEMS: BuildItem[] = [
  { key: 'goals', label: 'Goals/constraints', description: 'Metrics + constraints written down.' },
  { key: 'pipeline', label: 'Pipeline steps', description: 'Lint → test → build with tools noted.' },
  { key: 'cache', label: 'Cache/artifacts', description: 'Cache keys + invalidation plan set.' },
  { key: 'ssrChecks', label: 'SSR/CSR checks', description: 'Smoke render + hydration watch included.' },
  { key: 'rollback', label: 'Rollback/observability', description: 'Fallback and logs/metrics defined.' }
];

@Component({
  selector: 'app-custom-build-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-build-demo.html',
  styleUrl: './custom-build-demo.css'
})
export class CustomBuildDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<BuildKey, boolean>>({
    goals: true,
    pipeline: true,
    cache: false,
    ssrChecks: false,
    rollback: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: BuildKey): void {
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
