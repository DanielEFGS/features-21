import { Location } from '@angular/common';
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

/**
 * Read-only demo used in the Routing lab.
 */
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

  /**
   * Updates the current view by writing a query param.
   * @param view Target view id.
   */
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
