/**
 * Read-only code samples used by the Routing demo tabs.
 */
export const ROUTING_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">Routing</p>
      <h3>Query-param navigation</h3>
      <p class="subtitle">Use the router to swap panels without leaving the lab.</p>
    </div>
    <div class="url-pill">
      <p class="url-label">Current URL</p>
      <p class="url-value">{{ currentUrl() }}</p>
    </div>
  </header>

  <div class="nav">
    <p class="nav-label">Active view</p>
    <div class="nav-buttons" role="group" aria-label="Demo views">
      @for (option of options(); track option.id) {
        <button
          type="button"
          class="nav-button"
          [class.is-active]="activeView() === option.id"
          (click)="setView(option.id)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  </div>

  <article class="panel">
    <h4>{{ heading() }}</h4>
    <p class="panel-hint">{{ helper() }}</p>
    @if (activeView() === 'overview') {
      <p class="panel-body">
        The router reads the \`view\` query param and keeps the panel in sync with the URL.
      </p>
    } @else if (activeView() === 'guards') {
      <p class="panel-body">
        A real guard would block navigation. Here we just show how a guard can change the
        allowed view.
      </p>
    } @else {
      <p class="panel-body">
        A resolver would prefetch data for the detail panel before rendering it.
      </p>
    }
  </article>
</section>
`,
  ts: `import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type DemoView = 'overview' | 'guards' | 'resolve';

type DemoViewOption = {
  id: DemoView;
  label: string;
  hint: string;
};

const VIEW_OPTIONS: DemoViewOption[] = [
  { id: 'overview', label: 'Overview', hint: 'Default panel from the URL.' },
  { id: 'guards', label: 'Guards', hint: 'Simulate blocking access with a guard.' },
  { id: 'resolve', label: 'Resolvers', hint: 'Simulate data preloading.' }
];

@Component({
  selector: 'app-routing-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './routing-demo.html',
  styleUrl: './routing-demo.css'
})
export class RoutingDemoComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly options = signal(VIEW_OPTIONS);

  readonly activeView = signal<DemoView>('overview');
  readonly currentUrl = signal(this.router.url);

  readonly heading = computed(() => {
    const option = this.options().find((item) => item.id === this.activeView());
    return option?.label ?? 'Overview';
  });

  readonly helper = computed(() => {
    const option = this.options().find((item) => item.id === this.activeView());
    return option?.hint ?? 'Default panel from the URL.';
  });

  constructor() {
    const initialView = this.readView(this.route.snapshot.queryParamMap.get('view'));
    this.activeView.set(initialView);
  }

  setView(view: DemoView): void {
    const target = this.readView(view);
    this.activeView.set(target);
    const tree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { view: target },
      queryParamsHandling: 'merge'
    });
    const url = this.router.serializeUrl(tree);
    this.location.replaceState(url);
    this.currentUrl.set(url);
  }

  private readView(value: string | null): DemoView {
    return value === 'guards' || value === 'resolve' ? value : 'overview';
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

.url-pill {
  border: 2px dashed var(--ink-900);
  background: var(--paper-2);
  padding: 0.4rem 0.7rem;
  min-width: 200px;
  max-width: 320px;
  word-break: break-word;
}

.url-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.6rem;
  color: var(--ink-600);
}

.url-value {
  margin: 0.3rem 0 0;
  font-size: 0.75rem;
  font-weight: 700;
}

.nav {
  display: grid;
  gap: 0.4rem;
}

.nav-label {
  margin: 0;
  font-weight: 700;
}

.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-button {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.3rem 0.7rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink-900);
}

.nav-button.is-active {
  background: var(--accent);
}

.panel {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.85rem;
  box-shadow: 3px 3px 0 var(--ink-900);
  display: grid;
  gap: 0.4rem;
}

.panel h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.panel-hint {
  margin: 0;
  color: var(--ink-600);
}

.panel-body {
  margin: 0;
}
`
};
