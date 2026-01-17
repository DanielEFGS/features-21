import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

@Component({
  selector: 'app-docs-page',
  imports: [TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './docs-page.html',
  styleUrl: './docs-page.css'
})
export class DocsPage {}
