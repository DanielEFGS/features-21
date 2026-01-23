import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type TestKey = 'ssrSafe' | 'httpMock' | 'routerHarness' | 'hydrationGuard' | 'a11yCheck';

type TestItem = {
  key: TestKey;
  label: string;
  description: string;
};

const ITEMS: TestItem[] = [
  { key: 'ssrSafe', label: 'SSR-safe setup', description: 'No window/document; use guards/mocks.' },
  { key: 'httpMock', label: 'HTTP mocked', description: 'HttpTestingController flushes requests.' },
  { key: 'routerHarness', label: 'Router harness', description: 'RouterTestingHarness drives navigation.' },
  { key: 'hydrationGuard', label: 'Hydration guard', description: 'Branches covered for server/client differences.' },
  { key: 'a11yCheck', label: 'A11y smoke', description: 'Optional axe-core or similar check for markup.' }
];

@Component({
  selector: 'app-testing-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testing-demo.html',
  styleUrl: './testing-demo.css'
})
export class TestingDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<TestKey, boolean>>({
    ssrSafe: true,
    httpMock: true,
    routerHarness: false,
    hydrationGuard: false,
    a11yCheck: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: TestKey): void {
    this.state.update((current) => ({ ...current, [key]: !current[key] }));
  }
}
