/**
 * Read-only code samples used by the Testing demo tabs.
 */
export const TESTING_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <p class="eyebrow">Testing</p>
    <h3>SSR-safe testing checklist</h3>
    <p class="subtitle">Mock HTTP, drive routing, and guard client-only APIs.</p>
  </header>

  <ul class="checklist" aria-label="Testing checklist">
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
      <p>Tests are SSR-safe with mocked HTTP and guarded client APIs.</p>
    } @else {
      <p>Missing: {{ readiness().missing.join(', ') }}</p>
    }
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type TestKey = 'ssrSafe' | 'httpMock' | 'routerHarness' | 'hydrationGuard' | 'a11yCheck';

type TestItem = {
  key: TestKey;
  label: string;
  description: string;
};

const ITEMS: TestItem[] = [
  { key: 'ssrSafe', label: 'SSR-safe setup', description: 'No window/document; use guards/mocks.' },
  { key: 'httpMock', label: 'HTTP mocked', description: 'HttpTestingController flushes requests.' },
  { key: 'routerHarness', label: 'Router harness', description: 'RouterTestingHarness drives navigation.' },
  { key: 'hydrationGuard', label: 'Hydration guard', description: 'Branches covered for server/client differences.' },
  { key: 'a11yCheck', label: 'A11y smoke', description: 'Optional axe-core or similar check for markup.' }
];

@Component({
  selector: 'app-testing-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testing-demo.html',
  styleUrl: './testing-demo.css'
})
export class TestingDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<TestKey, boolean>>({
    ssrSafe: true,
    httpMock: true,
    routerHarness: false,
    hydrationGuard: false,
    a11yCheck: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: TestKey): void {
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
