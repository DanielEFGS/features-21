import { ChangeDetectionStrategy, Component, computed, inject, Injectable, signal } from '@angular/core';

type DemoNote = {
  text: string;
  source: 'root' | 'local';
};

/**
 * Simple in-memory notes service to illustrate DI scope.
 */
@Injectable({ providedIn: 'root' })
export class DemoNotesService {
  readonly notes = signal<DemoNote[]>([]);

  /**
   * Adds a note to the list.
   * @param text Note text.
   * @param source Scope label.
   */
  add(text: string, source: DemoNote['source']): void {
    this.notes.update((current) => [...current, { text, source }]);
  }

  /**
   * Clears all notes.
   */
  clear(): void {
    this.notes.set([]);
  }
}

/**
 * Read-only demo used in the DI lab.
 */
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
  readonly scopeLabel = computed(() => $localize`:@@diDemoScopeValue:Component provider`);

  /**
   * Updates the note input.
   * @param value Input value.
   */
  updateValue(value: string): void {
    this.inputValue.set(value);
  }

  /**
   * Adds a new note using the component-scoped provider.
   */
  addNote(): void {
    const text = this.inputValue().trim();
    if (!text) return;
    this.notesService.add(text, 'local');
    this.inputValue.set('');
  }

  /**
   * Clears all notes.
   */
  clearNotes(): void {
    this.notesService.clear();
  }
}
