import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

type DemoPokemon = {
  name: string;
  type: string;
};

/**
 * Read-only demo used in the Signals lab.
 */
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

  readonly summaryText = computed(() => `Selected: ${this.selectedCount()}/3`);

  /**
   * Persists the current selection in session storage.
   */
  readonly persistSelection = effect(() => {
    const value = this.selectedNames();
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem('lab-signals-selection', JSON.stringify(value));
  });

  /**
   * Adds a name to the selection list when under the limit.
   * @param name Pokemon name.
   */
  add(name: string): void {
    this.selectedNames.update((current) => {
      if (current.includes(name) || current.length >= 3) {
        return current;
      }
      return [...current, name];
    });
  }

  /**
   * Removes a name from the selection list.
   * @param name Pokemon name.
   */
  remove(name: string): void {
    this.selectedNames.update((current) => current.filter((item) => item !== name));
  }

  /**
   * Clears all selections.
   */
  clear(): void {
    this.selectedNames.set([]);
  }
}
