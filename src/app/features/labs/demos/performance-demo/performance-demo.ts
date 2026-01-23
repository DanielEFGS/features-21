import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type PerfKey = 'budgets' | 'defer' | 'images' | 'fonts' | 'network';

type PerfItem = {
  key: PerfKey;
  label: string;
  description: string;
};

const ITEMS: PerfItem[] = [
  { key: 'budgets', label: 'Budgets set', description: 'JS/CSS limits defined and monitored.' },
  { key: 'defer', label: 'Defer plan', description: 'Non-critical views/widgets deferred or lazy.' },
  { key: 'images', label: 'Images optimized', description: 'NgOptimizedImage + sizes; lazy non-critical.' },
  { key: 'fonts', label: 'Fonts tamed', description: 'Preconnect + font-display swap.' },
  { key: 'network', label: 'Network disciplined', description: 'Concurrency capped, dedupe in place.' }
];

@Component({
  selector: 'app-performance-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './performance-demo.html',
  styleUrl: './performance-demo.css'
})
export class PerformanceDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<PerfKey, boolean>>({
    budgets: true,
    defer: false,
    images: true,
    fonts: false,
    network: true
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: PerfKey): void {
    this.state.update((current) => ({ ...current, [key]: !current[key] }));
  }
}
