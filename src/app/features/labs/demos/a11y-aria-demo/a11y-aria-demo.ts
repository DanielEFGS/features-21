import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

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
  readonly resultsCount = signal<number>(MOCK_COUNTS['electric']);

  readonly resultsMessage = computed(() => {
    const query = this.query().trim() || 'any query';
    const type = this.activeType();
    const count = this.resultsCount();
    return `${count} results for "${query}" (${type}).`;
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
