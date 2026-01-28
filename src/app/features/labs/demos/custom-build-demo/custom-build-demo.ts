import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type BuildKey = 'goals' | 'pipeline' | 'cache' | 'ssrChecks' | 'rollback';

type BuildItem = {
  key: BuildKey;
  label: string;
  description: string;
};

const ITEMS: BuildItem[] = [
  {
    key: 'goals',
    label: $localize`:@@customDemoItemGoals:Goals/constraints`,
    description: $localize`:@@customDemoItemGoalsDesc:Metrics + constraints written down.`
  },
  {
    key: 'pipeline',
    label: $localize`:@@customDemoItemPipeline:Pipeline steps`,
    description: $localize`:@@customDemoItemPipelineDesc:Lint → test → build with tools noted.`
  },
  {
    key: 'cache',
    label: $localize`:@@customDemoItemCache:Cache/artifacts`,
    description: $localize`:@@customDemoItemCacheDesc:Cache keys + invalidation plan set.`
  },
  {
    key: 'ssrChecks',
    label: $localize`:@@customDemoItemSsr:SSR/CSR checks`,
    description: $localize`:@@customDemoItemSsrDesc:Smoke render + hydration watch included.`
  },
  {
    key: 'rollback',
    label: $localize`:@@customDemoItemRollback:Rollback/observability`,
    description: $localize`:@@customDemoItemRollbackDesc:Fallback and logs/metrics defined.`
  }
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
