/**
 * Read-only code samples used by the CDK demo tabs.
 */
export const CDK_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <p class="eyebrow">CDK</p>
    <h3>Overlay & focus checklist</h3>
    <p class="subtitle">Overlay plan, focus trapping, portals, and focus restore.</p>
  </header>

  <ul class="checklist" aria-label="CDK checklist">
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
      <p>Overlay plan covers focus, portals, and accessibility.</p>
    } @else {
      <p>Missing: {{ readiness().missing.join(', ') }}</p>
    }
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type CdkKey = 'overlay' | 'focus' | 'portal' | 'accessibility' | 'restoreFocus';

type CdkItem = {
  key: CdkKey;
  label: string;
  description: string;
};

const ITEMS: CdkItem[] = [
  { key: 'overlay', label: 'Overlay plan', description: 'Backdrop + escape to close; positioned pane.' },
  { key: 'focus', label: 'Focus helpers', description: 'cdkFocusInitial and FocusTrap configured.' },
  { key: 'portal', label: 'Portal usage', description: 'Content rendered via portal/outlet.' },
  { key: 'accessibility', label: 'A11y', description: 'Labels/aria-labelledby applied to surface.' },
  { key: 'restoreFocus', label: 'Restore focus', description: 'Return focus to trigger on close.' }
];

@Component({
  selector: 'app-cdk-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cdk-demo.html',
  styleUrl: './cdk-demo.css'
})
export class CdkDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<CdkKey, boolean>>({
    overlay: true,
    focus: true,
    portal: false,
    accessibility: true,
    restoreFocus: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: CdkKey): void {
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
