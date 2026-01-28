import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

const MOCK_COUNTS: Record<string, number> = {
  electric: 12,
  fire: 9,
  water: 15
};

const TYPE_LABELS: Record<string, string> = {
  electric: $localize`:@@a11yDemoTypeElectric:Electric`,
  fire: $localize`:@@a11yDemoTypeFire:Fire`,
  water: $localize`:@@a11yDemoTypeWater:Water`
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
    const query = this.query().trim() || $localize`:@@a11yDemoAnyQuery:any query`;
    const typeKey = this.activeType();
    const typeLabel = TYPE_LABELS[typeKey] ?? typeKey;
    const count = this.resultsCount();
    return $localize`:@@a11yDemoResults:${count} results for "${query}" (${typeLabel}).`;
  });

  updateQuery(value: string): void {
    this.query.set(value);
  }

  typeLabel(type: string): string {
    return TYPE_LABELS[type] ?? type;
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
