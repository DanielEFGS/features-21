import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';
import { LAB_CATALOG } from '../labs.data';
import { LAB_I18N } from '../labs.i18n';
import { LabCatalogItem } from '../labs.models';

@Component({
  selector: 'app-labs-index-page',
  imports: [RouterLink, TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './labs-index-page.html',
  styleUrl: './labs-index-page.css'
})
export class LabsIndexPage {
  readonly labs: LabCatalogItem[];
  readonly statusLabel = (status: keyof typeof LAB_I18N.status) => LAB_I18N.status[status] ?? status;
  readonly levelLabel = (level: keyof typeof LAB_I18N.level) => LAB_I18N.level[level] ?? level;

  constructor() {
    // Assign explicitly to avoid surprises from test instrumentation.
    this.labs = LAB_CATALOG;
  }
}
