/**
 * Read-only code samples used by the A11y & Aria demo tabs.
 */
export const A11Y_ARIA_DEMO_CODE = {
  html: `<section class="demo" aria-labelledby="a11y-title">
  <header class="demo-header">
    <p class="eyebrow">A11y &amp; Aria</p>
    <h3 id="a11y-title">Accessible filter panel</h3>
    <p class="subtitle">Labels, helper text, and live updates without stealing focus.</p>
  </header>

  <form class="panel" (submit)="applyFilters($event)" aria-describedby="filters-help">
    <p id="filters-help" class="visually-hidden">
      All fields are required. Results update in the status region below.
    </p>

    <label class="field" for="filter-query">
      <span class="field__label">Search query</span>
      <input
        id="filter-query"
        type="text"
        [value]="query()"
        (input)="updateQuery(queryField.value)"
        aria-describedby="filter-query-help"
        #queryField
      />
      <span id="filter-query-help" class="field__meta">Keep it short and specific.</span>
    </label>

    <fieldset class="field" aria-describedby="type-help">
      <legend class="field__label">Pokemon type</legend>
      <p id="type-help" class="field__meta">Use arrow keys or tab to move through options.</p>
      <div class="choices">
        @for (type of types; track type) {
          <label class="choice">
            <input
              type="radio"
              name="type"
              [value]="type"
              [checked]="type === activeType()"
              (change)="setType(type)"
            />
            <span class="choice__label">{{ type }}</span>
          </label>
        }
      </div>
    </fieldset>

    <button class="apply" type="submit">Apply filters</button>
  </form>

  <div class="results" aria-live="polite" aria-atomic="true">
    {{ resultsMessage() }}
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

const MOCK_COUNTS: Record<string, number> = {
  electric: 12,
  fire: 9,
  water: 15
};

@Component({
  selector: 'app-a11y-aria-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './a11y-aria-demo.html',
  styleUrl: './a11y-aria-demo.css'
})
export class A11yAriaDemoComponent {
  readonly types = ['electric', 'fire', 'water'];
  readonly query = signal('Pikachu');
  readonly activeType = signal<string>('electric');
  readonly resultsCount = signal<number>(MOCK_COUNTS.electric);

  readonly resultsMessage = computed(() => {
    const query = this.query().trim() || 'any query';
    const type = this.activeType();
    const count = this.resultsCount();
    return \`\${count} results for \"\${query}\" (\${type}).\`;
  });

  updateQuery(value: string): void {
    this.query.set(value);
  }

  setType(type: string): void {
    this.activeType.set(type);
  }

  applyFilters(event: Event): void {
    event.preventDefault();
    const nextCount = MOCK_COUNTS[this.activeType()] ?? 0;
    this.resultsCount.set(nextCount);
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

.panel {
  display: grid;
  gap: 0.75rem;
  border: 2px solid var(--ink-900);
  padding: 0.75rem;
  background: var(--paper-2);
}

.field {
  display: grid;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.field__meta {
  font-size: 0.75rem;
  color: var(--ink-700);
}

.field input:not([type="radio"]) {
  border: 2px solid var(--ink-900);
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
}

.choices {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.choice {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--ink-500);
  border-radius: 0.35rem;
  background: #fff;
}

.choice__label {
  text-transform: capitalize;
}

.apply {
  justify-self: start;
  border: 2px solid var(--ink-900);
  background: var(--ink-900);
  color: #fff;
  padding: 0.45rem 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.results {
  border: 2px solid var(--ink-900);
  padding: 0.6rem 0.75rem;
  background: var(--paper-2);
  font-weight: 700;
}

.visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
`
};
