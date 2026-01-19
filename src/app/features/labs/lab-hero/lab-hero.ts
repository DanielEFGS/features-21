import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';
import { LabContent } from '../labs.models';

@Component({
  selector: 'app-lab-hero',
  imports: [RouterLink, TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lab-hero.html',
  styleUrl: './lab-hero.css'
})
/**
 * Hero panel for lab pages, showing summary metadata and outcomes.
 */
export class LabHero {
  readonly lab = input.required<LabContent>();

  readonly statusLabel = computed(() => this.formatLabel(this.lab().status));
  readonly levelLabel = computed(() => this.lab().level);

  /**
   * Formats a status string for display.
   * @param value Lab status identifier.
   * @returns Label-safe status text.
   */
  private formatLabel(value: string): string {
    return value.replace('-', ' ');
  }
}
