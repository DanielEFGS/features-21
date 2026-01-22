/**
 * Read-only code samples used by the DI demo tabs.
 */
export const DI_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">DI</p>
      <h3>Notes service scope</h3>
      <p class="subtitle">Inject a shared service and see how provider scope changes state.</p>
    </div>
    <div class="scope-pill">
      <p class="scope-label">Provider scope</p>
      <p class="scope-value">{{ scopeLabel() }}</p>
    </div>
  </header>

  <div class="input-row">
    <label class="field-label" for="di-note">New note</label>
    <div class="input-actions">
      <input
        #noteInput
        id="di-note"
        type="text"
        [value]="inputValue()"
        (input)="updateValue(noteInput.value)"
        autocomplete="off"
      />
      <button type="button" (click)="addNote()" [disabled]="isEmpty()">Add</button>
      <button type="button" class="ghost" (click)="clearNotes()" [disabled]="notes().length === 0">
        Clear
      </button>
    </div>
  </div>

  <div class="list">
    <p class="list-title">Shared notes</p>
    @if (notes().length === 0) {
      <p class="empty">Add a note to see it shared within this component scope.</p>
    } @else {
      <ul>
        @for (note of notes(); track note.text) {
          <li>
            <span class="note-text">{{ note.text }}</span>
            <span class="note-tag">{{ note.source }}</span>
          </li>
        }
      </ul>
    }
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, inject, Injectable, signal } from '@angular/core';

type DemoNote = {
  text: string;
  source: 'root' | 'local';
};

@Injectable({ providedIn: 'root' })
export class DemoNotesService {
  readonly notes = signal<DemoNote[]>([]);

  add(text: string, source: DemoNote['source']): void {
    this.notes.update((current) => [...current, { text, source }]);
  }

  clear(): void {
    this.notes.set([]);
  }
}

@Component({
  selector: 'app-di-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './di-demo.html',
  styleUrl: './di-demo.css',
  providers: [DemoNotesService]
})
export class DiDemoComponent {
  private readonly notesService = inject(DemoNotesService);
  readonly notes = this.notesService.notes;
  readonly inputValue = signal('');
  readonly isEmpty = computed(() => this.inputValue().trim().length === 0);
  readonly scopeLabel = computed(() => 'Component provider');

  updateValue(value: string): void {
    this.inputValue.set(value);
  }

  addNote(): void {
    const text = this.inputValue().trim();
    if (!text) return;
    this.notesService.add(text, 'local');
    this.inputValue.set('');
  }

  clearNotes(): void {
    this.notesService.clear();
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

.scope-pill {
  border: 2px dashed var(--ink-900);
  background: var(--paper-2);
  padding: 0.4rem 0.7rem;
  min-width: 170px;
}

.scope-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.6rem;
  color: var(--ink-600);
}

.scope-value {
  margin: 0.3rem 0 0;
  font-size: 0.75rem;
  font-weight: 700;
}

.input-row {
  display: grid;
  gap: 0.4rem;
}

.input-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
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

.ghost {
  background: var(--paper-2);
}

.list {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.75rem;
  box-shadow: 3px 3px 0 var(--ink-900);
  display: grid;
  gap: 0.5rem;
}

.list-title {
  margin: 0;
  font-weight: 700;
}

.list ul {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.35rem;
  list-style: disc;
}

.list li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.note-text {
  font-weight: 600;
}

.note-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-600);
}

.empty {
  margin: 0;
  color: var(--ink-600);
  font-size: 0.85rem;
}
`
};
