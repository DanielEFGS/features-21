import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type CdkKey = 'overlay' | 'focus' | 'portal' | 'accessibility' | 'restoreFocus';

type CdkItem = {
  key: CdkKey;
  label: string;
  description: string;
};

const ITEMS: CdkItem[] = [
  {
    key: 'overlay',
    label: $localize`:@@cdkDemoItemOverlay:Overlay plan`,
    description: $localize`:@@cdkDemoItemOverlayDesc:Backdrop + escape to close; positioned pane.`
  },
  {
    key: 'focus',
    label: $localize`:@@cdkDemoItemFocus:Focus helpers`,
    description: $localize`:@@cdkDemoItemFocusDesc:cdkFocusInitial and FocusTrap configured.`
  },
  {
    key: 'portal',
    label: $localize`:@@cdkDemoItemPortal:Portal usage`,
    description: $localize`:@@cdkDemoItemPortalDesc:Content rendered via portal/outlet.`
  },
  {
    key: 'accessibility',
    label: $localize`:@@cdkDemoItemA11y:A11y`,
    description: $localize`:@@cdkDemoItemA11yDesc:Labels/aria-labelledby applied to surface.`
  },
  {
    key: 'restoreFocus',
    label: $localize`:@@cdkDemoItemRestore:Restore focus`,
    description: $localize`:@@cdkDemoItemRestoreDesc:Return focus to trigger on close.`
  }
];

@Component({
  selector: 'app-cdk-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cdk-demo.html',
  styleUrl: './cdk-demo.css'
})
export class CdkDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<CdkKey, boolean>>({
    overlay: true,
    focus: true,
    portal: false,
    accessibility: true,
    restoreFocus: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: CdkKey): void {
    this.state.update((current) => ({ ...current, [key]: !current[key] }));
  }
}
