/**
 * Read-only code samples used by the PWA demo tabs.
 */
export const PWA_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <p class="eyebrow">PWA</p>
    <h3>App-shell readiness</h3>
    <p class="subtitle">Keep installability clear and avoid caching API data.</p>
  </header>

  <ul class="checklist" aria-label="PWA checklist">
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
      <p>Ready: app shell caches static assets and avoids API caching.</p>
    } @else {
      <p>Missing: {{ readiness().missing.join(', ') }}</p>
    }
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ChecklistKey = 'manifest' | 'appShell' | 'noApiCache' | 'updatePrompt' | 'offlineFallback';

type ChecklistItem = {
  key: ChecklistKey;
  label: string;
  description: string;
};

const ITEMS: ChecklistItem[] = [
  { key: 'manifest', label: 'Manifest & icons', description: 'Valid name, start_url, scope, icons 192/512.' },
  { key: 'appShell', label: 'App shell cache', description: 'Static assets cached, routes fall back to index.' },
  { key: 'noApiCache', label: 'No API caching', description: 'External data not added to SW config.' },
  { key: 'updatePrompt', label: 'Update prompt', description: 'SwUpdate available → prompt → activateUpdate().' },
  { key: 'offlineFallback', label: 'Offline fallback', description: 'Optional page for navigation failures.' }
];

@Component({
  selector: 'app-pwa-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pwa-demo.html',
  styleUrl: './pwa-demo.css'
})
export class PwaDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<ChecklistKey, boolean>>({
    manifest: true,
    appShell: true,
    noApiCache: true,
    updatePrompt: false,
    offlineFallback: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: ChecklistKey): void {
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
