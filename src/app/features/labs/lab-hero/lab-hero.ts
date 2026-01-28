import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';
import { LabContent } from '../labs.models';
import { LAB_I18N } from '../labs.i18n';

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

  readonly statusLabel = computed(() => LAB_I18N.status[this.lab().status] ?? this.lab().status);
  readonly levelLabel = computed(() => LAB_I18N.level[this.lab().level] ?? this.lab().level);
}
