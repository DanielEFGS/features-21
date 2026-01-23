import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type BuildKey = 'goals' | 'pipeline' | 'cache' | 'ssrChecks' | 'rollback';

type BuildItem = {
  key: BuildKey;
  label: string;
  description: string;
};

const ITEMS: BuildItem[] = [
  { key: 'goals', label: 'Goals/constraints', description: 'Metrics + constraints written down.' },
  { key: 'pipeline', label: 'Pipeline steps', description: 'Lint → test → build with tools noted.' },
  { key: 'cache', label: 'Cache/artifacts', description: 'Cache keys + invalidation plan set.' },
  { key: 'ssrChecks', label: 'SSR/CSR checks', description: 'Smoke render + hydration watch included.' },
  { key: 'rollback', label: 'Rollback/observability', description: 'Fallback and logs/metrics defined.' }
];

@Component({
  selector: 'app-custom-build-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-build-demo.html',
  styleUrl: './custom-build-demo.css'
})
export class CustomBuildDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<BuildKey, boolean>>({
    goals: true,
    pipeline: true,
    cache: false,
    ssrChecks: false,
    rollback: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: BuildKey): void {
    this.state.update((current) => ({ ...current, [key]: !current[key] }));
  }
}
