/**
 * Read-only code samples used by the RxJS interop demo tabs.
 */
export const RXJS_INTEROP_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">RxJS interop</p>
      <h3>Debounced search helper</h3>
      <p class="subtitle">Bridge input streams into signals and expose outputs as Observables.</p>
    </div>
    <div class="meta">
      <p class="meta-label">Applied</p>
      <p class="meta-value">{{ appliedCount() }}</p>
    </div>
  </header>

  <div class="input-row">
    <label class="field-label" for="rxjs-query">Search term</label>
    <div class="input-actions">
      <input
        #queryInput
        id="rxjs-query"
        type="text"
        [value]="liveInput()"
        (input)="updateInput(queryInput.value)"
        autocomplete="off"
      />
      <button type="button" (click)="apply()" [disabled]="isApplyDisabled()">Apply</button>
    </div>
  </div>

  <div class="chip-row">
    <div class="chip">
      <p class="chip-label">Debounced signal</p>
      <p class="chip-value">{{ query() || '—' }}</p>
    </div>
    <div class="chip">
      <p class="chip-label">Normalized via toObservable</p>
      <p class="chip-value">{{ normalizedQuery() || '—' }}</p>
    </div>
  </div>

  <div class="log">
    <p class="log-title">Output stream</p>
    @if (appliedLog().length === 0) {
      <p class="empty">No output yet. Click Apply to emit an event.</p>
    } @else {
      <ul class="log-list">
        @for (entry of appliedLog(); track entry) {
          <li>{{ entry }}</li>
        }
      </ul>
    }
  </div>
</section>
`,
  ts: `import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  outputFromObservable,
  outputToObservable,
  takeUntilDestroyed,
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, filter, map, scan } from 'rxjs';

@Component({
  selector: 'app-rxjs-interop-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rxjs-interop-demo.html',
  styleUrl: './rxjs-interop-demo.css'
})
export class RxjsInteropDemoComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly input$ = new Subject<string>();
  private readonly applyClicks$ = new Subject<string>();

  readonly liveInput = signal('');

  readonly query = toSignal(this.input$.pipe(debounceTime(300), distinctUntilChanged()), {
    initialValue: ''
  });

  readonly normalizedQuery$ = toObservable(this.query).pipe(
    map((value) => value.trim().toLowerCase())
  );
  readonly normalizedQuery = toSignal(this.normalizedQuery$, { initialValue: '' });

  readonly applied = outputFromObservable(this.applyClicks$);
  readonly applied$ = outputToObservable(this.applied);

  readonly appliedCount = signal(0);
  readonly appliedLog = toSignal(
    this.applied$.pipe(
      map((value) => value.trim()),
      filter((value) => value.length > 0),
      scan((entries, value) => [value, ...entries].slice(0, 4), [] as string[])
    ),
    { initialValue: [] }
  );

  readonly isApplyDisabled = computed(() => this.liveInput().trim().length === 0);

  constructor() {
    this.applied$
      .pipe(
        map((value) => value.trim()),
        filter((value) => value.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.appliedCount.update((count) => count + 1);
      });
  }

  updateInput(value: string): void {
    this.liveInput.set(value);
    this.input$.next(value);
  }

  apply(): void {
    const value = this.liveInput().trim();
    if (!value) return;
    this.applyClicks$.next(value);
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
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
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

.subtitle {
  margin: 0.4rem 0 0;
  color: var(--ink-600);
  font-size: 0.85rem;
}

.meta {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.4rem 0.7rem;
  box-shadow: 3px 3px 0 var(--ink-900);
  text-align: center;
  min-width: 90px;
}

.meta-label {
  margin: 0;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-600);
}

.meta-value {
  margin: 0.2rem 0 0;
  font-size: 1rem;
  font-weight: 700;
}

.input-row {
  display: grid;
  gap: 0.4rem;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

input {
  flex: 1;
  min-width: 200px;
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
}

button {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.35rem 0.7rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink-900);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chip-row {
  display: grid;
  gap: 0.6rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.chip {
  border: 2px dashed var(--ink-900);
  background: var(--paper-2);
  padding: 0.6rem 0.75rem;
  display: grid;
  gap: 0.2rem;
}

.chip-label {
  margin: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-600);
}

.chip-value {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.log {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.75rem;
  box-shadow: 3px 3px 0 var(--ink-900);
  display: grid;
  gap: 0.5rem;
}

.log-title {
  margin: 0;
  font-weight: 700;
}

.log-list {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.3rem;
  list-style: disc;
}

.empty {
  margin: 0;
  color: var(--ink-600);
  font-size: 0.85rem;
}
`
};
