/**
 * Read-only code samples used by the Signals demo tabs.
 */
export const SIGNALS_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">Signals</p>
      <h3>Quick compare panel</h3>
    </div>
    <button type="button" class="clear" (click)="clear()" [disabled]="selectedCount() === 0">
      Clear
    </button>
  </header>

  <p class="summary">{{ summaryText() }}</p>

  <ul class="pokemon-list">
    @for (item of availablePokemon(); track item.name) {
      <li class="pokemon-item">
        <div>
          <p class="name">{{ item.name }}</p>
          <p class="type">{{ item.type }}</p>
        </div>
        <div class="actions">
          <button
            type="button"
            (click)="add(item.name)"
            [disabled]="isLimitReached() || selectedNames().includes(item.name)"
          >
            Add
          </button>
          <button type="button" (click)="remove(item.name)" [disabled]="!selectedNames().includes(item.name)">
            Remove
          </button>
        </div>
      </li>
    }
  </ul>

  @if (selectedDetails().length === 0) {
    <p class="empty">Select up to three Pokemon to compare.</p>
  } @else {
    <div class="selected-grid">
      @for (item of selectedDetails(); track item.name) {
        <article class="selected-card">
          <h4>{{ item.name }}</h4>
          <p>{{ item.type }}</p>
        </article>
      }
    </div>
  }
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type DemoPokemon = {
  name: string;
  type: string;
};

@Component({
  selector: 'app-signals-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signals-demo.html',
  styleUrl: './signals-demo.css'
})
export class SignalsDemoComponent {
  readonly availablePokemon = signal<DemoPokemon[]>([
    { name: 'Pikachu', type: 'Electric' },
    { name: 'Bulbasaur', type: 'Grass' },
    { name: 'Charmander', type: 'Fire' },
    { name: 'Squirtle', type: 'Water' }
  ]);

  readonly selectedNames = signal<string[]>([]);

  readonly selectedCount = computed(() => this.selectedNames().length);
  readonly isLimitReached = computed(() => this.selectedCount() >= 3);

  readonly selectedDetails = computed(() => {
    const selected = this.selectedNames();
    return this.availablePokemon().filter((item) => selected.includes(item.name));
  });

  readonly summaryText = computed(() => \`Selected: \${this.selectedCount()}/3\`);

  add(name: string): void {
    this.selectedNames.update((current) => {
      if (current.includes(name) || current.length >= 3) {
        return current;
      }
      return [...current, name];
    });
  }

  remove(name: string): void {
    this.selectedNames.update((current) => current.filter((item) => item !== name));
  }

  clear(): void {
    this.selectedNames.set([]);
  }
}
`,
  css: `.demo {
  display: grid;
  gap: 1rem;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.65rem;
  color: var(--ink-600);
}

h3 {
  margin: 0.3rem 0 0;
  font-size: 1rem;
  font-weight: 700;
}

.clear {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--ink-900);
}

.clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary {
  margin: 0;
  font-weight: 700;
}

.pokemon-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
}

.pokemon-item {
  border: 2px solid var(--ink-900);
  background: var(--paper-2);
  padding: 0.6rem 0.75rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.name {
  margin: 0;
  font-weight: 700;
}

.type {
  margin: 0;
  font-size: 0.8rem;
  color: var(--ink-600);
}

.actions {
  display: flex;
  gap: 0.4rem;
}

.actions button {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.2rem 0.5rem;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink-900);
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selected-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.6rem;
}

.selected-card {
  border: 2px dashed var(--ink-900);
  background: #fff;
  padding: 0.6rem;
  display: grid;
  gap: 0.2rem;
}

.selected-card h4 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
}

.selected-card p {
  margin: 0;
  font-size: 0.75rem;
  color: var(--ink-600);
}

.empty {
  margin: 0;
  font-size: 0.85rem;
  color: var(--ink-600);
}
`
};
