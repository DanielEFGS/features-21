import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ToggleKey = 'padding' | 'radius' | 'shadow' | 'accent' | 'outline';

type ToggleOption = {
  key: ToggleKey;
  label: string;
  className: string;
  description: string;
};

const TOGGLE_OPTIONS: ToggleOption[] = [
  { key: 'padding', label: $localize`:@@twDemoPadding:Padding`, className: 'p-5', description: $localize`:@@twDemoPaddingDesc:Apply generous spacing.` },
  { key: 'radius', label: $localize`:@@twDemoRadius:Rounded corners`, className: 'rounded-xl', description: $localize`:@@twDemoRadiusDesc:Soften edges.` },
  { key: 'shadow', label: $localize`:@@twDemoShadow:Shadow`, className: 'shadow-md', description: $localize`:@@twDemoShadowDesc:Lift the card slightly.` },
  { key: 'accent', label: $localize`:@@twDemoAccent:Accent background`, className: 'bg-slate-100', description: $localize`:@@twDemoAccentDesc:Subtle neutral fill.` },
  { key: 'outline', label: $localize`:@@twDemoOutline:Outline`, className: 'ring-2 ring-slate-400', description: $localize`:@@twDemoOutlineDesc:Add a focus ring style.` }
];

@Component({
  selector: 'app-tailwind-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tailwind-demo.html',
  styleUrl: './tailwind-demo.css'
})
export class TailwindDemoComponent {
  readonly options = TOGGLE_OPTIONS;
  readonly activeToggles = signal<Record<ToggleKey, boolean>>({
    padding: true,
    radius: true,
    shadow: true,
    accent: true,
    outline: false
  });

  readonly classList = computed(() => {
    const active = this.activeToggles();
    const base = ['text-sm', 'font-medium', 'border', 'border-slate-900', 'transition-colors'];
    const selected = this.options
      .filter((option) => active[option.key])
      .map((option) => option.className);
    return [...base, ...selected].join(' ');
  });

  /**
   * Toggles a utility option on or off.
   * @param key Toggle option key.
   */
  toggle(key: ToggleKey): void {
    this.activeToggles.update((current) => ({ ...current, [key]: !current[key] }));
  }
}
