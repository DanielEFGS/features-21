import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ChecklistKey = 'manifest' | 'appShell' | 'noApiCache' | 'updatePrompt' | 'offlineFallback';

type ChecklistItem = {
  key: ChecklistKey;
  label: string;
  description: string;
};

const ITEMS: ChecklistItem[] = [
  { key: 'manifest', label: 'Manifest & icons', description: 'Valid name, start_url, scope, icons 192/512.' },
  { key: 'appShell', label: 'App shell cache', description: 'Static assets cached, routes fall back to index.' },
  { key: 'noApiCache', label: 'No API caching', description: 'External data not added to SW config.' },
  { key: 'updatePrompt', label: 'Update prompt', description: 'SwUpdate available → prompt → activateUpdate().' },
  { key: 'offlineFallback', label: 'Offline fallback', description: 'Optional page for navigation failures.' }
];

@Component({
  selector: 'app-pwa-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pwa-demo.html',
  styleUrl: './pwa-demo.css'
})
export class PwaDemoComponent {
  readonly items = ITEMS;
  readonly state = signal<Record<ChecklistKey, boolean>>({
    manifest: true,
    appShell: true,
    noApiCache: true,
    updatePrompt: false,
    offlineFallback: false
  });

  readonly readiness = computed(() => {
    const all = this.state();
    const missing = this.items.filter((item) => !all[item.key]).map((item) => item.label);
    const score = Math.round(
      (Object.values(all).filter(Boolean).length / this.items.length) * 100
    );
    return { missing, score };
  });

  toggle(key: ChecklistKey): void {
    this.state.update((current) => ({ ...current, [key]: !current[key] }));
  }
}
